const express = require('express');
const router = new express.Router();
//Controllers
const ProjectsController = require("../controllers/api/projects.controller");
const UsersController = require("../controllers/api/users.controller");
//Middlewares
const uploadMiddleware = require("../middleware/uploader");
const authApiMiddleware = require("../middleware/is.auth.api.logged");

//Projects api
router.get('/projects', ProjectsController.show);
router.post('/projects', [uploadMiddleware, authApiMiddleware], ProjectsController.create);
router.put('/projects/:slug', [uploadMiddleware, authApiMiddleware], ProjectsController.update);

//User login api
router.post('/login', UsersController.loginUser);

module.exports = router;