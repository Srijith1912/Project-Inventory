const express = require('express');
const router = express.Router();
const {checkout, orderHistory}  = require('../controllers/checkoutController');

router.post("/", checkout);
router.get("/history", orderHistory);

module.exports = router;