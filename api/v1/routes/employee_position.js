"use strict";
const employeePosition = require("../controllers/employee_position");
const express = require("express");
const router = express.Router();

router.get("/:id/position", employeePosition.findByPositionId);

module.exports = router;
