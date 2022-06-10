module.exports = function (req, res, next) {
    res.locals.url = req.url;
    res.locals.errors = null;
    res.locals.form = {};
    res.locals.query = req.query;
    res.locals.lang = req.url.split('/')[1];
    next();
}