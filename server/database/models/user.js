const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config.js");

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: "postgres"
    }
);

const User = sequelize.define(
    'users',
    {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        generated_descriptions: {
            type: DataTypes.ARRAY(DataTypes.JSONB)
        },
        free_trials_left: {
            type: DataTypes.SMALLINT
        },
        purchased_descriptions_left: {
            type: DataTypes.SMALLINT
        },
        access_token: {
            type: DataTypes.TEXT
        },
        refresh_token: {
            type: DataTypes.TEXT
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = User;