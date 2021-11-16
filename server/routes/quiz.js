let express = require("express");
let router = express.Router();

let mysql = require("mysql"); // npm install mysql --save
let config = require("../config/mariadb_config.js");
let conn = mysql.createConnection(config); // db접속

// Models
const { User, Quiz, History, sequelize } = require("../models");

// liveQuiz.json
const TheQuizLive = require("../build/contracts/TheQuizLive.json");

// web3 Settings
const Web3 = require("web3");
let web3 = new Web3(Web3.givenProvider || process.env.URL);
const Tx = require("ethereumjs-tx").Transaction;

let meta;
let rootAccount;
let liveQuizAccount;

async function init() {
  try {
    let result = await web3.eth.net.getId();
    let deployedNetwork = TheQuizLive.networks[result];
    liveQuizAccount = deployedNetwork.address;
    meta = new web3.eth.Contract(TheQuizLive.abi, deployedNetwork.address);
    let list = await web3.eth.getAccounts();
    rootAccount = list[0];
  } catch (err) {
    console.error("cannot connect to contract or chain. error => " + err);
  }
}
init();

// balanceCheck
router.get("/check", async (req, res, next) => {
  const { uid } = req.session.loginInfo;
  try {
    let user = await User.findOne({ where: { uid } });
    let upbk = user.getDataValue("upbk");

    const { balanceOf } = meta.methods;
    const balance = await balanceOf(upbk).call();
    if (balance < 10) return res.json({ success: 2, balance: balance });
    return res.json({ success: 1, balance: balance });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

router.post("/pay", async (req, res, next) => {
  const { uid } = req.session.loginInfo;
  try {
    let user = await User.findOne({ where: { uid } });
    let upbk = user.getDataValue("upbk");
    let upvk = user.getDataValue("upvk");
    let count = await web3.eth.getTransactionCount(upbk);
    let rawTx = {
      from: upbk,
      nonce: "0x" + count.toString(16),
      gasPrice: 210000000000,
      gasLimit: 221000,
      to: liveQuizAccount,
      value: "0x0",
      data: meta.methods.transfer(rootAccount, 10).encodeABI(),
      chainId: 0x03,
    };
    let privateKey = new Buffer.from(upvk.substr(2), "hex");
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();

    await web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
    return res.json({ success: 1 });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const quiz = await Quiz.findAll({
      attributes: [
        "category",
        "choice1",
        "choice2",
        "choice3",
        "choice4",
        "id",
        "question",
      ],
      limit: 1,
      order: sequelize.random(),
    });
    return res.json({ success: 1, quiz: quiz });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

router.post("/submit", async (req, res, next) => {
  const { id, answer } = req.body;
  const { uid, upbk } = req.session.loginInfo;
  const { addUsers, increaseAmount } = meta.methods;
  try {
    const correct = await Quiz.findOne({
      where: { id, answer },
    });

    if (!correct) {
      await History.create({ uid, qid: id, correct: false });
      await increaseAmount(10).send({ from: rootAccount, gas: 1000000 });
      return res.json({ success: 2 });
    }

    await History.create({ uid, qid: id, correct: true });
    await addUsers(10, upbk).send({ from: rootAccount, gas: 1000000 });
    return res.json({ success: 1 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: 3 });
  }
});

router.post("/distributor", function (req, res, next) {
  const { distributor } = meta.methods;
  distributor().send({ from: rootAccount, gas: 1000000 }, (err, result) => {
    if (err) res.status(200).json({ success: false });
    else {
      res.status(200).json({ success: true });
    }
  });
});

module.exports = router;
