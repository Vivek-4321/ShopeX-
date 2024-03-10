const express = require('express');

const { createProduct, updateProduct, deleteProduct, getProducts, getAllProducts, updateOffer, getSingleProduct } = require("../controllers/product.controller");
const {adminValidateToken,userValidateToken} = require('../jwt');

const router = express.Router();

router.post("/createProduct", createProduct);
router.post("/updateOffer/:id", updateOffer);
router.get("/getAllProducts",getAllProducts);
router.get("/getSingleProduct/:id", getSingleProduct);
router.post("/updateProduct/:id",adminValidateToken, updateProduct);
router.post("/deleteProduct/:id",adminValidateToken, deleteProduct);
router.get("/getProducts",getProducts);

module.exports = router;