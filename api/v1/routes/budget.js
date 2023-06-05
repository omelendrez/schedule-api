"use strict";
const budget = require("../controllers/budget");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, budget.findAll);
router.post("/", secure, budget.create);
router.put("/:id", secure, budget.update);
router.delete("/:id", secure, budget.delete);

module.exports = router;
