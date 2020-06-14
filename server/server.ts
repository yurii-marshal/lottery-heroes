import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { join } from 'path';

import { enableProdMode } from '@angular/core';
enableProdMode();

import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { getBrandId, getBrand } from 'package-brands';

import * as auth from 'basic-auth';
import * as url from 'url';
import * as useragent from 'express-useragent';
import * as express from 'express';

// set process ENV
process.env.ENV = process.env.ENV || 'local';

const compression = require('compression')();
const cookieParser = require('cookie-parser');
const mime = require('mime-types');
const proxy = require('./wordpress/proxy');
const os = require('os');
const sitemap = require('./sitemap/index');
const robots = require('./robots/index');
const config = require('./env/' + process.env.ENV + '.js');
const distPath = join(process.cwd(), 'dist');
const templateFilePath = join(distPath, 'browser', 'index.html');

// logger
const logger = require('package-log')({
  name: 'app-website',
  debug: config.log.debug,
  logstash: config.log.logstash,
  checkXid: false,
  env: process.env.ENV
});

const app = express();
app.set('config', config);
app.set('logger', logger);

proxy(app);
app
  .use(useragent.express())
  .use(compression)
  .use(cookieParser());

// set process ENV
process.env.ENV = process.env.ENV || 'local';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('../dist/server/main.bundle');

// Fix error with window on prerender
const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(templateFilePath).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');
app.set('views', join(distPath, 'browser'));

// Remove trailing slash
app.use((req, res, next) => {
  if (req.url.substr(-1) === '/' && req.url.length > 1) {
    res.redirect(301, req.url.slice(0, -1));
  } else {
    next();
  }
});

// Redirect
require('./redirect')(app);

app.get('/_health', (req, res) => {
  const freeMemory = os.freemem() / 1000000; // convert bytes to megabytes
  let status = 200;
  if (freeMemory < 200) {
    status = 503;
  }
  res.sendStatus(status);
});

// Add Basic auth if there's an auth property in the config for this environment
if (config.auth !== undefined) {
  app.use(function (req, res, next) {
    // assets should be accessible without auth
    if (!req.path.includes('assets/')) {
      const user = auth(req);
      if (!user || user.name !== config.auth.username || user.pass !== config.auth.password) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="GamingHub"');
        res.end('Access denied');
      } else {
        next();
      }
    } else {
      next();
    }
  });
}

// Generates robots.txt fro each brand
robots(app, config);

// Return 404 if no Brand by hostname
app.use((req, res, next) => {
  const reqHostname = req.get('host');
  const brandId = getBrandId(reqHostname);
  const {hostname} = getBrand(brandId, process.env.ENV);

  if (reqHostname !== hostname) {
    res.status(404);
    res.send('Not Found');
  } else {
    next();
  }
});

// The best sitemap.xml generator
sitemap(app, config);

// Server static files from /browser
app.get('*.*', express.static(join(distPath, 'browser'), {
  setHeaders: (res, pth) => {
    const mimeType = mime.lookup(pth);
    if (mimeType === 'application/json') {
      res.setHeader('Cache-Control', 'max-age=3600, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'max-age=604800, must-revalidate');
    }
  }
}));

app.get('/payment/*', (req, res) => {
  const reqUrl = url.parse(req.url, false);
  res.sendFile(distPath + '/browser/' + reqUrl.pathname + '.html');
});

app.get(/\/(myaccount|cart|signup|login|lottery-notification-subscribe|lottery-notification-unsubscribe)/,
  (req, res) => {
    res.sendFile(templateFilePath);
  });

// cache
let cache = (req, res, next) => next();
if (config.cache) {
  cache = require('./cache')(config);
}

// All regular routes use the Universal engine
app.get('*', cache, (req: express.Request, res: express.Response) => {
  res.render(templateFilePath, {req}, (err, html) => {
    if (err) {
      app.get('logger').error('Error in render', err, 'ENV', process.env.ENV, {xid: 'website-init'});
      res.sendFile(templateFilePath);
    } else {
      // set cache header for html pages
      res.setHeader('Cache-Control', 'max-age=3600, must-revalidate');

      // send 404 status code if this is 404 page
      if (html.indexOf('page-404-component') !== -1) {
        res.status(404);
      }

      res.send(html);
    }
  });
});

// Start up the Node server
app.listen(config.port, () => {
  app.get('logger').info('Listening on port', config.port, 'ENV', process.env.ENV, {xid: 'website-init'});
});
