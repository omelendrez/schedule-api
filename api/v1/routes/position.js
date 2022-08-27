"use strict";
const position = require("../controllers/position");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const secure = auth.validateToken

router.get("/", secure, position.findAll);
router.get("/:id/sector", secure, position.findBySectorId);
router.get("/sector", secure, position.findAllWithSectors)
router.post("/", secure, position.create);
router.put("/:id", secure, position.update);
router.delete("/:id", secure, position.delete);

module.exports = router;
