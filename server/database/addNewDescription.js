const { Sequelize } = require("sequelize");
const config = require("./config.js");

async function addNewDescription(userID, newDescription, repoName) {

    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: "postgres"
        }
    );

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    let description = {
        description: newDescription,
        repoName: repoName,
        generatedOn: formattedDate
    }

    description = JSON.stringify(description);

    await sequelize.query(`
        UPDATE users
        SET generated_descriptions = array_append(generated_descriptions, :description)
        WHERE user_id = :userID
      `, {
        replacements: { description, userID }
    });

}

module.exports = addNewDescription;