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
const generateDescription = require("./utils/gemini/generateDescription.js");
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
const { error } = require('console');

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
            console.log(repos);

            res.status(200).json(repos);

        } else {

            res.status(500).send(
                "We couldn't fetch your repositories due to the technical issues. Please try again later!"
            );

        }

    }

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

app.get(
    "/api/v1/project-description/:repoName/:repoOwner", 
    async (req, res) => {

        const repoName = req.params['repoName'];
        const owner = req.params['repoOwner'];

        try {

            const prompt = await createPrompt({
                repoName: repoName,
                owner: owner,
                userID: req.session.userID
            });
     
            const description = await generateStreamDescription(prompt);
    
            res.status(200).json({ description });

            await addNewDescription(req.session.userID, description, repoName);
            await manageUserBalance(req.session.userID, 0.2);

        } catch (err) {

            console.log(err);

            res.status(500).json({ 
                errorMessage: "An error occurred while generating the project description. Please try again." 
            });

        }

    }
);

app.get(
    "/api/v1/readme-generation/:repoName/:repoOwner",
    async (req, res) => {

        const { repoName, repoOwner } = req.params;

        try {

            const prompt = await createPrompt({
                repoName: repoName,
                owner: repoOwner,
                userID: req.session.userID
            });
    
            const readme = await generateStreamReadme(prompt);
    
            res.status(200).json({ readme });

            await addNewReadme(req.session.userID, readme, repoName);
            await manageUserBalance(req.session.userID, 0.4);
            
        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project README. Please try again."
            });

        }

    }
);

app.get(
    '/api/v1/name-generation/:repoName/:repoOwner', 
    async (req, res) => {

        const { repoName, repoOwner } = req.params;

        try {

            const prompt = await createPrompt({
                repoName: repoName,
                owner: repoOwner,
                userID: req.session.userID
            });

            const name = await generateStreamName(prompt);

            res.status(200).json({ name });

            await addNewName(req.session.userID, name, repoName);
            await manageUserBalance(req.session.userID, 0.2);
            
        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project name. Please try again."
            });

        }

    }
);

app.get(
    "/api/v1/article-generation/:repoName/:repoOwner", 
    async (req, res) => {

        const { repoName, repoOwner } = req.params;

        try {

            const prompt = await createPrompt({
                repoName: repoName,
                owner: repoOwner,
                userID: req.session.userID
            });

            const article = await generateStreamArticle(prompt);

            res.status(200).json({ article });

            await addNewArticle(req.session.userID, article, repoName);
            await manageUserBalance(req.session.userID, 0.4);
            
        } catch (err) {

            console.log(err);

            res.status(500).json({
                errorMessage: "An error occurred while generating the project article. Please try again."
            });

        }

    }
);

app.get(
    "/api/v1/generate-logo/:repoName/:repoOwner", 
    async (req, res) => {

        const repoName = req.params['repoName'];
        const repoOwner = req.params['repoOwner'];

        try {

            const prompt = await createPrompt({
                repoName: repoName,
                owner: repoOwner,
                userID: req.session.userID
            });

            const description = await generateDescription(prompt);
            const logoDescription = await generateLogoDescription(description);

            const logo = await generateLogo(logoDescription); 
            const logoPath = await addNewLogo(req.session.userID, repoName);

            await uploadImageToS3(logoPath, logo);
            await manageUserBalance(req.session.userID, 0.4);

            const presignedURL = await getPresignedURL(logoPath);
            res.json({ url: presignedURL });

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




