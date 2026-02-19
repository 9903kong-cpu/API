require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// ===============================
// 🔥 Rate Limiter
// ===============================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes!'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ===============================
// 🔥 Global Middlewares
// ===============================
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Logging
app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
}));

// ===============================
// 🔥 API Versioning
// ===============================
app.use('/api/v1', require('./routes/v1'));

// ===============================
// 🔥 Swagger Setup
// ===============================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API documentation for E-Commerce Backend'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/v1/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// 🔥 Static Public Folder
// ===============================
app.use(express.static('public'));

// ===============================
// 🔥 404 Handler
// ===============================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// ===============================
// 🔥 Global Error Handler
// ===============================
app.use(errorHandler);

module.exports = app;
