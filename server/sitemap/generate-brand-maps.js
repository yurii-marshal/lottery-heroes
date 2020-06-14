/**
 * Module generates sitemap.xml and sitemap.xml.gs from static pages list and /lotteries/draws response,
 * filtering draws that have winners & prizes & winning_main_numers fields and it's status_id = 'settled
 *
 * priority and changefreq rules:
 * * Homepage and static pages have low values because they updates not very often and are less priority then results page
 * * Lotteries pages have 0.5 priority and daily changefreq because they update daily and have medium priority for our website
 * * Results (/results) has the highest priority and the hourly changefreq because it should be the most visited page and
 *   it could be updated hourly (there could be 5-7 lotteries playing every day)
 * * Lottery result pages have the highest priority because they are very important and daily changefreq because one
 *   lottery can be played only once a day
 * * Lottery draw page has 0.9 priority because it's important but less important then results page. Also it has monthly
 *   changefreq because when it is created, there is a very small chance that it's content would be updated soon (can
 *   be changed to yearly)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const sm = require('sitemap');
const slugs_map = require('./slugs-map');

const SITEMAP_XML_PATH = path.join(process.cwd(), 'server/sitemap/maps/');
const CACHE_TIMER = 30 * 60 * 1000;

let logger;
/**
 * Generating sitemap.xml and saving it to file
 * @param config
 */
module.exports = function (brand, config, protocol, host, log) {
  logger = log;
  logger.info("generating sitemap for", brand, {xid: 'website-init'});
  let static_urls = require('./static-urls/' + brand);
  let draws_urls,
    lotteries_urls;

  let app_sitemap_xml_file_name = brand + '_app.xml';
  let sitemap_xml_file_name = brand + '.xml';
  let draws;
  /**
   * Getting all draws
   */
  getAllDraws(brand, config.api_host)
    .then(res => {
      draws = res;
      return getAllLotteries(brand, config.api_host);
    })
    /**
     * Getting all lotteries
     */
    .then(lotteries => {
      // Generating urls from draws results
      draws_urls = generateDrawsUrlsArray(draws, lotteries, slugs_map);
      // Generating lotteries and lotteries results urls
      lotteries_urls = generateLotteriesUrlsArray(lotteries, slugs_map, brand);
      // Merging static, lotteries and draws urls
      let urls = static_urls.concat(lotteries_urls).concat(draws_urls);
      let url = protocol + '://' + host;
      // Generating XML sitemap
      let sitemap = sm.createSitemap({
        hostname: url,
        cacheTime: CACHE_TIMER,        // 30 mins - cache purge period
        urls: urls,
        xslUrl: '/sitemap.xsl'
      });

      /**
       * Sitemap object to XML format
       */
      sitemap.toXML(function (err, xml) {
        if (err) {
          logger.error(err, {xid: 'website-init'});
          return logger.error("Error generating sitemap", {xid: 'website-init'});
        }
        // *brand*_app.xml
        return new Promise((resolve, reject) => {
          fs.writeFile(SITEMAP_XML_PATH + app_sitemap_xml_file_name, xml, function (err) {
            if (err) reject(err);
            resolve(xml);
          });
        })
          .then(() => {
            return new Promise((resolve, reject) => {
              fs.writeFile(SITEMAP_XML_PATH + sitemap_xml_file_name, sm.buildSitemapIndex({
                urls: [
                  url + '/sitemap_app.xml',
                  url + '/biglotteryowinzone/sitemap.xml'
                ],
                xslUrl: '/sitemap.xsl'
              }), function (err) {
                if (err) {
                  reject(err);
                }
                resolve();
              });
            });
          })
          .catch(reason => {
            logger.error(reason, {xid: 'website-init'});
            reject(reason);
          });
      });
    })
    .catch(err => {
      logger.error("Couldn't get draws list, exit", {xid: 'website-init'});
      logger.error(err, {xid: 'website-init'});
    });
};

/**
 * Remove draws without winners, prizes, winning_main_numbers and where status_id is not 'settled'
 *
 * @param draw
 * @returns {boolean}
 */
let is_draw_has_all_results = function (draw) {
  return draw.winners && draw.prizes && draw.winning_main_numbers && draw.status_id == 'settled';
};

/**
 * Generate lotteries and /*-results map
 *
 * @param lotteries
 * @param lotteries_map
 * @returns {Array}
 */
let generateLotteriesUrlsArray = function(lotteries, lotteries_map, brand) {
  let result = [];
  lotteries.forEach((lottery) => {
    const lotteryId = lotteries_map[lottery.id] ? lotteries_map[lottery.id] : lottery.id;
    const brandOptions = lottery.brands.find(o => o.id === brand);
    if (brandOptions.is_sold) {
      result.push({
        url: `/${lotteryId}`,
        changefreq: 'daily',
        priority: 0.5
      });
    }
    result.push({
        url: `/${lotteryId}/results`,
        changefreq: 'daily',
        priority: 1
    });
  });
  return result;
};

/**
 * Generate draws url array from draws results
 *
 * @param draws
 * @param lotteries_map
 * @returns {*}
 */
let generateDrawsUrlsArray = function (draws, lotteries, lotteries_map) {
  const drawsUrlArr = [];
  draws.forEach((draw) => {
    if (lotteries.find(l => l.id === draw.lottery_id) && is_draw_has_all_results(draw)) {
      let lotteryId = lotteries_map[draw.lottery_id] ? lotteries_map[draw.lottery_id] : draw.lottery_id;
      let url = `/${lotteryId}/results/${draw.date_local}`;
      drawsUrlArr.push({
          url: url,
          priority: 0.9,
          lastmod: draw.date_local
      });
    }
  });
  return drawsUrlArr;
};

/**
 * Get all active lotteries for current brand
 *
 * @param brand
 * @param api_host
 * @returns {Promise}
 */
let getAllLotteries = function (brand, api_host) {
  return new Promise((resolve, reject) => {
    let options = {
      host: api_host,
      path: `/lotteries?brand_id=${brand}`
    };

    callback = function (response) {
      let str = '';

      response.on('error', function () {
        logger.error(str, {xid: 'website-init'});
        reject(str);
      });

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        try {
          let res_out = JSON.parse(str);
          let result = (res_out.lotteries) ? res_out.lotteries : '';
          if (typeof result != "object") {
            reject("Couldn't parse draw results response");
          } else
            resolve(result);
        }catch(exc) {
          reject("Couldn't parse draw results response");
        }
      });
    };

    http.request(options, callback).end();
  });
};

/**
 * Get all draws results
 *
 * @param brand
 * @param api_host
 */
let getAllDraws = function (brand, api_host) {
  return new Promise((resolve, reject) => {
    let options = {
      host: api_host,
      path: '/lotteries/draws?limit=100000&brand_id=' + brand
    };

    callback = function (response) {
      let str = '';

      response.on('error', function () {
        logger.error(str, {xid: 'website-init'});
        reject(str);
      });

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {

        try {
          let res_out = JSON.parse(str);
          let result = (res_out.draws) ? res_out.draws : '';
          if (typeof result != "object")
            reject("Couldn't parse draw results response");
          else
            resolve(result);
        }catch(exc) {
          reject("Couldn't parse draw results response");
        }


      });
    };

    http.request(options, callback).end();
  });
};
