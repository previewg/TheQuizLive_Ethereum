"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");

// Models
const { User } = require("../models");

// web3 Settings
const Web3 = require("web3");
const Accounts = require("web3-eth-accounts");
const hp3 = new Web3(new Web3.providers.HttpProvider(process.env.URL));

// 특수문자 제거
const regExp = (str) => {
  const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  if (reg.test(str)) {
    return str.replace(reg, "");
  } else {
    return str;
  }
};

// 회원가입
router.post("/signUp", async (req, res) => {
  const { uid, unn, upw } = req.body;
  let regPassword = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/i;

  try {
    const dupCheck = await User.findOne({ where: { uid } });

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
    await User.create({
      uid,
      unn,
      upw: hashedPw,
    });
    return res.json({ success: 1 });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: 3 });
  }
});

// 로그인
router.post("/signIn", async (req, res) => {
  const { uid, upw } = req.body;
  let session = req.session;
  try {
    const user = await User.findOne({ where: { uid } });
    if (!user) {
      return res.json({
        success: 2,
        code: 1,
      });
    }

    const isMatched = await bcrypt.compare(upw, user.upw);
    if (!isMatched) return res.json({ success: 2, code: 2 });

    session.loginInfo = {
      uid: user.uid,
      unn: user.unn,
    };

    const payload = {
      uid: user.uid,
      unn: user.unn,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        res.cookie("quiz", token);
        res.json({
          success: 1,
          uid: user.uid,
          unn: user.unn,
        });
      }
    );
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

// 로그아웃
router.post("/signOut", async (req, res) => {
  let store = req.sessionStore;
  try {
    // await store.destroy((err) => {
    //   if (err) throw err;
    // });
    res.clearCookie("quiz");
    return res.json({ success: 1 });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

// 회원탈퇴
router.post("/destroy", async (req, res, next) => {
  const { email } = req.body;
  let store = req.sessionStore;

  try {
    store.destroy((err) => {
      if (err) throw err;
    });
    res.clearCookie("hugus");
    const user = await User.findOne({ where: { email } });

    await axios.post(`${process.env.FABRIC_URL}/auth/delete`, {
      user_id: user.getDataValue("hash"),
    });
    await User.destroy({ where: { email } });
    return res.json({ success: 1 });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: 3 });
  }
});

module.exports = router;
