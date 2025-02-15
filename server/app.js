require('dotenv').config();
const express = require("express");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const exchangeCode = require('./utils/exchangeCode.js');
const getUserInfo = require("./utils/getUserInfo.js");
const registerNewUser = require("./database/registerNewUser.js");
const getUserAccessToken = require("./database/getAccessToken.js");
const getUserHistory = require('./database/getUserHistory.js');
const refreshAccessToken = require("./utils/refreshAccessToken");
const isUserNew = require("./database/isUserNew.js");
const updateUserTokens = require("./database/updateUserTokens.js");
const createPrompt = require('./utils/createPrompt.js');
const contactAdmin = require('./utils/contactAdmin.js');
const generateLogo = require('./utils/gemini/generateLogo.js');
const getUserFreeTrials = require('./database/getUserFreeTrials.js');
const getUserBalance = require('./database/getUserBalance.js');
const reduceUserFreeTrials = require('./database/reduceUserFreeTrials.js');
const reduceUserBalance = require('./database/updateUserBalance.js');
const getUserTransactions = require('./database/getUserTransactions.js');
const getUserMonthlyUsage = require('./database/getUserMonthlyUsage.js');
const getRecentUserTransactions = require('./utils/getRecentUserTransactions.js');
const sequelize = require("./database/sequelize.js");
const gemini = require('./utils/gemini/gemini-services.js');
const userHistory = require('./database/user-history.js');
const { checkUserBalance} = require('./middleware/checkUserBalance.js');
const { uploadObject, getPresignedURL } = require('./utils/aws/s3-bucket/services.js');
const { createPayment, getPayment } = require('./utils/payze/services.js');
const updateUserCredits = require('./database/updateUserCredits.js');
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

const sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 24 * 60 * 60 * 1000,
    tableName: "sessions"
});

sessionStore.sync();

app.use(session({
    secret: process.env.SECRET_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    genid: function(req) {
        return crypto.randomBytes(32).toString('hex');
    }
}));
app.use(express.json());
app.use("/assets", express.static(
    path.join(__dirname, process.env.ASSETS_FOLDER_PATH)
));

const limiter = rateLimiter({
    windowMs: 1000 * 60 * 60 * 24,
    max: 5,
    handler: (req, res) => {
        res.status(429).send("You have reached your daily limit. Please try again later.");
    }
});

app.get("/registration", (req, res) => {

    const filePath = path.join(
        __dirname, 
        process.env.SPA_INDEX_PATH
    );

    res.sendFile(filePath);

});

app.get("/github/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.redirect("/registration");
    }
    try {
        const tokenData = await exchangeCode(code);

        const currentDate = Date.now(); 
        const refreshTokenExpiresIn = tokenData.refresh_token_expires_in * 1000;
        const accessTokenExpiresIn = tokenData.expires_in * 1000; 

        const refreshTokenExpirationDate = new Date(
            currentDate + refreshTokenExpiresIn - (1000 * 60 * 5)
        );
        const accessTokenExpirationDate = new Date(
            currentDate + accessTokenExpiresIn - (1000 * 60 * 5)
        );

        const userData = await getUserInfo(tokenData.access_token);

        req.session.userID = userData['id'];
        req.session.refreshTokenExpirationDate = refreshTokenExpirationDate;
        req.session.accessTokenExpirationDate = accessTokenExpirationDate;

        if (await isUserNew(userData['id']))
        {
            await registerNewUser(
                userData['id'], 
                tokenData['access_token'],
                tokenData['refresh_token']
            );
        } 
        else 
        {   
            await updateUserTokens(
                userData['id'], 
                tokenData['access_token'],
                tokenData['refresh_token']
            )
        }

        res.redirect("/");
    } 
    catch(err) 
    {
        console.log(err);
    }
});

app.get("/api/v1/user-repos", async (req, res) => {

    if (req.session.userID) {

        if (req.session.refreshTokenExpirationDate <= Date.now()) {

            res.redirect('/registration');

        } else if (req.session.accessTokenExpirationDate <= Date.now()) {

            await refreshAccessToken(req.session.userID, req);

        }

        const accessToken = await getUserAccessToken(req.session.userID);

        const instance = axios.create({
            baseURL: "https://api.github.com",
            timeout: 20000,
        });

        const githubResponse = await instance.get("/user/repos", {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (githubResponse.status == 200) {

            const repos = githubResponse.data;
            res.status(200).json(repos);

        } else {

            res.status(500).send(
                "We couldn't fetch your repositories due to the technical issues. Please try again later!"
            );

        }

    }

});

app.get("/api/v1/repo-branches/:repoOwner/:repoName", async (req, res) => {

    const { repoOwner, repoName } = req.params;
    const accessToken = await getUserAccessToken(req.session.userID);

    const githubRes = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/branches`,
        {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + accessToken,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }
    );

    let branches = await githubRes.json();
    branches = branches.map((branch) => branch.name);
    

    res.json({ branches });

});

app.get("/api/v1/user-history", async (req, res) => {

    if (req.session.userID) 
    {
        if (req.session.refreshTokenExpirationDate <= Date.now())
        {
            res.redirect('/registration');
        } 
        else if (req.session.accessTokenExpirationDate <= Date.now())
        {
            await refreshAccessToken(req.session.userID, req);
        }

        const history = await getUserHistory({
            userID: req.session.userID,
        });

        res.json({ history });
    }

});

app.post("/api/v1/generated-logo", async (req, res) => {

    const { key } = req.body;
    const signenURL = await getPresignedURL(key);

    res.json({ url: signenURL });

});

app.post("/api/v1/report-problem", limiter, async (req, res) => {

    if (req.session.userID) {

        if (req.session.refreshTokenExpirationDate <= Date.now()) {
            res.redirect('/registration');
        } else if (req.session.accessTokenExpirationDate <= Date.now()) {
            await refreshAccessToken(req.session.userID, req);
        }

        const userEmail = req.body['email'];
        const text = req.body['text'];

        let telegramResponse = await contactAdmin({
            userEmail: userEmail,
            userText: text,
            userID: req.session.userID
        });

        if (telegramResponse.status == 200) {
            res.status(200).send("Your message has been delivered successfully!");
        } else if (telegramResponse.status == 500) {
            res.status(500).send(
                "We couldn't deliver your message due to the technical issues. Please try again later!"
            );
        }
        
    }

});

app.get("/api/v1/delete-user", (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to log out.');
        }

        res.clearCookie('connect.sid');
        res.sendStatus(200);
    });

});

app.post(
    "/api/v1/description-generation/:repoName/:repoOwner/:branchName",
    checkUserBalance("description"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { sampleDescription, homepageURL } = req.body;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                homepageURL,
                userID,
                res
            });

            res.write(
                `data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`
            );
     
            const completeDescription = await gemini.streamDescription(
                prompt, sampleDescription, res
            );
            const descriptionDetails = await userHistory.addNewDescription(
                userID, completeDescription, repoName
            );

            await updateUserCredits({
                userID: userID,
                amount: -0.4,
                description: "description"
            });

            const finalData = {
                type: "json",
                content: descriptionDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);

            res.status(500).json({ 
                errorMessage: "An error occurred while generating the project description. Please try again." 
            });

        }

    }
);

app.get(
    "/api/v1/readme-generation/:repoName/:repoOwner/:branchName",
    checkUserBalance("readme"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);
    
            const completeReadme = await gemini.streamReadme(prompt, res);
            const readmeDetails = await userHistory.addNewReadme(userID, completeReadme, repoName);
    
            await updateUserCredits({
                userID: userID,
                amount: -0.4,
                description: "readme"
            });

            const finalData = {
                type: "json",
                content: readmeDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project README. Please try again."
            });

        }

    }
);

app.post(
    '/api/v1/landing-page-generation/:repoName/:repoOwner/:branchName', 
    checkUserBalance("landing"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { homepageURL } = req.body;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                homepageURL,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);

            const completeLandingPage = await gemini.streamLandingPage(prompt, res);
            const landingPageDetails = await userHistory.addNewLandingPage(
                userID, completeLandingPage, repoName
            );

            await updateUserCredits({
                userID: userID,
                amount: -0.4,
                description: "landing"
            });

            const finalData = {
                type: "json",
                content: landingPageDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project name. Please try again."
            });

        }

    }
);

app.post(
    "/api/v1/article-generation/:repoName/:repoOwner/:branchName", 
    checkUserBalance("article"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { sampleArticle, homepageURL } = req.body;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                homepageURL,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);

            const completeArticle = await gemini.streamArticle(
                prompt, sampleArticle, res
            );
            const articleDetails = await userHistory.addNewArticle(
                userID, completeArticle, repoName
            );

            await updateUserCredits({
                userID: userID,
                amount: -0.4,
                description: "article"
            });

            const finalData = {
                type: "json",
                content: articleDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project article. Please try again."
            });

        }

    }
);

app.post(
    "/api/v1/social-media-announcements-generation/:repoName/:repoOwner/:branchName", 
    checkUserBalance("social-media-announcements"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { homepageURL } = req.body;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                homepageURL,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);

            const announcements = await gemini.streamSocialMediaAnnouncements(prompt, res);
            const announcementsDetails = await userHistory.addNewSocialMediaAnnouncements(
                userID, announcements, repoName
            );

            await updateUserCredits({
                userID: userID,
                amount: -0.4,
                description: "announcements"
            });

            const finalData = {
                type: "json",
                content: announcementsDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
            
        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the features. Please try again."
            });

        }

    }
);

app.post(
    "/api/v1/logo-generation/:repoName/:repoOwner/:branchName",
    checkUserBalance("logo"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { companyName, logoStyle, backgroundColor } = req.body;
        const userID = req.session.userID;

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Creating prompt for logo..." })}\n\n`);

            const logoDescription = await gemini.generateLogoDescription(
                prompt, companyName, logoStyle, backgroundColor
            );

            res.write(`data: ${JSON.stringify({ type: "status", content: "Generating logo..." })}\n\n`);

            const logo = await generateLogo(logoDescription); 
            const logoDetails = await userHistory.addNewLogo(userID, repoName);
            
            await uploadObject(logoDetails, logo);
            await updateUserCredits({
                userID: userID,
                amount: -0.8,
                description: "logo"
            });

            const finalData = {
                type: "json",
                content: logoDetails
            };

            res.write(`data: ${JSON.stringify(finalData)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);
            
            res.status(500).json({
                errorMessage: "An error occurred while generating the project logo. Please try again."
            });

        }

    }
);

app.post(
    "/api/v1/custom-prompt/:repoName/:repoOwner/:branchName", 
    checkUserBalance("custom-prompt"),
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { customPrompt } = req.body;
        const userID = req.session.userID;

        try {

            const repoDetails = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);

            const customPromptResponse = await gemini.streamResponseForCustomPrompt(
                repoDetails, customPrompt, res
            );
            const customPromptResponseDetails = await userHistory.addNewCustomPromptResponse(
                userID, customPromptResponse, repoName
            );

            await updateUserCredits({
                userID: userID,
                amount: -0.5,
                description: "custom prompt"
            });

            const repoCodebase = {
                type: "json",
                content: customPromptResponseDetails
            };

            res.write(`data: ${JSON.stringify(repoCodebase)}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();

        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the features. Please try again."
            });

        }

    }
);

app.put("/api/v1/user-create-payment", async (req, res) => {

    const amount = Number(req.body.amount);
    const source = req.body.source;

    const paymentDetails = await createPayment({
        amount: amount,
        source: source
    });

    res.json({ paymentURL: paymentDetails.payment.paymentUrl });

});

app.post("/api/v1/payze-webhook-gateway", async (req, res) => {

    console.log("Payze sent an update");

});

app.get("/payze-payment-success", async (req, res) => {

    const { payment_transaction_id } = req.query;
    const { userID } = req.session;

    const paymentDetails = await getPayment({
        transactionID: payment_transaction_id
    });

    await updateUserCredits({
        userID: userID,
        amount: paymentDetails.amount,
        description: "Balance"
    });

    res.redirect("/pricing");
 
});

app.get("/api/v1/user-free-trials", async (req, res) => {

    const userID = req.session.userID;
    const freeTrialsLeft = await getUserFreeTrials(userID);

    res.json({ freeTrialsLeft });

});

app.get("/api/v1/user-balance", async (req, res) => {

    const userID = req.session.userID;
    const userBalance = await getUserBalance(userID);

    res.json({ balance: userBalance });

});

app.get("/api/v1/recent-user-transactions", async (req, res) => {

    const { userID } = req.session;
    const recentUserTransactions = await getRecentUserTransactions(userID);

    res.json({ recentTransactions: recentUserTransactions });

});

app.get("/api/v1/user-transactions", async(req, res) => {

    const { userID } = req.session;
    const userTransactions = await getUserTransactions(userID);

    res.json({ transactions: userTransactions });

});

app.get("/api/v1/user-monthly-usage", async (req, res) => {

    const { userID } = req.session;
    const monthlyUsage = await getUserMonthlyUsage(userID);

    res.json({ monthlyUsage: monthlyUsage });

});

app.patch("/api/v1/reduce-user-free-trials", async (req, res) => {

    const userID = req.session.userID;
    await reduceUserFreeTrials(userID);

    res.status(200).json({ 
        message: "User's free trial has been reduced by 1" 
    });

});

app.patch("/api/v1/reduce-user-balance", async (req, res) => {

    const userID = req.session.userID;
    const reduceBy = parseFloat(req.body.reduceBy);

    await reduceUserBalance(userID, reduceBy);

    res.status(200).json({
        message: `User's balance has been reduced by ${reduceBy}`
    });

});

app.get("*", authMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The express app is running on port 3000`);
});




