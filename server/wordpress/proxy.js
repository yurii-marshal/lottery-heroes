const proxy = require('express-http-proxy');
const brands = require('package-brands');

module.exports = function (app) {
  // proxy wordpress blog
  app.use((req, res, next) => {
    let brand, blogHost;
    brand = brands.getBrandId(req.get('host'));

    switch (brand) {
      case 'MOBIO':
      case 'BIGLOTTERYOWIN_COM':
        blogHost = 'blog.biglotteryowin.com';
        break;
      default:
        blogHost = 'blog.biglotteryowin.com';
    }
    req['blogHost'] = blogHost;
    next();
  });

  app.use('/biglotteryowinzone', proxy((req) => {
    return req.blogHost
  }, {
    forwardPath: function (req, res) {
      return '/biglotteryowinzone' + require('url').parse(req.url).path;
    },
    memoizeHost: false,
    reqAsBuffer: true,
    reqBodyEncoding: null
  }));
};
