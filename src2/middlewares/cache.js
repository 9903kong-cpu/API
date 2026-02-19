const redisClient = require('../config/redis');

const cache = (keyPrefix, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = `${keyPrefix}:${req.originalUrl}`;

      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      res.sendResponse = res.json;
      res.json = async (body) => {
        await redisClient.setEx(key, ttl, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
