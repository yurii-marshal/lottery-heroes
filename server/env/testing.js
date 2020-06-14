module.exports = {
  port: process.env.PORT || 80,
  protocol: 'https',
  api_host: 'testing.api.biglotteryowin.com',
  cache: {
    ttl: '30 minutes',
    redis: {
      prefix: 'cache-warming:',
      host: 'cache.ms.gaminghub.com',
      port: 6379
    }
  },
  affiliateCookieMaxAge: 30 * 60 * 1000, // 30 min
  auth: {
    username: "admin",
    password: "ba8f3418f414fe"
  },
  log: {
    logstash: true,
    debug: true,
  }
};
