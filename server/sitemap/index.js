/**
 * Sending sitemap.xml and sitemap.xml.gz depending on domain
 * Generating sitemap and sitemap.xml.gz for each brand and regenerating it each 30 minutes
 */
const fs = require('fs');
const path = require('path');
const package_brands = require('package-brands');
const generate_brand_maps = require('./generate-brand-maps');
const CACHE_TIMER = 30 * 60 * 1000;

module.exports = function (app, config) {
  let logger = app.get('logger');
  /**
   * XSL file (styles for sitemap)
   */
  app.use('/sitemap.xsl', require('express').static(process.cwd() + '/server/sitemap/sitemap.xsl'));

  /**
   * Sending XML sitemap depending on brand request
   */
  app.use('/sitemap.xml', (req, res, next) => {
    let brand = package_brands.getBrandId(req.get('host'));
    // res.sendfile() is not working properly, so we read file contents and send it
    fs.readFile(path.join(process.cwd(), `server/sitemap/maps/${brand}.xml`), 'utf8', function (err,data) {
      if (err) {
        res.set('Content-Type', 'text/html');
        res.send(err);
        return res.end();
      }
      res.set('Content-Type', 'text/xml');
      res.send(data);
      res.end();
    });
  });

  /**
   * Sending XML GZ sitemap depending on brand request
   */
  // app.use('/sitemap.xml.gz', (req, res, next) => {
  //   let brand = package_brands.getBrandId(req.get('host'));
  //   // res.sendfile() is not working properly, so we read file contents and send it
  //   fs.readFile(path.join(__dirname, `/maps/${brand}.xml.gz`), 'utf8', function (err,data) {
  //     if (err) {
  //       res.set('Content-Type', 'text/html');
  //       res.send(err);
  //       return res.end();
  //     }
  //     res.set('Content-Type', 'application/x-gzip');
  //     res.send(data);
  //     res.end();
  //   });
  // });

  /**
   * Sitemap XMl for express application
   */
  app.use('/sitemap_app.xml', (req, res, next) => {
    let brand = package_brands.getBrandId(req.get('host'));
    // res.sendfile() is not working properly, so we read file contents and send it
    fs.readFile(path.join(process.cwd(), `server/sitemap/maps/${brand}_app.xml`), 'utf8', function (err,data) {
      if (err) {
        res.set('Content-Type', 'text/html');
        res.send(err);
        return res.end();
      }
      res.set('Content-Type', 'text/xml');
      res.send(data);
      res.end();
    });
  });

  /**
   * Sending XML GZ sitemap depending on brand request
   */
  // app.use('/sitemap.xml.gz', (req, res, next) => {
  //   let brand = package_brands.getBrandId(req.get('host'));
  //   // res.sendfile() is not working properly, so we read file contents and send it
  //   fs.readFile(path.join(__dirname, `/maps/${brand}_app.xml.gz`), 'utf8', function (err,data) {
  //     if (err) {
  //       res.set('Content-Type', 'text/html');
  //       res.send(err);
  //       return res.end();
  //     }
  //     res.set('Content-Type', 'application/x-gzip');
  //     res.send(data);
  //     res.end();
  //   });
  // });

  /**
   * Generate sitemap file each 30 minutes
   */
  regenMaps(config, logger);
  setInterval(() => {
    regenMaps(config, logger);
  }, CACHE_TIMER);
};

/**
 * Regenerate/create sitemaps for all brands
 * Taking brand names from config
 * @param config
 */
let regenMaps = function(config, logger) {
  let env = process.env.ENV || 'local';
  let brands = package_brands.getAllBrands(env);
  Object.keys(brands).forEach((brand) => {
    let brand_data = brands[brand];
    if(brand_data && brand !== 'MOBIO')
      generate_brand_maps(brand, config, brand_data.protocol, brand_data.hostname, logger);
  })
};
