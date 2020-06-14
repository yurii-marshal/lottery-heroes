/**
 * Returns specific robots.txt for each brand
 * /robots/txts* - where all the robots.txt are stored
 */

const fs = require('fs');
const path = require('path');
const { getBrandId, getBrand } = require('package-brands');

module.exports = function (app, config) {
  app.use('/robots.txt', (req, res, next) => {
    const reqHostname = req.get('host');
    let brandId = getBrandId(reqHostname);
    const {hostname} = getBrand(brandId, process.env.ENV);
    if (reqHostname !== hostname) {
      brandId = 'NO_BRAND';
    }
    // res.sendfile() is not working properly, so we read file contents and send it
    fs.readFile(path.join(process.cwd(), `server/robots/txts/${brandId}.txt`), 'utf8', function (err,data) {
      res.set('Content-Type', 'text/plain');
      res.send(data);
      res.end();
    });
  });
};
