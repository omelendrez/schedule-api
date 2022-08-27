"use strict";
const status = require("../controllers/status");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, status.findAll);
router.post("/", secure, status.create);

module.exports = router;
