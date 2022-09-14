const e = require("express");

class PagesController {

    home(req, res) {
        if (!req.getLocales().includes(req.params.locale))
        {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        } else { 
            const user = req.session.user;
            const name = user?.name.split(' ');
            res.render('pages/home', {title: "Homepage", user: user, name: name });}
    }
    notFound(req, res) {
        res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal', lang: req.cookies.locale});
    }

}

module.exports = new PagesController();