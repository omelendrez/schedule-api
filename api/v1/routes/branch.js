"use strict";
const branch = require("../controllers/branch");
const express = require("express");
const router = express.Router();

router.get("/", branch.findAll);
router.post("/", branch.create);
router.delete("/:id", branch.delete);
router.put("/:id", branch.update);
module.exports = router;