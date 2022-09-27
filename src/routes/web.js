const express = require('express');
const router = new express.Router();
const path = require('path');

// Multer to upload photos
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, '-' + uniqueSuffix + path.extname(file.originalname))
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

const UserController = require("../controllers/users.controller");
const ProjectsController = require("../controllers/projects.controller");
const PagesController = require("../controllers/pages.controller");

const localeMiddleware = require("../middleware/locale")
const isAuth = require("../middleware/is.auth.logged")
const isAuthUnlogged = require("../middleware/is.auth.unlogged")

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
router.get("/:locale/edit/projects/:slug", [localeMiddleware], ProjectsController.showEditProjects)
router.post("/:locale/edit/projects/:slug", [localeMiddleware], upload.array('photos', 12), ProjectsController.editProjects)
router.get("/:locale/projects/create/:slug", [localeMiddleware], ProjectsController.showCreateProjects)
router.post("/:locale/projects/create", [localeMiddleware], upload.array('photos', 12), ProjectsController.createProjects)

// Profiles
router.get("/:locale/profiles", [localeMiddleware], UserController.showUsers)
router.post("/:locale/profiles", [localeMiddleware], UserController.showUsersDetails)
router.get("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editShowUser)
router.post("/:locale/edit/profile/:slug", [localeMiddleware], UserController.editUser)
router.get("/:locale/delete/profile/:slug", [localeMiddleware, isAuth], UserController.deleteUser)

//Auth
router.get("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.showLogin)
router.post("/:locale/auth/login", [localeMiddleware, isAuthUnlogged], UserController.loginUser)
router.get("/:locale/auth/register", [localeMiddleware], UserController.showCreateUser)
router.post("/:locale/auth/register", [localeMiddleware], UserController.createUser)
router.get("/:locale/auth/logout", [localeMiddleware, isAuth], UserController.logout)

// 404
router.get('*', PagesController.notFound)

module.exports = router;