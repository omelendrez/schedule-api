"use strict";
const sector = require("../controllers/sector");
const express = require("express");
const router = express.Router();

router.get("/", sector.findAll);
router.post("/", sector.create);
router.put("/:id", sector.update);
router.delete("/:id", sector.delete);

module.exports = router;