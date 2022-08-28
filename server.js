"use strict";
const express = require("express");
const cors = require('cors')
const logger = require("morgan");
const apiPath = "./api/v1";
const models = require(apiPath + "/models");
const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cors())

models.sequelize.sync({
  force: false
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
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

app.use('/', function (req, res) {
  res.statusCode = 404
  res.json({ message: 'Error', detail: 'Recurso inexistente' })
})

app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

const port = process.env.PORT || 3010;

app.set("port", port);

app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', console.error(error))
})
