const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1' // แนะนำให้ใส่ base path จริง
      }
    ],

    // ✅ เพิ่มส่วนนี้เข้าไป
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },

    // ✅ ให้ทุก endpoint ใช้ JWT เป็น default
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ['./routes/v1/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
