module.exports = {
  port: process.env.PORT || 80,
  protocol: 'https',
  api_host: 'api.biglotteryowin.com',
  cache: {
    ttl: '30 minutes',
    redis: {
      prefix: 'cache-warming:',
      host: 'cache.ms.gaminghub.com',
      port: 6379
    }
  },
  auth: {
    username: "admin",
    password: "#ba8f341%8f414fe!sk"
  },
  affiliateCookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  log: {
    logstash: true,
    debug: true,
  }
};
