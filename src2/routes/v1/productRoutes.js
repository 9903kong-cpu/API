const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const productController = require('../../controllers/productController');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validate');
const upload = require('../../middlewares/uploadMiddleware');
const cache = require('../../middlewares/cache');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (with pagination)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: List of products
 */
router.get(
  '/',
  cache('products', 120), // 🔥 Cache 2 นาที
  productController.getAllProducts
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product detail
 */
router.get(
  '/:id',
  cache('product', 120), // 🔥 Cache รายตัว
  productController.getProductById
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt().withMessage('Stock must be integer'),
  validate,
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

module.exports = router;
