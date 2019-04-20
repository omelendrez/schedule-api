"use strict";
const profile = require("../controllers/profile");
const express = require("express");
const router = express.Router();

router.get("/", profile.findAll);
router.post("/", profile.create);
router.delete("/:id", profile.delete);
router.get("/:id", profile.update);

module.exports = router;