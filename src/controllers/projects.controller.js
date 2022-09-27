const Projects = require("../db/models/projects");

class ProjectsController {

    async showCreateProjects(req, res) {
        res.render('pages/projects/projects', {title: "Projects management", layout: 'layouts/main'});
    }
    async createProjects(req, res) {
        const images = req.files;
        const arrayPaths = [];

        images.forEach((e) => {
            arrayPaths.push(e.path.split('public')[1]);
        })

        try {
            await Projects.create({
                slug: req.body.slug,
                title: req.body.title,
                client: req.body.client,
                description: req.body.description,
                tools: req.body.tools,
                photos: arrayPaths.join(',')
            })
            res.redirect("/" + req.params.locale + '/projects')
        } catch(e) {
            res.render('pages/projects/projects', {title: "Something goes wrong!", errors: e.errors, form: req.body});
        }
    }
    async showEditProjects(req, res) {
        const data = await Projects.findOne({ slug: req.params.slug });
        const tools = data.tools.split(',');
        if (!data) {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        } else { res.render('pages/projects/edit', {title: "Edit user data", form: data, tools, slug: req.params.slug}); }
    }   
    async editProjects(req, res) {
        console.log(req.body);
        const images = req.files;
        const arrayPaths = [];

        images.forEach((e) => {
            arrayPaths.push(e.path.split('public')[1]);
        })

        try {
            await Projects.where({slug: req.params.slug}).update({ $set: {
                slug: req.body.slug,
                title: req.body.title,
                client: req.body.client,
                description: req.body.description,
                tools: req.body.tools,
                photos: arrayPaths.join(',')
            }});
            res.redirect('/' + req.params.locale + '/');
            console.log("AHA");
        } catch(e) {
            console.log(e);
            res.render('pages/projects/edit', {title: "Something goes wrong!", errors: e.errors, form: req.body});
        }
    }

}

module.exports = new ProjectsController();