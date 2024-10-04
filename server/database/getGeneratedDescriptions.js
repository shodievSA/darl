const User = require("./models/user.js");

async function getGeneratedDescriptions(userID) {
    let generatedDescriptions = await User.findOne({
        where: { user_id: userID },
        attributes: ["generated_descriptions"]
    });

    return generatedDescriptions.dataValues['generated_descriptions'];
}

module.exports = getGeneratedDescriptions;