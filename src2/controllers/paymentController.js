const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res, next) => {
    try {
        const { orderId, amount } = req.body;

        const payment = await paymentService.processPayment(
            orderId,
            amount
        );

        res.status(201).json({
            status: 'success',
            data: payment
        });

    } catch (err) {
        next(err);
    }
};
