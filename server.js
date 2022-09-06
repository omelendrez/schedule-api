"use strict";
const express = require("express");
const cors = require('cors')
const logger = require("morgan");
const apiPath = "./api/v1";
const models = require(apiPath + "/models");
const app = express();

app.use(express.json());
app.use(logger("tiny"));
// app.use(logger("tiny", { skip: () => process.env.NODE_ENV === 'production' }));
app.use(cors())

models.sequelize.sync({
  force: false,
  alter: false
});

// SELECT
//   TABLE_NAME AS `Table`,
//   ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS `Size (MB)`,
//   TABLE_ROWS
// FROM
//   information_schema.TABLES
// WHERE
//   TABLE_SCHEMA = "railway"
// ORDER BY
//   (DATA_LENGTH + INDEX_LENGTH)
// DESC;

// # Table, Size (MB), TABLE_ROWS
// 'schedule', '14.03', '208875'
// 'timeoff', '1.91', '12208'
// 'budget', '0.14', '1335'
// 'employee_position', '0.08', '643'
// 'availability', '0.03', '236'
// 'position', '0.03', '13'
// 'user', '0.03', '0'
// 'absenteeism', '0.02', '9'
// 'branch', '0.02', '2'
// 'employee', '0.02', '193'
// 'profile', '0.02', '2'
// 'sector', '0.02', '8'
// 'status', '0.02', '2'


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
