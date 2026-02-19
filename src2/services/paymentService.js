exports.processPayment = async (orderId, amount) => {

    // สมมุติ update order status
    const payment = {
        paymentId: Date.now(),
        orderId,
        amount,
        status: 'paid'
    };

    // ควร update order.status = 'paid'

    return payment;
};
