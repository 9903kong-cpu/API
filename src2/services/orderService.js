const { sequelize } = require('../config/db');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Payment = require('../models/paymentModel');

exports.createOrder = async (userId, items, totalAmount) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: 'PENDING'
      },
      { transaction: t }
    );

    for (const item of items) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        },
        { transaction: t }
      );
    }

    await Payment.create(
      {
        orderId: order.id,
        amount: totalAmount,
        status: 'PAID'
      },
      { transaction: t }
    );

    await t.commit();
    return order;

  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.getMyOrders = async (userId) => {
  return await Order.findAll({
    where: { userId },
    include: [OrderItem, Payment]
  });
};

exports.getOrderById = async (id) => {
  return await Order.findByPk(id, {
    include: [OrderItem, Payment]
  });
};

exports.updateOrderStatus = async (id, status) => {
  const order = await Order.findByPk(id);

  if (!order) return null;

  order.status = status;
  await order.save();

  return order;
};
