const express = require("express");
const path = require("path");
const models = require("./models");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

require("dotenv").config();
require("cors")();
require("cookie-parser")();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

// session settings
const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];

let sessionStore = new mysqlStore({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
});
app.use(
    session({
        key: "quiz",
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
);

// socket settings
const io = require("socket.io");
const server = io.listen(3333);
server.on("connection", function (socket) {
    socket.emit("quiz", "connected");
});

// sequelize MariaDB Connection
models.sequelize
    .sync()
    .then(() => {
        console.log("✓ DB 연결 성공");
    })
    .catch((err) => {
        console.log("✗ DB 연결 에러");
        console.error(err);
        process.exit();
    });

// Register Routers
const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quiz");

// Use Routers
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
// 404 처리
app.use((req, res) => {
    new Error(`${req.method} ${req.url} There is no router`);
});

// web3 Settings
const Web3 = require("web3");
const Accounts = require("web3-eth-accounts");
const TheQuizLive = require("./build/contracts/TheQuizLive.json");
const {abbr_context} = require("truffle/build/52.bundled");
let web3 = new Web3(Web3.givenProvider || process.env.URL);
let accounts = new Accounts(process.env.URL);
let meta;
let rootAccount;

async function init() {
    try {
        let result = await web3.eth.net.getId();
        let deployedNetwork = TheQuizLive.networks[result];
        meta = new web3.eth.Contract(TheQuizLive.abi, deployedNetwork.address);
        let list = await web3.eth.getAccounts();
        rootAccount = list[0];
    } catch (err) {
        console.error("Could not connect to contract or chain. error => " + err);
    }
}

init().then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`Server is running on port ${process.env.PORT}`)
        );
        module.exports = rootAccount
    }
);






