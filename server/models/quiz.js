"use strict";
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Quiz",
    {
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice3: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice4: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "quiz",
      freezeTableName: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
};
