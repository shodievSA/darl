const { User } = require("./models/user.js");

async function reduceUserFreeTrials(userID) {

    const user = await User.findByPk(userID);

    user['free_trials_left']--;
    await user.save();

}

module.exports = reduceUserFreeTrials;