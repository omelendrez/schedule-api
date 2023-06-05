"use strict";
const availability = require("../controllers/availability");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, availability.findAll);
router.get("/:id", secure, availability.findById);
router.get("/:id/employee", secure, availability.findByEmployeeId);
router.post("/", secure, availability.create);
router.put("/:id", secure, availability.update);

module.exports = router;
