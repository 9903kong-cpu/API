const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const { authenticate } = require('../../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', cartController.getMyCart);
router.post('/', cartController.addToCart);

module.exports = router;
