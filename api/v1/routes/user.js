"use strict";
const user = require("../controllers/user");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/:id", secure, user.findById);
router.get("/", secure, user.findAll);
router.post("/", secure, user.create);
router.put("/:id", secure, user.update);
router.delete("/:id", secure, user.delete);
router.put("/:id/password", secure, user.changePassword)

module.exports = router;
