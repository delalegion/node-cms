const express = require('express');
const router = new express.Router();

const UserController = require("../controllers/users.controller");
const PagesController = require("../controllers/pages.controller");

const localeMiddleware = require("../middleware/locale")
const isAuth = require("../middleware/is.auth.logged")
const isAuthUnlogged = require("../middleware/is.auth.unlogged")

// Setting locale
// const localeMiddleware = (req, res, next) => {
//     req.setLocale(req.params.locale);
//     if (req.params.locale !== 'favicon.ico' && req.getLocales().includes(req.params.locale)) {
//         res.cookie('locale', req.params.locale);
//     }
//     res.locals.lang = req.params.locale;
//     next();
// };

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
router.get("/:locale/profiles", [localeMiddleware], UserController.showUsers)
router.post("/:locale/profiles", [localeMiddleware], UserController.showUsersDetails)
router.get("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editShowUser)
router.post("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editUser)
router.get("/:locale/delete/profile/:slug", [localeMiddleware, isAuth], UserController.deleteUser)

//Auth
router.get("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.showLogin)
router.post("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.loginUser)
router.get("/:locale/auth/register", [localeMiddleware, isAuth], UserController.showCreateUser)
router.post("/:locale/auth/register", [localeMiddleware, isAuth], UserController.createUser)
router.get("/:locale/auth/logout", [localeMiddleware, isAuth], UserController.logout)

// 404
router.get('*', PagesController.notFound)

module.exports = router;