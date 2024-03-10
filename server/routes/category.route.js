const express = require("express");
const {createCategory, updateCategory, deleteCategory} = require('../controllers/category.controller');
const router = express.Router();

router.post("/createCategory",createCategory);
router.post("/updateCategory/:id",updateCategory);
router.post("/deleteCategory/:id",deleteCategory);

module.exports = router;