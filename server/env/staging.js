module.exports = {
  port: process.env.PORT || 80,
  protocol: 'https',
  api_host: 'staging.api.biglotteryowin.com',
  cache: {
    ttl: '30 minutes',
    redis: {
      prefix: 'cache-warming:',
      host: 'cache.ms.gaminghub.com',
      port: 6379
    }
  },
  affiliateCookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  auth: {
    username: "admin",
    password: "ba8f3418f414fe"
  },
  log: {
    logstash: true,
    debug: true,
  }
};
