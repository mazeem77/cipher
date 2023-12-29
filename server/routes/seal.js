var express = require("express");
const SealController = require("../controllers/SealController");

var router = express.Router();

router.post("/vote", SealController.vote);
router.get("/votes", SealController.votes);


module.exports = router;