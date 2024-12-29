const { User } = require("./models/user.js");

async function isUserNew(userID) {

    let user = await User.findOne({
        where: { user_id: userID }
    });

    if (user) {
        return false;
    } else {
        return true;
    }

}

module.exports = isUserNew;
