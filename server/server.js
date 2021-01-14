const express = require("express");
const session = require("express-session");
const path = require("path");
const models = require("./models");

require("dotenv").config();
require("cors")();
require("cookie-parser")();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


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

app.listen(process.env.PORT, () =>
	console.log(`Server is running on port ${process.env.PORT}`)
);
