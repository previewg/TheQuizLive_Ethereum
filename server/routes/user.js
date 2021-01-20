// quizmaster.json
const SimpleToken = require("../build/contracts/SimpleToken.json");

const express = require("express");
const router = express.Router();

// jwt 설정
const jwt = require("jsonwebtoken");

// mysql 설정
const mysql = require("mysql");
const config = require("../config/mariadb_config.js");
const conn = mysql.createConnection(config);

// web3설정
const Web3 = require("web3");
const Accounts = require("web3-eth-accounts");
const url = "http://127.0.0.1:8545";
const hp3 = new Web3(new Web3.providers.HttpProvider(url));

let meta;
let rootAccount;

async function init() {
  await hp3.eth.net.getId((err, result) => {
    if (err) console.error("Could not connect to contract or chain.");
    const deployedNetwork = SimpleToken.networks[result];
    const _meta = new hp3.eth.Contract(
      SimpleToken.abi,
      deployedNetwork.address
    );
    meta = _meta;
  });

  await hp3.eth.getAccounts((err, result) => {
    if (err) console.error("Could not connect to contract or chain.");
    rootAccount = result[0];
  });
}
init();

// bcrypt 설정
const bcrypt = require("bcrypt");
const { func } = require("prop-types");
const saltRounds = 10;

router.post("/signUp", async (req, res, next) => {
  let arr = [req.body.userid, req.body.userpw, req.body.useremail];
  const accounts = new Accounts(url);
  let ret = await accounts.create();
  let userpbk = ret.address;
  let userpvk = ret.privateKey;
  arr.push(userpbk);
  arr.push(userpvk);

  await bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return console.log(err);
    bcrypt.hash(arr[1], salt, (err, hash) => {
      if (err) return err;
      arr[1] = hash;
    });
  });

  const { transfer } = meta.methods;
  await transfer(userpbk, 100).send({ from: rootAccount });

  await hp3.eth
    .sendTransaction(
      {
        from: rootAccount,
        to: userpbk,
        value: 10000000000000000000,
      },
      (err, txHash) => {
        if (err) console.log(err);
      }
    )
    .on("receipt", function (receipt) {
      console.log("receipt success");
    });

  let sql =
    "INSERT INTO user(userid,userpw,useremail,userpbk,userpvk,joindate) VALUES (?,?,?,?,?,NOW())";
  conn.query(sql, arr, function (err, result) {
    if (!err) {
      if (result.affectedRows === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } else {
      console.log(err);
      res.json({ success: false });
    }
  });
});

router.post("/signIn", (req, res, next) => {
  let id = req.body.userid;
  let pw = req.body.userpw;

  let sql = "SELECT * FROM user WHERE userid=(?)";
  conn.query(sql, id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 1) {
        bcrypt.compare(pw, result[0].userpw, (err, isMatch) => {
          if (err) console.log(err);
          else {
            if (isMatch) {
              let token = jwt.sign(id, "ThisIsSecretToken");
              let sql2 = "UPDATE user SET usertoken=? WHERE userid=?";
              conn.query(sql2, [token, id], function (err, result) {
                if (err) res.status(400).send(err);
                else {
                  res
                    .cookie("x_auth", token)
                    .status(200)
                    .json({ success: true, userId: token });
                }
              });
            } else {
              res.json({ success: false });
            }
          }
        });
      } else {
        console.log("오류");
      }
    }
  });
});

router.post("/getScore", (req, res, next) => {
  const userid = req.body.userid;
  let sql = "SELECT success,failure FROM user WHERE userid=(?)";
  conn.query(sql, userid, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(result[0]);
      res.json(result[0]);
    }
  });
});

router.post("/getBalance", (req, res, next) => {
  const userid = req.body.userid;

  let sql = "SELECT * FROM user WHERE userid=(?)";
  conn.query(sql, userid, async function (err, result) {
    if (err) console.log(err);
    else {
      const { balanceOf } = meta.methods;
      const balance = await balanceOf(result[0].userpbk).call();
      console.log(balance);
      res.json({ balance: balance });
    }
  });
});

router.get("/auth", (req, res, next) => {
  let token = req.cookies.x_auth;

  if (typeof token !== "undefined") {
    jwt.verify(token, "ThisIsSecretToken", function (err, decoded) {
      if (err) console.log(err);
      else {
        let sql = "SELECT * FROM user WHERE usertoken=? AND userid=?";
        conn.query(sql, [token, decoded], function (err, result) {
          if (err) console.log(err);
          else {
            if (result.length === 1) {
              res.status(200).json({
                userid: result[0].userid,
                email: result[0].useremail,
                isAdmin: result[0].role === 0 ? false : true,
                isAuth: true,
                role: result[0].role,
              });
            } else {
              res.json({ isAuth: false, error: true });
            }
          }
        });
      }
    });
  } else {
    res.json({ isAuth: false, error: true });
  }
});

router.get("/signOut", (req, res, next) => {
  let token = req.cookies.x_auth;

  let sql = "UPDATE user SET usertoken='' WHERE usertoken=?";
  conn.query(sql, token, function (err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        res.status(200).json({
          success: true,
        });
      } else {
        res.json({ success: false });
      }
    }
  });
});

router.get("/list", (req, res, next) => {
  let sql = "SELECT userid,useremail,userpbk FROM user WHERE userid!='admin'";
  conn.query(sql, function (err, result, fields) {
    if (!err) {
      res.status(200).json({ list: result });
    } else {
      res.status(400).json(err);
    }
  });
});

// router.post("/add", async (req, res, next) => {

//     const { transfer } = meta.methods;
//     await transfer(userpbk, 100).send({ from: rootAccount });
// });

module.exports = router;
