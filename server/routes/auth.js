"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");

const { User } = require("../models");

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

    // 아이디 중복 확인
    if (dupCheck) {
      return res.json({
        success: 2,
        code: 1,
      });
    }

    // 암호 형식 오류
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
  const { email, password } = req.body;

  await User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(400).json({
        success: 2,
      });
    }

    bcrypt.compare(password, user.password).then((isMatched) => {
      if (isMatched) {
        let session = req.session;
        session.loginInfo = {
          user_email: user.email,
          user_nickname: user.nickname,
          user_hash: user.hash,
        };
        const payload = {
          nickname: user.nickname,
          profile: user.user_profile,
          email: user.email,
          hash_email: user.hash,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            //token 지속시간
            expiresIn: "24h",
          },
          (err, token) => {
            // res.cookie(key,value) cookie에 key값을 넣는 방식
            res.cookie("hugus", token);
            res.json({
              success: 1,
              nickname: user.nickname,
              profile: user.user_profile,
              email: user.email,
              hash_email: user.hash,
              phone_number: user.phone_number,
            });
          }
        );
      } else {
        return res.status(400).json({ success: 2 });
      }
    });
  });
});

// 로그아웃
router.post("/signOut", (req, res) => {
  let store = req.sessionStore;
  store.destroy((err) => {
    if (err) throw err;
  });
  res.clearCookie("hugus");
  return res.json({ success: 1 });
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
