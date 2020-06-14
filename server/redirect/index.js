module.exports = (app) => {
    require('./smart-link')(app);
    const absolutePaths = require('./absolute-paths');
    const regExpPaths = require('./regexp-paths');

    absolutePaths.forEach((item) => {
        app.use(item.path, (req, res, next) => res.redirect(301, item.newPath));
    });

    regExpPaths.forEach((item) => {
        app.use(item.regExp, (req, res, next) => {
            res.redirect(301, req.originalUrl.replace(item.regExp, item.replacer));
        });
    });
};
