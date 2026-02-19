require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');

describe('API Integration Tests', () => {

    let adminToken;
    let userToken;
    let createdProductId;

    beforeAll(async () => {
        const secret = process.env.JWT_SECRET;

        adminToken = jwt.sign(
            { id: 1, role: 'admin' },
            secret,
            { expiresIn: '1h' }
        );

        userToken = jwt.sign(
            { id: 2, role: 'user' },
            secret,
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        // ล้างข้อมูลสินค้าเพื่อไม่ให้ test ค้าง
        if (Product && Product.destroy) {
            await Product.destroy({ where: {} });
        }
    });

    // ===============================
    // PRODUCT TESTS
    // ===============================

    describe('GET /api/v1/products', () => {
        it('ควรได้สถานะ 200 และ status = success', async () => {
            const res = await request(app).get('/api/v1/products');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'success');
        });
    });

    describe('POST /api/v1/products', () => {

        const newProduct = {
            name: 'Snack',
            description: 'ขนม',
            price: 50,
            stock: 100,
            category: 'Food'
        };

        it('Admin เพิ่มสินค้าได้สำเร็จ (201)', async () => {

            const res = await request(app)
                .post('/api/v1/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newProduct);

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe(newProduct.name);

            createdProductId = res.body.data.id;
        });

        it('User ไม่มีสิทธิ์เพิ่มสินค้า (403)', async () => {

            const res = await request(app)
                .post('/api/v1/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newProduct);

            expect(res.statusCode).toBe(403);
        });

        it('Validation Error ควรได้ 400', async () => {

            const res = await request(app)
                .post('/api/v1/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 100 });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /api/v1/products/:id', () => {

        it('ไม่ใส่ Token ควรได้ 401', async () => {
            const res = await request(app)
                .delete('/api/v1/products/1');

            expect(res.statusCode).toBe(401);
        });

    });

    // ===============================
    // IDEMPOTENCY TEST
    // ===============================

    describe('POST /api/v1/orders/checkout (Idempotency)', () => {

        it('ไม่ควรสร้าง order ซ้ำเมื่อใช้ Idempotency-Key เดิม', async () => {

            const key = 'test-idempotent-123';

            const first = await request(app)
                .post('/api/v1/orders/checkout')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Idempotency-Key', key)
                .send({
                    items: [{ id: 1 }],
                    total: 100
                });

            const second = await request(app)
                .post('/api/v1/orders/checkout')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Idempotency-Key', key)
                .send({
                    items: [{ id: 1 }],
                    total: 100
                });

            expect(first.statusCode).toBe(201);
            expect(second.statusCode).toBe(409);
        });

    });

    // ===============================
    // PAYMENT TEST
    // ===============================

    describe('POST /api/v1/payments', () => {

        it('ควรชำระเงินสำเร็จ (201)', async () => {

            const res = await request(app)
                .post('/api/v1/payments')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Idempotency-Key', 'payment-key-1')
                .send({
                    orderId: 1,
                    amount: 100
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('status', 'success');
        });

    });

});
