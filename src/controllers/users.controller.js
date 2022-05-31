const Users = require("../db/models/users");

class UserController {

    async showOneUser(req, res) {

        const data = await Users.findOne({ slug: req.params.slug });

        res.render('pages/profiles/profile', { data, details: req.params, title: "Profiles" });
    }
    async showUsers(req, res) {

        const data = await Users.find({});

        res.render('pages/profiles/profiles', {users: data, title: "CO", details: 0});
    }
    showCreateUser(req, res) {
        res.render('pages/profiles/create', {title: "Stwórz nowego uzytkownika"});
    }
    async createUser(req, res) {
        try {
            await Users.create({
                name: req.body.name,
                email: req.body.email,
                slug: req.body.slug,
            })
            res.redirect('/profiles');
        } catch(e) {
            res.render('pages/profiles/create', {title: "Coś poszło nie tak!", errors: e.errors, form: req.body});
        }
    }
    async editShowUser(req, res) {
        const data = await Users.findOne({ slug: req.params.slug });
        res.render('pages/profiles/edit', {title: "Edytuj dane uzytkownika", form: data});
    }
    async editUser(req, res) {
        const data = await Users.findOne({ slug: req.params.slug });
        data.name = req.body.name;
        data.slug = req.body.slug;
        data.email = req.body.email;

        try {
            await data.save();
            res.redirect('/profiles');
        } catch(e) {
            res.render('pages/profiles/edit', {title: "Coś poszło nie tak!", errors: e.errors, form: req.body});
        }
    }
    async deleteUser(req, res) {
        try {
            await Users.deleteOne({ slug: req.params.slug })
            res.redirect('/profiles');
        } catch(e) {
            console.log(e.errors);
        }
    }

}

module.exports = new UserController();