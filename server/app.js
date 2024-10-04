require('dotenv').config();
const express = require("express");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const Sequelize = require("sequelize");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const crypto = require("crypto");
const path = require("path");
const exchangeCode = require('./utils/exchangeCode.js');
const getUserInfo = require("./utils/getUserInfo.js");
const registerNewUser = require("./database/registerNewUser.js");
const getUserAccessToken = require("./database/getAccessToken.js");
const getGeneratedDescriptions = require('./database/getGeneratedDescriptions.js');
const refreshAccessToken = require("./utils/refreshAccessToken");
const isUserNew = require("./database/isUserNew.js");
const updateUserTokens = require("./database/updateUserTokens.js");
const sendPrompt = require("./utils/sendPrompt.js");
const addNewDescription = require('./database/addNewDescription.js');
const generatePrompt = require('./utils/generatePrompt.js');
const contactAdmin = require('./utils/contactAdmin.js');

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
    path.join(__dirname, "../client/dist/assets")
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
        '../client/dist/index.html'
    );
    res.sendFile(filePath);
});

app.get("/github/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) 
    {
        res.redirect("/registration");
    }
    try 
    {
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

        let accessToken = await getUserAccessToken(req.session.userID);
        let githubResponse = await fetch("https://api.github.com/user/repos", {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (githubResponse.status == 200)
        {
            const repos = await githubResponse.json();
            res.status(200).json(repos);
        } 
        else 
        {
            res.status(500).send(
                "We couldn't fetch your repositories due to the technical issues. Please try again later!"
            );
        }
    }

});

app.get("/api/v1/generated-descriptions", async (req, res) => {

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

        let data = await getGeneratedDescriptions(req.session.userID);
        res.json(data);
    }

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
            return res.status(500).send('Unable to log out');
        }

        res.clearCookie('connect.sid');
        res.sendStatus(200);
    });

});

app.get(
    "/api/v1/project-description/:repoName/:repoOwner", 
    async (req, res) => {

        res.setHeader('Content-Type', "text/plain");
        res.setHeader('Transfer-Encoding', "chunked");

        const repoName = req.params['repoName'];
        const owner = req.params['repoOwner'];

        const prompt = await generatePrompt({
            repoName: repoName,
            owner: owner,
            userID: req.session.userID
        });
 
        const description = await sendPrompt(prompt, res);

        res.end();

        await addNewDescription(
            req.session.userID, 
            description, 
            repoName
        );

    }
);

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
                "../client/dist/index.html"
            );
            res.sendFile(filePath);
        }
        else
        {
            const filePath = path.join(
                __dirname, 
                "../client/dist/index.html"
            );
            res.sendFile(filePath);
        }
    } 
    else 
    {
        res.redirect("/registration");
    }

}); 

app.listen(3000, () => {
    console.log(`The express app is running on port 3000`);
});




