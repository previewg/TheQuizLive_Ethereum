let express = require("express");
let router = express.Router();

let mysql = require("mysql");
let config = require("../config/mariadb_config.js");
let conn = mysql.createConnection(config);

// Models
const {User, Quiz, History, sequelize} = require("../models");
const {Op} = require('sequelize');
const {meta, rootAccount, contractAddress, Tx, web3} = require('../server');

// balanceCheck
router.get("/check", async (req, res, next) => {
    const {uid} = req.session.loginInfo;
    try {
        let user = await User.findOne({where: {uid}});
        let upbk = user.getDataValue("upbk");
        const {balanceOf} = meta.methods;
        const balance = await balanceOf(upbk).call();
        if (balance < 10) return res.json({success: 2, balance: balance});
        return res.json({success: 1, balance: balance});
    } catch (error) {
        res.status(400).json({success: 3});
    }
});

router.post("/pay", async (req, res, next) => {
    const {uid} = req.session.loginInfo;
    try {
        let user = await User.findOne({where: {uid}});
        let upbk = user.getDataValue("upbk");
        let upvk = user.getDataValue("upvk");
        let count = await web3.eth.getTransactionCount(upbk);
        let rawTx = {
            from: upbk,
            nonce: "0x" + count.toString(16),
            gasPrice: 210000000000,
            gasLimit: 221000,
            to: contractAddress,
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
        return res.json({success: 1});
    } catch (error) {
        res.status(400).json({success: 3});
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
        return res.json({success: 1, quiz: quiz});
    } catch (error) {
        res.status(400).json({success: 3});
    }
});

router.post("/submit", async (req, res, next) => {
    const {id, answer} = req.body;
    const {uid, upbk} = req.session.loginInfo;
    const {addUsers, increaseAmount} = meta.methods;
    try {
        const correct = await Quiz.findOne({
            where: {id, answer},
        });

        if (!correct) {
            await History.create({uid, qid: id, correct: false});
            await increaseAmount(10).send({from: rootAccount, gas: 1000000});
            return res.json({success: 2});
        }

        await History.create({uid, qid: id, correct: true});
        await addUsers(10, upbk).send({from: rootAccount, gas: 1000000});
        return res.json({success: 1});
    } catch (error) {
        console.log(error);
        res.status(400).json({success: 3});
    }
});

// historyCheck
router.get("/history", async (req, res, next) => {
    const {uid} = req.session.loginInfo;
    try {
        let history = await History.findAll({where: {uid},order: [['createdAt','DESC']]})
        return res.json({success: 1, history: history});
    } catch (error) {
        res.status(400).json({success: 3});
    }
});


router.post("/distributor", function (req, res, next) {
    const {distributor} = meta.methods;
    const now = new Date();
    const startDate = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/00:00:00`)
    const endDate = now
    distributor().send({from: rootAccount, gas: 1000000}, async (err, result) => {
        if (err) res.status(200).json({success: false});
        else {
            let historyTotal = await History.findAndCountAll({
                where: {
                    createdAt: {
                        [Op.lt]: endDate,
                        [Op.gt]: startDate
                    }
                },
            })
            let historyTotalCorrect = await History.findAndCountAll({
                where: {
                    correct: true,
                    createdAt: {
                        [Op.lt]: endDate,
                        [Op.gt]: startDate
                    }
                },
            })
            let reward = ((historyTotal.count * 10) / historyTotalCorrect.count) + 10

            await History.update({
                total: historyTotal.count,
                totalCorrect: historyTotalCorrect.count,
                reward: -10
            }, {
                where: {
                    correct: false,
                    createdAt: {
                        [Op.lt]: endDate,
                        [Op.gt]: startDate
                    }
                },
            })
            await History.update({
                total: historyTotal.count,
                totalCorrect: historyTotalCorrect.count,
                reward: reward
            }, {
                where: {
                    correct: true,
                    createdAt: {
                        [Op.lt]: endDate,
                        [Op.gt]: startDate
                    }
                },
            })
            res.status(200).json({success: true});
        }
    });
});

module.exports = router;
