var express = require("express");
var authRouter = require("./auth");
var sealRouter = require("./seal");

var app = express();

app.use("/auth/", authRouter);
app.use("/seal/", sealRouter);

module.exports = app;