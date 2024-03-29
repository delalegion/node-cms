const Users = require("../db/models/users");

class UserController {

    async showUsers(req, res) {
        const { q, sort } = req.query;
        let query = Users.find({ name: { $regex: q || '', $options: 'i' } });

        const page = req.query.page || 1;
        const limitPerPage = 12;

        const count = await Users.find({ name: { $regex: q || '', $options: 'i' } }).count();
        const pagesCount = count / limitPerPage;

        query = query.skip((page-1) * limitPerPage); 
        query = query.limit(limitPerPage);

        if (sort) {
            const a = sort.split('|');
            query = query.sort({ [a[0]]: a[1]})
        }
        const data = await query.exec();
        
        if(res.getLocales().includes(req.params.locale)) {
            res.render('pages/profiles/profiles', {users: data, title: "Users", details: 0, pagesCount, page});
        } else {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        }
    }
    async showUsersDetails(req, res) {
        const data = await Users.findOne({ _id: req.body.id });
        console.log(req.body)
        console.log(data)
        res.status(200).json(data);
    }
    showCreateUser(req, res) {
        res.render('pages/auth/register', {title: "Create new user!"});
    }
    async createUser(req, res) {
        let customErrors = {};
        const fields = ['name', 'email', 'slug'];

        let allUsers = await Users.find();

        [...fields.slice(1)].forEach((e) => {
            allUsers.forEach((u) => {
                if (u[e] === req.body[e]) {
                    customErrors[e] = { message: "errors.users.unique" }
                }
            })
        })

        try {
            await Users.create({
                name: req.body.name,
                email: req.body.email,
                slug: req.body.slug,
                password: req.body.password
            })
            res.redirect("/" + req.params.locale + '/auth/login')
        } catch(e) {
            const concatErrors = Object.assign(customErrors, e.errors);
            res.render('pages/auth/register', {title: "Something goes wrong!", errors: concatErrors, form: req.body});
        }
    }
    async showLogin(req, res) {
        res.render('pages/auth/login', {title: "Login to dashboard!", form: req.body, layout: 'layouts/minimal'});
    }
    async loginUser(req, res) {
        try {
            const user = await Users.findOne({ email: req.body.email })
            if (!user) {
                throw new Error("user not found")
            }
            const isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
                throw new Error("password not valid")
            }
            req.session.user = {
                _id: user._id,
                email: user.email,
                name: user.name
            }
            res.redirect('/' + req.params.locale + '/');
        }
        catch (e) {
            res.render('pages/auth/login', {form: req.body, errors: true, title: "Something goes wrong!", layout: 'layouts/minimal'});
        }
    }
    async editShowUser(req, res) {
        const data = await Users.findOne({ slug: req.params.slug });
        if (!data) {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        } else { res.render('pages/profiles/edit', {title: "Edit user data", form: data}); }
    }
    async editUser(req, res) {
        let user = await Users.findOne({ slug: req.params.slug });
        let data = {}
        let customErrors = {};
        const fields = ['name', 'email', 'slug'];

        fields.forEach((e) => {
            if (user[e] !== req.body[e]) {
                data[e] = req.body[e]
            }
        })

        let allUsers = await Users.find();
        [...fields.slice(1)].forEach((e) => {
            allUsers.forEach((u) => {
                if (user[e] !== req.body[e]) {
                    if (u[e] === req.body[e]) {
                        customErrors[e] = { message: "errors.users.unique" }
                    }
                }
            })
        })

        try {
            await Users.updateOne({slug: req.params.slug}, { $set: data }, { runValidators: true });
            res.redirect('/' + req.params.locale + '/');
        } catch(e) {
            const concatErrors = Object.assign(customErrors, e.errors);
            res.render('pages/profiles/edit', {title: "Something goes wrong!", errors: concatErrors, form: req.body});
        }
    }
    async deleteUser(req, res) {
        try {
            await Users.deleteOne({ slug: req.params.slug })
            res.redirect('/' + req.params.locale + '/');
        } catch(e) {
            console.log(e.errors);
        }
    }
    logout(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/' + req.params.locale + '/auth/login');
        })
    }
}

module.exports = new UserController();