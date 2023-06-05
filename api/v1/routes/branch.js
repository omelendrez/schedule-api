"use strict";
const branch = require("../controllers/branch");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, branch.findAll);
router.post("/", secure, branch.create);
router.delete("/:id", secure, branch.delete);
router.put("/:id", secure, branch.update);
module.exports = router;
