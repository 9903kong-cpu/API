const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 

        let cartItem = await Cart.findOne({ 
            where: { 
                userId: userId, 
                productId: productId 
            } 
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({ 
                userId: userId, 
                productId: productId, 
                quantity: quantity 
            });
        }

        res.status(201).json({ status: 'success', data: cartItem });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getMyCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [Product] // ดึงข้อมูลชื่อและราคาสินค้า
        });
        res.status(200).json({ status: 'success', data: cartItems });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { addToCart, getMyCart };