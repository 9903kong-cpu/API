const express = require('express');
const router = express.Router();

const paymentController = require('../../controllers/paymentController');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');
const idempotency = require('../../middlewares/idempotency');

router.post(
  '/',
  authenticate,
  idempotency,
  paymentController.createPayment
);

module.exports = router;
