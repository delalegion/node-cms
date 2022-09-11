module.exports = function(req, res, next) {
    req.setLocale(req.params.locale);
    if (req.params.locale !== 'favicon.ico' && req.getLocales().includes(req.params.locale)) {
        res.cookie('locale', req.params.locale);
    }
    res.locals.lang = req.params.locale;
    next();
};