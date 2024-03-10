const express = require('express');
const {cartUpdate, cartCreate} = require("../controllers/cart.controller");
const router = express.Router();

router.post("/cartCreate/:id",cartUpdate);
router.put("/cartUpdate/:id",cartCreate);

module.exports = router;