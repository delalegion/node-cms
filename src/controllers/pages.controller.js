const e = require("express");

class PagesController {

    home(req, res) {
        if (!req.getLocales().includes(req.params.locale))
        {
            res.render('pages/404', {title: "404 - Site no found"});
        } else {  res.render('pages/home', {title: "Homepage"}); }
    }
    notFound(req, res) {
        res.render('pages/404', {title: "404 - Site no found"});
    }

}

module.exports = new PagesController();