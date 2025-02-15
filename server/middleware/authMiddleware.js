const refreshAccessToken = require("../utils/refreshAccessToken");
const path = require("path");

const excludedRoutes = ['/public', '/about'];


const authMiddleware = async (req, res, next) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }
    console.log("Middleware is working!")
    console.log(path)
    try {
        if (req.session.userID) {
            const refreshTokenExpirationDate = new Date(req.session.refreshTokenExpirationDate).getTime();
            const accessTokenExpirationDate = new Date(req.session.accessTokenExpirationDate).getTime();
            const currentTime = Date.now();

            if (refreshTokenExpirationDate <= currentTime) {
                return res.redirect('/registration');
            }

            if (accessTokenExpirationDate <= currentTime) {
                await refreshAccessToken(req.session.userID, req);
            }

            const filePath = (path).join(__dirname, "..", process.env.SPA_INDEX_PATH);
            return res.sendFile(filePath);
        }

        res.redirect("/registration");
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = authMiddleware;
