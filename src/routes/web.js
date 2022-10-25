const express = require('express');
const router = new express.Router();
const UserController = require("../controllers/users.controller");
const ProjectsController = require("../controllers/projects.controller");
const PagesController = require("../controllers/pages.controller");

const localeMiddleware = require("../middleware/locale")
const isAuth = require("../middleware/is.auth.logged")
const isAuthUnlogged = require("../middleware/is.auth.unlogged")
const uploadMiddleware = require("../middleware/uploader");

// Home
router.get("/", (req, res) => {
    let homeRedirect = '';
    if (req.cookies.locale) { homeRedirect = req.cookies.locale } else {
        homeRedirect = req.getLocales()[0];
    };
    res.redirect('/' + homeRedirect);
})
router.get("/:locale/", localeMiddleware, PagesController.home)

// Projects
router.get("/:locale/edit/project/:slug", [localeMiddleware], ProjectsController.showEditProjects)
router.post("/:locale/edit/project/:slug", [localeMiddleware, uploadMiddleware], ProjectsController.editProjects)
router.get("/:locale/create/project", [localeMiddleware], ProjectsController.showCreateProjects)
router.post("/:locale/create/project", [localeMiddleware, uploadMiddleware], ProjectsController.createProjects)
router.get("/:locale/projects", [localeMiddleware], ProjectsController.showProjects)
router.get("/:locale/delete/project/:slug", [localeMiddleware], ProjectsController.deleteProject)

// Profiles
router.get("/:locale/profiles", [localeMiddleware], UserController.showUsers)
router.post("/:locale/profiles", [localeMiddleware], UserController.showUsersDetails)
router.get("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editShowUser)
router.post("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editUser)
router.get("/:locale/delete/profile/:slug", [localeMiddleware], UserController.deleteUser)

//Auth
router.get("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.showLogin)
router.post("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.loginUser)
router.get("/:locale/auth/register", [localeMiddleware], UserController.showCreateUser)
router.post("/:locale/auth/register", [localeMiddleware], UserController.createUser)
router.get("/:locale/auth/logout", [localeMiddleware, isAuth], UserController.logout)

// 404
router.get('*', PagesController.notFound)

module.exports = router;