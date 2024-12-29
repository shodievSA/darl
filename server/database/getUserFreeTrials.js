const { User } = require("./models/user.js");

async function getUserFreeTrials(userID) {

    const user = await User.findOne({
        where: { user_id: userID },
        attributes: ["free_trials_left"],
        raw: true
    });

    return user['free_trials_left'];

}

module.exports = getUserFreeTrials;