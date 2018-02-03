"use strict";
const profile = require("../controllers/profile");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  console.log("%s %s %s", req.method, req.url, req.path);
  next();
});
router.get("/:id", profile.findById);
router.get("/", profile.findAll);
router.post("/", profile.create);
router.delete("/:id", profile.delete);

module.exports = router;