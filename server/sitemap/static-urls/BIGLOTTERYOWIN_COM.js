/**
 * Website static urls list
 * format type from https://www.npmjs.com/package/sitemap#example-of-synchronous-sitemapjs-usage
 */
module.exports = [
  { url: '/',  changefreq: 'weekly', priority: 0.3 },
  { url: '/about',  changefreq: 'monthly', priority: 0.3 },
  { url: '/about/contact',  changefreq: 'monthly', priority: 0.3 },
  { url: '/about/faq',  changefreq: 'monthly', priority: 0.3 },
  { url: '/lotteries',  changefreq: 'daily', priority: 0.7 },
  { url: '/about/privacy',  changefreq: 'monthly', priority: 0.3 },
  { url: '/results',  changefreq: 'hourly', priority: 1 },
  { url: '/signup',  changefreq: 'monthly', priority: 0.3 },
  { url: '/about/terms-and-conditions',  changefreq: 'monthly', priority: 0.3 },
  { url: '/about/responsible-gaming',  changefreq: 'monthly', priority: 0.3 }
];
