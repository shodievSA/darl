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
        user_history: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        free_trials_left: {
            type: DataTypes.SMALLINT,
            defaultValue: 100
        },
        user_balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        user_transactions: {
            type: DataTypes.JSONB,
            defaultValue: []
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

User.sync({ alter: true });

module.exports = { sequelize, User }