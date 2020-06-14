module.exports = {
  port: process.env.PORT || 5000,
  api_host: 'development.api.biglotteryowin.com',
  protocol: 'http',
  affiliateCookieMaxAge: 5 * 60 * 1000, // 5 min
  log: {
    logstash: false,
    debug: true
  },
  // cache: {
  //   ttl: '10 minutes',
  //   redis: {
  //     prefix: 'cache-warming:',
  //     host: 'localhost',
  //     port: 6379
  //   }
  // }
};
