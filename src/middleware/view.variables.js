module.exports = function (req, res, next) {
    res.locals.url = req.url;
    res.locals.errors = null;
    res.locals.form = {};
    res.locals.query = req.query;
    if (req.cookies.locale) { 
        res.locals.lang = req.cookies.locale
    } else {
        res.locals.lang = req.getLocales()[0];
    };
    next();
}