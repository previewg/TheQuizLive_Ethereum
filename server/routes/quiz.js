// quizmaster.json
const SimpleToken = require("../build/contracts/SimpleToken.json");

let express = require("express");
let router = express.Router();

let mysql = require("mysql"); // npm install mysql --save
let config = require("../config/mariadb_config.js");
let conn = mysql.createConnection(config); // db접속

// web3설정
const Web3 = require("web3");
const Accounts = require("web3-eth-accounts");
const { func } = require("prop-types");
const url = "http://127.0.0.1:8545";
const hp3 = new Web3(new Web3.providers.HttpProvider(url));

const Tx = require("ethereumjs-tx").Transaction;

let meta;
let rootAccount;
let simpleTokenAccount;

async function init() {
  await hp3.eth.net.getId((err, result) => {
    if (err) console.error("Could not connect to contract or chain.");
    const deployedNetwork = SimpleToken.networks[result];
    simpleTokenAccount = deployedNetwork.address;
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

router.get("/random", function (req, res, next) {
  let sql =
    "SELECT quizno,quizcategory,quizquest,ex01,ex02,ex03,ex04,quizanswer FROM quiz ORDER BY RAND() LIMIT 1";
  conn.query(sql, function (err, result, fields) {
    if (!err) {
      res.status(200).json({ quiz: result[0] });
    } else {
      res.status(400).json(err);
    }
  });
});

router.post("/correct", async function (req, res, next) {
  const userid = req.body.userid;
  const success = req.body.success;
  let sql = "SELECT * FROM user WHERE userid=?";
  conn.query(sql, userid, async function (err, result, fields) {
    if (!err) {
      let count = await hp3.eth.getTransactionCount(result[0].userpbk);
      let rawTx = {
        from: result[0].userpbk,
        nonce: "0x" + count.toString(16),
        gasPrice: 210000000000,
        gasLimit: 221000,
        to: simpleTokenAccount,
        value: "0x0",
        data: meta.methods.transfer(rootAccount, 10).encodeABI(),
        chainId: 0x03,
      };
      let privKey = new Buffer.from(result[0].userpvk.substr(2), "hex");
      let tx = new Tx(rawTx);
      tx.sign(privKey);
      let serializedTx = tx.serialize();

      const { balanceOf } = meta.methods;
      const balance = await balanceOf(result[0].userpbk).call();
      console.log(balance);
      if (balance < 10) {
        res.json({ success: false });
      } else {
        hp3.eth
          .sendSignedTransaction(
            "0x" + serializedTx.toString("hex"),
            (err, txHash) => {
              if (err) {
                res.status(400).json(err);
              } else {
                if (success) {
                  let sql = "UPDATE user SET success=success+1 WHERE userid=?";
                  conn.query(sql, userid, function (err, result2) {
                    if (err) console.log(err);
                    else {
                      if (result2.affectedRows === 1) {
                        const { addUsers } = meta.methods;
                        addUsers(10, result[0].userpbk).send(
                          { from: rootAccount, gas: 1000000 },
                          (err, result) => {
                            if (err) console.log(err);
                            else {
                              res.status(200).json({ success: true });
                            }
                          }
                        );
                      } else {
                        console.log(err);
                      }
                    }
                  });
                } else {
                  let sql = "UPDATE user SET failure=failure+1 WHERE userid=?";
                  conn.query(sql, userid, function (err, result2) {
                    if (err) console.log(err);
                    else {
                      if (result2.affectedRows === 1) {
                        const { increaseAmount } = meta.methods;
                        increaseAmount(10).send(
                          { from: rootAccount, gas: 1000000 },
                          (err, result) => {
                            if (err) console.log(err);
                            else {
                              res.status(200).json({ success: true });
                            }
                          }
                        );
                      } else {
                        console.log(err);
                      }
                    }
                  });
                }
              }
            }
          )
          .on("receipt", (receipt) => {
            console.log(receipt);
          });
      }
    } else {
      res.status(400).json(err);
    }
  });
});

router.post("/register", function (req, res, next) {
  let arr = [
    req.body.quizcategory,
    req.body.exmain,
    req.body.ex01,
    req.body.ex02,
    req.body.ex03,
    req.body.ex04,
    req.body.quizanswer,
  ];

  let sql =
    "INSERT INTO quiz(quizcategory,exmain,ex01,ex02,ex03,ex04,quizanswer,quizdate) VALUES (?,?,?,?,?,?,?, NOW())";
  conn.query(sql, arr, function (err, result) {
    console.log(err);
    if (!err) {
      if (result.affectedRows == 1) {
        console.log("register success");
      } else {
        console.log("register failure");
      }
    } else {
      console.log("register failure err");
    }
    res.redirect("/quiz/list");
  });
});

router.get("/delete", function (req, res, next) {
  let arr = [req.query.id];
  let sql = "DELETE FROM quiz WHERE quizno=?";
  conn.query(sql, arr, function (err, result) {
    if (!err) {
      if (result.affectedRows == 1) {
        console.log("delete success");
      } else {
        console.log("delete failure1");
      }
    } else {
      console.log("delete failure");
    }
    res.redirect("/quiz/list");
  });
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

// router.get('/update', function (req, res, next) {
//   let arr = [req.query.id]
//   let sql = 'SELECT * FROM quiz WHERE quizno=?'

//   conn.query(sql, arr, function (err, rows, fields) {
//     if (!err) {
//       if (rows.length > 0) {
//         res.render('quizUpdate', { title: '문제수정', data: rows[0] })
//       } else {
//         console.log('err')
//         res.redirect('/quiz/list')
//       }
//     } else {
//       console.log('err')
//       res.redirect('/quiz/list')
//     }
//   })
// })

router.post("/update", function (req, res, next) {
  let arr = [
    req.body.quizcategory,
    req.body.exmain,
    req.body.ex01,
    req.body.ex02,
    req.body.ex03,
    req.body.ex04,
    req.body.quizanswer,
    req.body.quizno,
  ];
  console.log(arr);

  var sql =
    "UPDATE quiz SET quizcategory=?, exmain=?, ex01=?, ex02=?, ex03=?, ex04=?, quizanswer=? WHERE quizno=?";
  conn.query(sql, arr, function (err, result) {
    if (!err) {
      if (result.affectedRows == 1) {
        console.log("update success");
      } else {
        console.log("update failure1");
      }
    } else {
      console.log(err);
    }
    res.redirect("/quiz/list");
  });
});

// router.get('/questions', function (req, res, next) {
//   let sql = 'SELECT * FROM quiz WHERE used is null'
//   conn.query(sql, function (err, rows, fields) {
//     if (!err) {
//       if (rows.length > 0) {
//         //내용이 있다면
//         console.log(err)
//         res.render('quizQuestions', { title: '문제', list: rows })
//       }
//     } else {
//       res.redirect('/')
//     }
//     console.log(err)
//   })
// })

// router.post('/questions', function (req, res, next) {
//   var arr = [req.query.id]
//   console.log(arr)

//   var sql = 'SELECT * FROM quiz WHERE quizno=?'
//   conn.query(sql, arr, function (err, result) {
//     if (!err) {
//       if (result.affectedRows == 1) {
//         console.log(err)
//       } else {
//         console.log(err)
//       }
//     } else {
//       console.log(err)
//     }
//     // res.redirect("/quiz/questions");
//   })
// })

module.exports = router;
