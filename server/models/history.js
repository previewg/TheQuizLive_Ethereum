"use strict";
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "History",
        {
            qid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            uid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            correct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            totalCorrect: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            reward: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "history",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        }
    );
};
