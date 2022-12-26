require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var registerRouter = require("./routes/register");
var japaneseStudiesRouter = require("./routes/japanese-studies");
var teacherTrainingRouter = require("./routes/teacher-training");
var adminRouter = require("./routes/admin");

var app = express();

const cors = require("cors");
const corsOptions = {
  credentials: true,
  origin: ["https://daftarbeasiswamext.com"],
};
app.use(cors(corsOptions));

app.set("trust proxy", 1);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: "none",
      secure: true,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/japanese-studies", japaneseStudiesRouter);
app.use("/teacher-training", teacherTrainingRouter);
app.use("/admin", adminRouter);

module.exports = app;
app.listen("1234");
