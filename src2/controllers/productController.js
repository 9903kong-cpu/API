const Product = require('../models/productModel');
const cache = require('../utils/cache');

// ===============================
// GET ALL PRODUCTS (Pagination + Cache)
// ===============================
const getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const cacheKey = `products_page_${page}_limit_${limit}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                status: 'success',
                source: 'cache',
                ...cachedData
            });
        }

        const { count, rows } = await Product.findAndCountAll({
            limit,
            offset
        });

        const response = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            results: rows.length,
            data: rows
        };

        cache.set(cacheKey, response);

        res.status(200).json({
            status: 'success',
            source: 'database',
            ...response
        });

    } catch (error) {
        next(error);
    }
};

// ===============================
// GET PRODUCT BY ID
// ===============================
// ===============================
// GET PRODUCT BY ID (Cache)
// ===============================
const getProductById = async (req, res, next) => {
    try {
        const cacheKey = `product_${req.params.id}`;
        const cachedProduct = cache.get(cacheKey);

        if (cachedProduct) {
            return res.status(200).json({
                status: 'success',
                source: 'cache',
                data: cachedProduct
            });
        }

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            const error = new Error('ไม่พบสินค้า!');
            error.statusCode = 404;
            throw error;
        }

        cache.set(cacheKey, product);

        res.status(200).json({
            status: 'success',
            source: 'database',
            data: product
        });

    } catch (error) {
        next(error);
    }
};


// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category
        });

        cache.flushAll(); // ล้าง cache ทั้งหมด

        res.status(201).json({
            status: 'success',
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            const error = new Error('ไม่พบสินค้าที่จะแก้ไข!');
            error.statusCode = 404;
            throw error;
        }

        await product.update(req.body);

        cache.flushAll(); // ล้าง cache ทั้งหมด

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            const error = new Error('ไม่พบสินค้าที่จะลบ!');
            error.statusCode = 404;
            throw error;
        }

        await product.destroy();

        cache.flushAll(); // ล้าง cache ทั้งหมด

        res.status(200).json({
            status: 'success',
            message: 'ลบสินค้าเรียบร้อยแล้ว!'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
