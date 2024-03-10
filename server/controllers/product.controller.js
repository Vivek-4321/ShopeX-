const Product = require('../models/product.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createProduct = async (req, res) => {
  const { name, description, price, imageUrls } = req.body;

  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ error: 'Product already exists', id: existingProduct._id });
    }
    const rating = 0;
    const no_rating=0;

    const product = new Product({
      name,
      description,
      price,
      imageUrls,
      rating,
      no_rating,
    });

    await product.save();

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getSingleProduct = async (req, res) => {
  const productId = req.params.id;

  try{
    const product = await Product.findOne({ _id: productId });

    if(!product){
      return res.status(404).json({error: 'Product not found'});
    }

    return res.status(200).json(product);

  } catch (error){
    console.log(error);
    return res.status(500).json({error: 'Internal server error'});
  }
}

const PAGE_SIZE = 10; // Number of products per page

const getProducts = async (req, res) => {
  const { page, categoryId } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const skip = (pageNumber - 1) * PAGE_SIZE;

  try {
    let query = Product.find();
    let countQuery = Product.countDocuments();

    if (categoryId) {
      query = query.where('category').equals(categoryId);
      countQuery = countQuery.where('category').equals(categoryId);
    }

    const products = await query.skip(skip).limit(PAGE_SIZE).exec();

    const count = await countQuery.exec(); // Total number of products

    const totalPages = Math.ceil(count / PAGE_SIZE);

    return res.status(200).json({
      products,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getAllProducts = async(req,res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function checkOfferExpiry() {
  const products = await Product.find(); // get all products from the database

  products.forEach(product => {
    const currentDate = new Date();
    const endDate = new Date(product.offer.endDate);

    if (currentDate >= endDate) { // check if offer has expired
      product.offer = undefined; // remove the offer from the product
      product.save(); // save the updated product in the database
    }
  });
}

setInterval(checkOfferExpiry, 24 * 60 * 60 * 1000); // check for expired offers once a day

const updateOffer = async (req, res) => {
  const { id } = req.params;
  const { discountPercentage, endDate } = req.body;
  console.log(req.body);
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.offer = {
      discountPercentage: discountPercentage,
      endDate: endDate
    };

    await product.save();
    console.log(product);
    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
    getSingleProduct,
    checkOfferExpiry,
    updateOffer,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
}