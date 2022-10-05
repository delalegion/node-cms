const express = require('express');
const router = new express.Router();
const UserController = require("../controllers/users.controller");
const ProjectsController = require("../controllers/projects.controller");
const PagesController = require("../controllers/pages.controller");

const localeMiddleware = require("../middleware/locale")
const isAuth = require("../middleware/is.auth.logged")
const isAuthUnlogged = require("../middleware/is.auth.unlogged")

const path = require('path');
const fs = require('fs');

// Multer to upload photos
const multer = require('multer');
const storagec = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, '../../public/uploads/' + req.body.photosUrl);
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      cb(null, 'public/uploads/' + req.body.photosUrl)
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, '-' + uniqueSuffix + path.extname(file.originalname))
      cb(null, file.originalname)
    }
})
const storage = multer.memoryStorage();
const uploadMiddleware = (req,res,next)=>{

  let maxSize = (1*1024*1024).toFixed(2);
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  
  const uploader = multer({ storage: storage, limits: { fileSize: 482824824428427 },
    fileFilter: function(req,file,cb) {
      if (!validExtensions.includes(file.mimetype)) {
        req.fileValidationError = 'goes wrong on the mimetype'; 
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      cb(null, true);
    }
  }).array('photos', 15);

  // Here call the upload middleware of multer
  uploader(req, res, function (err) {
     if (err instanceof multer.MulterError) {
       // A Multer error occurred when uploading.
       const err = new Error('Multer error');
       next(err)
       } else if (err) {
       // An unknown error occurred when uploading.
       const err = new Error('Server Error')
       next(err)
     }

    // Everything went fine.
    next()
  })

}

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
router.post("/:locale/edit/projects/:slug", [localeMiddleware, uploadMiddleware], ProjectsController.editProjects)
router.get("/:locale/create/project", [localeMiddleware], ProjectsController.showCreateProjects)
router.post("/:locale/create/project", [localeMiddleware, uploadMiddleware], ProjectsController.createProjects)

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