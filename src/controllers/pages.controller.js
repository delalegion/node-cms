const e = require("express");
const Projects = require("../db/models/projects");
const Users = require("../db/models/users");

class PagesController {

    async home(req, res) {
        if (!req.getLocales().includes(req.params.locale))
        {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        } else { 
            const user = req.session.user;
            const name = user?.name.split(' ');

            const usersCount = await Users.find({}).count();
            const projectsCount = await Projects.find({}).count();
            res.render('pages/home', {title: "Homepage", user: user, name: name, usersCount, projectsCount });}
    }
    notFound(req, res) {
        res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal', lang: req.cookies.locale});
    }

}

module.exports = new PagesController();