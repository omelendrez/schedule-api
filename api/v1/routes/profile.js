"use strict";
const profile = require("../controllers/profile");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, profile.findAll);
router.post("/", secure, profile.create);
router.delete("/:id", secure, profile.delete);
router.get("/:id", secure, profile.update);

module.exports = router;
