require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { logger } = require('./utils/logger');
const seedProducts = require('./utils/seeder');

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
    await seedProducts(); 
    
    app.listen(PORT, () => {
        logger.info(`Server is purring on port ${PORT} with SQLite!`);
    });
});