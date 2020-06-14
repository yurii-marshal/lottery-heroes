module.exports = {
  port: process.env.PORT || 80,
  protocol: 'https',
  api_host: 'development.api.biglotteryowin.com',
  affiliateCookieMaxAge: 10 * 60 * 1000, // 10 min
  cache: {
    ttl: '15 minutes',
    redis: {
      prefix: 'cache-warming:',
      host: 'cache.ms.gaminghub.com',
      port: 6379
    }
  },
  auth: {
    username: "admin", // https://development.biglotteryowin.com/
    password: "ba8f3418f414fe"
  },
  log: {
    logstash: true,
    debug: true,
  }
};
