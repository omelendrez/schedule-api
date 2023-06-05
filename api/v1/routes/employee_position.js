"use strict";
const employeePosition = require("../controllers/employee_position");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/:id/position", secure, employeePosition.findByPositionId);

module.exports = router;
