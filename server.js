"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const apiPath = "./api/v1";
const models = require(apiPath + "/models");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(logger("dev"));

models.sequelize.sync({
  force: false
});

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/absenteeism", require(apiPath + "/routes/absenteeism"));
app.use("/availability", require(apiPath + "/routes/availability"));
app.use("/branch", require(apiPath + "/routes/branch"));
app.use("/budget", require(apiPath + "/routes/budget"));
app.use("/employee", require(apiPath + "/routes/employee"));
app.use("/position", require(apiPath + "/routes/position"));
app.use("/employee_position", require(apiPath + "/routes/employee_position"));
app.use("/profile", require(apiPath + "/routes/profile"));
app.use("/schedule", require(apiPath + "/routes/schedule"));
app.use("/sector", require(apiPath + "/routes/sector"));
app.use("/status", require(apiPath + "/routes/status"));
app.use("/timeoff", require(apiPath + "/routes/timeoff"));
app.use("/user", require(apiPath + "/routes/user"));

app.use("/login", require(apiPath + "/routes/login"));

const port = process.env.PORT || 3010;

app.set("port", port);

app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
