"use strict";
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Quiz = require("./quiz")(sequelize, Sequelize);
db.History = require("./history")(sequelize, Sequelize);

db.User.hasMany(db.History, { foreignKey: "uid", sourceKey: "uid" });
db.Quiz.hasMany(db.History, { foreignKey: "qid", sourceKey: "id" });

db.History.belongsTo(db.User, { foreignKey: "uid", targetKey: "uid" });
db.History.belongsTo(db.Quiz, { foreignKey: "qid", targetKey: "id" });

module.exports = db;
