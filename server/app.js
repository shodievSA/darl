require('dotenv').config();
const express = require("express");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const Sequelize = require("sequelize");
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
const generateStreamDescription = require("./utils/gemini/generateStreamDescription.js");
const addNewDescription = require('./database/addNewDescription.js');
const addNewArticle = require("./database/addNewArticle.js");
const addNewReadme = require("./database/addNewReadme.js");
const addNewLogo = require("./database/addNewLogo.js");
const createPrompt = require('./utils/createPrompt.js');
const contactAdmin = require('./utils/contactAdmin.js');
const generateLogoDescription = require("./utils/gemini/generateLogoDescription.js");
const generateLogo = require('./utils/gemini/generateLogo.js');
const generateStreamReadme = require('./utils/gemini/generateStreamReadme.js');
const generateStreamArticle = require('./utils/gemini/generateStreamArticle.js');
const uploadImageToS3 = require('./utils/uploadImageToS3.js');
const getPresignedURL = require('./utils/getPresignedURL.js');
const getUserFreeTrials = require('./database/getUserFreeTrials.js');
const getUserBalance = require('./database/getUserBalance.js');
const reduceUserFreeTrials = require('./database/reduceUserFreeTrials.js');
const reduceUserBalance = require('./database/reduceUserBalance.js');
const manageUserBalance = require('./utils/manageUserBalance.js');
const generateStreamName = require('./utils/gemini/generateStreamName.js');
const addNewName = require('./database/addNewName.js');
const generateStreamFeatures = require('./utils/gemini/generateStreamFeatures.js');
const addNewFeatures = require('./database/addNewFeatures.js');
const generateStreamCustomPromptResponse = require('./utils/gemini/generateStreamCustomPromptResponse.js');
const addNewCustomPromptResponse = require('./database/addNewCustomPromptResponse.js');

const app = express();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres"
    }
);

const sessionStore = new SequelizeStore({
    db: sequelize,
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

    const { path } = req.body;
    const signenURL = await getPresignedURL(path);

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
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { sampleDescription } = req.body;
        const userID = req.session.userID;

        const author = "shodievSA";

        try {

            const prompt = await createPrompt({
                repoName,
                repoOwner,
                branchName,
                userID,
                res
            });

            res.write(`data: ${JSON.stringify({ type: "status", content: "Making sense of your code..." })}\n\n`);
     
            const description = await generateStreamDescription(prompt, sampleDescription, res);
            const descriptionDetails = await addNewDescription(userID, description, repoName);

            await manageUserBalance(userID, 0.2);

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
    
            const readme = await generateStreamReadme(prompt, res);
            const readmeDetails = await addNewReadme(userID, readme, repoName);
    
            await manageUserBalance(userID, 0.4);

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

app.get(
    '/api/v1/name-generation/:repoName/:repoOwner/:branchName', 
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

            const name = await generateStreamName(prompt, res);
            const nameDetails = await addNewName(userID, name, repoName);

            await manageUserBalance(userID, 0.2);

            const finalData = {
                type: "json",
                content: nameDetails
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
    async (req, res) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { repoName, repoOwner, branchName } = req.params;
        const { sampleArticle } = req.body;
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

            const article = await generateStreamArticle(prompt, sampleArticle, res);
            const articleDetails = await addNewArticle(userID, article, repoName);

            await manageUserBalance(userID, 0.4);

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

app.get(
    "/api/v1/features-generation/:repoName/:repoOwner/:branchName", 
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

            const features = await generateStreamFeatures(prompt, res);
            const featuresDetails = await addNewFeatures(userID, features, repoName);

            await manageUserBalance(userID, 0.4);

            const finalData = {
                type: "json",
                content: featuresDetails
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

            const logoDescription = await generateLogoDescription(prompt, companyName, logoStyle, backgroundColor);

            res.write(`data: ${JSON.stringify({ type: "status", content: "Generating logo..." })}\n\n`);

            const logo = await generateLogo(logoDescription); 
            const logoDetails = await addNewLogo(userID, repoName);

            await uploadImageToS3(logoDetails["value"], logo);

            const presignedURL = await getPresignedURL(logoDetails["value"]);

            await manageUserBalance(userID, 0.2);

            const finalData = {
                type: "json",
                content: { url: presignedURL, ...logoDetails }
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

app.post(
    "/api/v1/custom-prompt/:repoName/:repoOwner/:branchName", 
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

            const customPromptResponse = await generateStreamCustomPromptResponse(
                repoDetails, customPrompt, res
            );
            const customPromptResponseDetails = await addNewCustomPromptResponse(
                userID, customPromptResponse, repoName
            );

            await manageUserBalance(userID, 0.5);

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

app.get("*", async (req, res) => {

    if (req.session.userID) 
    {
        const refreshTokenExpirationDate = new Date(
            req.session.refreshTokenExpirationDate
        );
        const accessTokenExpirationDate = new Date(
            req.session.accessTokenExpirationDate
        );

        if (refreshTokenExpirationDate <= Date.now())
        {
            res.redirect('/registration');
        } 
        else if (accessTokenExpirationDate <= Date.now())
        {
            await refreshAccessToken(req.session.userID, req);

            const filePath = path.join(
                __dirname, 
                process.env.SPA_INDEX_PATH
            );
            res.sendFile(filePath);
        }
        else
        {
            const filePath = path.join(
                __dirname, 
                process.env.SPA_INDEX_PATH
            );
            res.sendFile(filePath);
        }
    } 
    else 
    {
        res.redirect("/registration");
    }

}); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The express app is running on port 3000`);
});




