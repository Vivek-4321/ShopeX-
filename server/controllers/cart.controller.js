const Cart = require('../models/cart.model');

const cartCreate = async(req, res) => {
    const { id } = req.params;
    const {items} = req.body;
    try {
    
        // Create a new cart object
        const newCart = new Cart({ id, items });
    
        // Save the new cart to the database
        await newCart.save();
    
        // Return the new cart object as the response
        res.status(201).json(newCart);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
}

const cartUpdate = async(req,res) => {
    const {id } = req.params;
    try {
    
        // Find the cart object by ID
        const cart = await Cart.findById(id);
    
        // Update the items in the cart object
        cart.items = items;
    
        // Save the updated cart to the database
        await cart.save();
    
        // Return the updated cart object as the response
        res.json(cart);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
}

module.exports = {
    cartCreate,
    cartUpdate,
}