const orderService = require('../services/orderService');

// Create Order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;

    const order = await orderService.createOrder(
      req.user.id,
      items,
      totalAmount
    );

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    next(error);
  }
};

// Get My Orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    next(error);
  }
};

// Get Order By ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Owner check
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    next(error);
  }
};

// Update Status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    next(error);
  }
};
