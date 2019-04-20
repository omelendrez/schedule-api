"use strict";
const budget = require("../controllers/budget");
const express = require("express");
const router = express.Router();

router.get("/", budget.findAll);
router.post("/", budget.create);
router.put("/:id", budget.update);
router.delete("/:id", budget.delete);

module.exports = router;