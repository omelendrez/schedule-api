"use strict";
const position = require("../controllers/position");
const express = require("express");
const router = express.Router();

router.get("/", position.findAll);
router.get("/:id/sector", position.findBySectorId);
router.get("/sector", position.findAllWithSectors)
router.post("/", position.create);
router.put("/:id", position.update);
router.delete("/:id", position.delete);

module.exports = router;