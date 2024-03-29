"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();

// Models
const {User} = require("../models");

// TheQuizLive.json
const TheQuizLive = require("../build/contracts/TheQuizLive.json");

const {meta, rootAccount, accounts,web3} = require('../server');

// 회원가입
router.post("/signUp", async (req, res) => {
    const {uid, unn, upw} = req.body;
    let regPassword = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/i;

    try {
        const dupCheck = await User.findOne({where: {uid}});
        if (dupCheck) {
            return res.json({
                success: 2,
                code: 1,
            });
        }

        if (!regPassword.test(upw)) {
            return res.json({
                success: 2,
                code: 2,
            });
        }

        const hashedPw = await bcrypt.hash(upw, 12);

        let userAccount = await accounts.create();
        let userPbk = userAccount.address;
        let userPvk = userAccount.privateKey;

        const {transfer} = meta.methods;
        await transfer(userPbk, 100).send({from: rootAccount});

        await web3.eth
            .sendTransaction({
                from: rootAccount,
                to: userPbk,
                value: 1000000000000000000,
            })
            .on("receipt", function (receipt) {
                console.log("1 eth is successfully charged!");
            });

        await User.create({
            uid,
            unn,
            upw: hashedPw,
            upbk: userPbk,
            upvk: userPvk,
        });
        return res.json({success: 1});
    } catch (err) {
        console.error(err);
        return res.status(400).json({success: 3});
    }
});

// 로그인
router.post("/signIn", async (req, res) => {
    const {uid, upw} = req.body;
    let session = req.session;
    try {
        const user = await User.findOne({where: {uid}});
        if (!user) {
            return res.json({
                success: 2,
                code: 1,
            });
        }

        const isMatched = await bcrypt.compare(upw, user.upw);
        if (!isMatched) return res.json({success: 2, code: 2});

        session.loginInfo = {
            uid: user.uid,
            unn: user.unn,
            upbk: user.upbk,
        };

        const payload = {
            uid: user.uid,
            unn: user.unn,
            upbk: user.upbk,
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            },
            (err, token) => {
                res.cookie("TheQuizLive", token);
                res.json({
                    success: 1,
                    uid: user.uid,
                    unn: user.unn,
                    upbk: user.upbk,
                });
            }
        );
    } catch (error) {
        res.status(400).json({success: 3});
    }
});

// 로그아웃
router.post("/signOut", async (req, res) => {
    let store = req.sessionStore;
    try {
        await store.destroy();
        res.clearCookie("TheQuizLive");
        return res.json({success: 1});
    } catch (error) {
        res.status(400).json({success: 3});
    }
});

// 회원탈퇴
router.post("/destroy", async (req, res) => {
    const {uid} = req.body;
    let store = req.sessionStore;
    try {
        await store.destroy();
        res.clearCookie("TheQuizLive");
        const user = await User.findOne({where: {uid}});

        await axios.post(`${process.env.FABRIC_URL}/auth/delete`, {
            user_id: user.getDataValue("hash"),
        });
        await User.destroy({where: {email}});
        return res.json({success: 1});
    } catch (error) {
        console.error(error);
        res.status(400).json({success: 3});
    }
});

module.exports = router;
