module.exports = (config) => {
  const apicache = require('apicache');
  const redis = require('redis');

  let options = {
    appendKey: (req, res) => req.hostname,
    headers: {'cache-control': 'no-cache'}
  };

  if (config.cache.redis) {
    options.redisClient = redis.createClient(config.cache.redis);
  }

  const cache = apicache
    .options(options)
    .middleware;

  return cache(config.cache.ttl, (req, res) => {
    if (res.statusCode !== 200) {
      return false;
    }
    const queryParamsCount = Object.keys(req.query).length;
    if (queryParamsCount > 1) {
      return false;
    }
    if (queryParamsCount === 1 && !(req.query.lotid && req.query.lotid.match(/^([1-9]|1[0-7])$/))) {
      return false;
    }
    return true;
  });
};
