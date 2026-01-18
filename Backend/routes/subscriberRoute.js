const express = require("express");
const { postSubscriber } = require("../controllers/subscriberController");

const router = express.Router();

router.post("/subscribe", postSubscriber);

module.exports = router;
