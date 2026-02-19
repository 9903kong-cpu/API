const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 นาที

module.exports = (req, res, next) => {
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      message: 'Idempotency-Key header is required'
    });
  }

  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    cache.set(key, body);
    return originalJson(body);
  };

  next();
};
