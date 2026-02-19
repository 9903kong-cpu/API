const Product = require('../models/productModel');
const { logger } = require('./logger');

const seedProducts = async () => {
  try {
    // ลบข้อมูลสินค้าเก่าออกก่อน
    await Product.destroy({ where: {}, truncate: true });

    const products = [
      {
        name: 'Melom',
        description: 'Delicious.',
        price: 100.00,
        stock: 50
      },
      {
        name: 'Banana',
        description: 'very Delicious.',
        price: 10.00,
        stock: 30
      },
      {
        name: 'Apple',
        description: 'Delicious.',
        price: 15.00,
        stock: 15
      },
    ];

    // เพิ่มข้อมูลหลายๆ ตัว
    await Product.bulkCreate(products);
    logger.info('Sample products have been seeded successfully.');
  } catch (error) {
    logger.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;