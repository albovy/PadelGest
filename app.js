const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const flash = require("express-flash");
const session = require("express-session");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/user");
const tournamentRouter = require("./routes/tournament");
const courtRouter = require("./routes/court");
const inscriptionRouter = require("./routes/inscription");

const app = express();

const mongoDB = "mongodb://127.0.0.1:27017/padeldb";

//BD
mongoose.connect(mongoDB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sessionStore = new session.MemoryStore();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: "true",
    secret: "secret"
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(
  jwt({
    secret: "keyboard cat 4 ever",
    getToken: req => {
      var token =
        req.cookies.token ||
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"];
      if (token) {
        return token;
      }

      return null;
    },
    credentialsRequired: false
  })
);
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/tournament", tournamentRouter);
app.use("/court",courtRouter);
app.use("/inscription", inscriptionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
