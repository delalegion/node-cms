const { I18n } = require('i18n');

module.exports = function (req, res, next) {
    res.locals.i18n = I18n;
    res.locals.url = req.url;
    res.locals.errors = null;
    res.locals.form = {};
    res.locals.query = req.query;
    res.locals.changeLanguage = (lang) => {
        if (req.url !== '/favicon.ico') {
            const split = req.url.split("/");
            const length = split[1].length;
            const substring = req.url.substring(length + 1);
            return "/" + lang + substring;
        }
    };
    res.locals.user = req.session.user;
    res.locals.checkUrl = (url) => {
        const cutUrl = req.url.split('?')[0];

        if (req.params.locale) {
            if (url.length > 0) {
                if (cutUrl === '/' + req.params.locale + '/' + url || cutUrl === '/' + req.params.locale + '/' + url + '/') {
                    return true;
                } else { return false; }
            } else {
                if (cutUrl === '/' + req.params.locale || cutUrl === '/' + req.params.locale + '/') {
                    return true;
                } else { return false; }
            }
        } else { return false; }
    };
    res.locals.checkUrlInclude = (url) => {
        const cutUrl = req.url.split('?')[0];

        if (req.params.locale) {
            if (url.length > 0) {
                if (cutUrl.includes(url)) {
                    return true;
                } else { return false; }
            }
        }
        return false;
    }
    next();
}