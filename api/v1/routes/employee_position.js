"use strict";
const employeePosition = require("../controllers/employee_position");
const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/:id/position", employeePosition.findByPositionId);

module.exports = router;
