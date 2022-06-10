const express = require('express');
const router = new express.Router();

const UserController = require("../controllers/users.controller");
const PagesController = require("../controllers/pages.controller");

// Setting locale
const localeMiddleware = (req, res, next) => {
    if (req.params.locale !== 'favicon.ico' && req.getLocales().includes(req.params.locale)) {
        res.cookie('locale', req.params.locale);
    }
    req.setLocale(req.params.locale);
    next();
};

// Home
router.get("/", (req, res) => {
    let homeRedirect = '';
    if (req.cookies.locale) { homeRedirect = req.cookies.locale } else {
        homeRedirect = req.getLocales()[0];
    };
    res.redirect('/' + homeRedirect);
})
router.get("/:locale/", localeMiddleware, PagesController.home)

// Profiles
router.get("/:locale/profiles", localeMiddleware, UserController.showUsers)
router.get("/:locale/profile/:slug/:mode?", localeMiddleware, UserController.showOneUser);
router.get("/:locale/create/profile", localeMiddleware, UserController.showCreateUser)
router.post("/:locale/create/profile", localeMiddleware, UserController.createUser)
router.get("/:locale/edit/profile/:slug", localeMiddleware, UserController.editShowUser)
router.post("/:locale/edit/profile/:slug", localeMiddleware, UserController.editUser)
router.get("/:locale/delete/profile/:slug", localeMiddleware, UserController.deleteUser)

// 404
router.get('*', localeMiddleware, PagesController.notFound)

module.exports = router;