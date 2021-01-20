"use strict";
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      unn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upw: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user",
      freezeTableName: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
};
