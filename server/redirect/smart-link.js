const brands = require('package-brands');
const querystring = require('querystring');
const DEFAULT_PROTOCOL = 'http';
const DEFAULT_BRAND_ID = 'BIGLOTTERYOWIN_COM';
const INCAPSULA_HEADER = 'incap-client-ip';
const ELB_HEADER = 'x-forwarded-for';

let protocols = {
  http: require('http'),
  https: require('https')
};

module.exports = (app) => {
  const config = app.get('config');
  const logger = app.get('logger');

  app.use((req, res, next) => {
    let host = req.get('host');
    let redirectHosts = brands.getRedirectHosts(process.env.ENV);
    if (redirectHosts.indexOf(host) === -1)
      return next();
    let ip = getIp(req);
    logger.info(`Request to redirect host ${host}. Customer ip ${ip}`);
    let queryParams = Object.assign({}, req.query);
    delete queryParams.cxd;
    delete queryParams.affiliateId;
    let brandPackageEnv = (process.env.ENV === 'local') ? 'development' : process.env.ENV;
    const DEFAULT_BRAND_DATA = brands.getBrand(DEFAULT_BRAND_ID, brandPackageEnv);
    let protocol = getProtocol(DEFAULT_BRAND_DATA.protocol);

    let requestUrl = DEFAULT_BRAND_DATA.protocol + '://' + DEFAULT_BRAND_DATA.apiHostname + '/visitor-country?ip='+ ip;
    new Promise((resolve, reject) => {
      let request = protocol.get(requestUrl, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          try {
            let res_out = JSON.parse(body);
            resolve(res_out);
          }catch(exc) {
            resolve({});
          }
        });
      });

      request.on('error', (err) => {
        return reject(err);
      });
    })
      .then(result => {
        let customerBrand = result.country.brand_id, redirectUrl;
        if (!customerBrand)
          customerBrand = DEFAULT_BRAND_ID;
        let customerBrandData = brands.getBrand(customerBrand, brandPackageEnv);
        if (customerBrandData.redirectHost === host) {
          if (req.query.cxd && req.query.affiliateId && !(req.cookies.cxd && req.cookies.affiliateId)) {
            let rootDomain = customerBrandData.hostname.replace( /(.)*biglotteryowin/i, 'biglotteryowin');
            let cookieOptions = {domain: rootDomain, maxAge: config.affiliateCookieMaxAge, httpOnly: true};
            res.cookie('cxd', req.query.cxd, cookieOptions);
            res.cookie('affiliateId', req.query.affiliateId, cookieOptions);
          }
          redirectUrl = customerBrandData.protocol + '://' + customerBrandData.hostname + req.path + '?' +
            querystring.stringify(queryParams);
        } else {
          redirectUrl = customerBrandData.protocol + '://' + customerBrandData.redirectHost + req.originalUrl;
        }
        res.redirect(301, redirectUrl);
      })
      .catch(err => {
        logger.debug('Error during redirection', err);
        res.redirect(301, DEFAULT_BRAND_DATA.protocol + '://' + DEFAULT_BRAND_DATA.hostname + req.path + '?' +
          querystring.stringify(queryParams));
      })
  });
};


function getIp(req) {
  return req.headers[INCAPSULA_HEADER] ? req.headers[INCAPSULA_HEADER] :
    req.headers[ELB_HEADER] ? req.headers[ELB_HEADER].split(',')[0] :
      req.ip;
}

function getProtocol(protocol) {
  let protocolName = DEFAULT_PROTOCOL;
  if(protocols[protocol]) {
    protocolName = protocol;
  }

  return protocols[protocolName];
}
