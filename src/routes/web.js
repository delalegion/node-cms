const express = require('express');
const router = new express.Router();

const UserController = require("../controllers/users.controller");
const PagesController = require("../controllers/pages.controller");

// Home
router.get("/", PagesController.home)

// Profiles
router.get("/profiles", UserController.showUsers)
router.get("/profile/:slug/:mode?", UserController.showOneUser);
router.get("/create/profile", UserController.showCreateUser)
router.post("/create/profile", UserController.createUser)
router.get("/edit/profile/:slug", UserController.editShowUser)
router.post("/edit/profile/:slug", UserController.editUser)
router.get("/delete/profile/:slug", UserController.deleteUser)

// 404
router.get('*', PagesController.notFound)

module.exports = router;