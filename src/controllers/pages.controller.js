class PagesController {

    home(req, res) {
        res.render('pages/home', {title: "Homepage"});
    }
    notFound(req, res) {
        res.render('pages/404', {title: "404 - Site no found"});
    }

}

module.exports = new PagesController();