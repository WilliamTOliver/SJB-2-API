const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  authRoutes = require('./api/controllers/auth'),
  eventRoutes = require('./api/controllers/event'),
  config = require('./config.json'),
  user = config.connection.defaultUser,
  url = `mongodb://${user.username}:${user.password}@${config.connection.location}`;
mongoose.connect(url);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
