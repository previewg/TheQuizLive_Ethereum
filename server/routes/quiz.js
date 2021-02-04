let express = require("express");
let router = express.Router();

let mysql = require("mysql"); // npm install mysql --save
let config = require("../config/mariadb_config.js");
let conn = mysql.createConnection(config); // db접속

// Models
const { Quiz, sequelize } = require("../models");

// liveQuiz.json
const liveQuiz = require("../build/contracts/LiveQuiz.json");

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
    let deployedNetwork = liveQuiz.networks[result];
    liveQuizAccount = deployedNetwork.address;
    meta = new web3.eth.Contract(liveQuiz.abi, deployedNetwork.address);
    let list = await web3.eth.getAccounts();
    rootAccount = list[0];
  } catch (err) {
    console.error("Could not connect to contract or chain. error => " + err);
  }
}
init();

router.post("/balanceCheck", async (req, res, next) => {
  const { uid } = req.session.loginInfo;
  try {
    let user = await User.findOne({ where: { uid } });
    let upbk = user.getDataValue("upbk");

    const { balanceOf } = meta.methods;
    const balance = await balanceOf(upbk).call();
    console.log(balance);
    if (balance < 10) return res.json({ success: 2 });
    return res.json({ success: 1 });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
});

router.post("/start", async (req, res, next) => {
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
  try {
    const correct = await Quiz.findOne({
      where: { id, answer },
    });
    if (!correct) return res.json({ success: 2 });

    // if (success) {
    //   let sql = "UPDATE user SET success=success+1 WHERE userid=?";
    //   conn.query(sql, userid, function (err, result2) {
    //     if (err) console.log(err);
    //     else {
    //       if (result2.affectedRows === 1) {
    //         const { addUsers } = meta.methods;
    //         addUsers(10, result[0].userpbk).send(
    //           { from: rootAccount, gas: 1000000 },
    //           (err, result) => {
    //             if (err) console.log(err);
    //             else {
    //               res.status(200).json({ success: true });
    //             }
    //           }
    //         );
    //       } else {
    //         console.log(err);
    //       }
    //     }
    //   });
    // } else {
    //   let sql = "UPDATE user SET failure=failure+1 WHERE userid=?";
    //   conn.query(sql, userid, function (err, result2) {
    //     if (err) console.log(err);
    //     else {
    //       if (result2.affectedRows === 1) {
    //         const { increaseAmount } = meta.methods;
    //         increaseAmount(10).send(
    //           { from: rootAccount, gas: 1000000 },
    //           (err, result) => {
    //             if (err) console.log(err);
    //             else {
    //               res.status(200).json({ success: true });
    //             }
    //           }
    //         );
    //       } else {
    //         console.log(err);
    //       }
    //     }
    //   });
    // }

    return res.json({ success: 1, quiz: quiz });
  } catch (error) {
    res.status(400).json({ success: 3 });
  }
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
