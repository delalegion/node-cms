const express = require('express');
const router = new express.Router();
const UserController = require("../controllers/users.controller");
const ProjectsController = require("../controllers/projects.controller");
const PagesController = require("../controllers/pages.controller");

const localeMiddleware = require("../middleware/locale")
const isAuth = require("../middleware/is.auth.logged")
const isAuthUnlogged = require("../middleware/is.auth.unlogged")
const uploadMiddleware = require("../middleware/uploader");
const rateLimiterMiddleware = require('../middleware/rate-limiter');

// Home
router.get("/", (req, res) => {
    let homeRedirect = '';
    if (req.cookies.locale) { homeRedirect = req.cookies.locale } else {
        homeRedirect = req.getLocales()[0];
    };
    res.redirect('/' + homeRedirect);
})
router.get("/:locale/", [localeMiddleware, isAuth], PagesController.home)

// Projects
router.get("/:locale/edit/project/:slug", [localeMiddleware, isAuth], ProjectsController.showEditProjects)
router.post("/:locale/edit/project/:slug", [localeMiddleware, isAuth, uploadMiddleware], ProjectsController.editProjects)
router.get("/:locale/create/project", [localeMiddleware, isAuth], ProjectsController.showCreateProjects)
router.post("/:locale/create/project", [localeMiddleware, isAuth, uploadMiddleware], ProjectsController.createProjects)
router.get("/:locale/projects", [localeMiddleware, isAuth], ProjectsController.showProjects)
router.get("/:locale/delete/project/:slug", [localeMiddleware, isAuth], ProjectsController.deleteProject)

// Profiles
router.get("/:locale/profiles", [localeMiddleware, isAuth], UserController.showUsers)
router.post("/:locale/profiles", [localeMiddleware, isAuth], UserController.showUsersDetails)
router.get("/:locale/edit/profile/:slug", [localeMiddleware, isAuth], UserController.editShowUser)
router.post("/:locale/edit/profile/:slug", [localeMiddleware, isAuth], UserController.editUser)
router.get("/:locale/delete/profile/:slug", [localeMiddleware, isAuth], UserController.deleteUser)

//Auth
router.get("/:locale/auth/login", [localeMiddleware, isAuthUnlogged, rateLimiterMiddleware], UserController.showLogin)
router.post("/:locale/auth/login", [localeMiddleware, isAuthUnlogged, rateLimiterMiddleware], UserController.loginUser)
router.get("/:locale/auth/register", [localeMiddleware, isAuth], UserController.showCreateUser)
router.post("/:locale/auth/register", [localeMiddleware, isAuth], UserController.createUser)
router.get("/:locale/auth/logout", [localeMiddleware, isAuth], UserController.logout)

// 404
router.get('*', PagesController.notFound)

module.exports = router;