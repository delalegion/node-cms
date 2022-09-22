const Projects = require("../db/models/projects");

class ProjectsController {

    async showProjects(req, res) {

        // console.log(req);
        const skillsArray = [];

        res.render('pages/projects/all', {title: "Projects management", layout: 'layouts/main'});
    }
    async editProjects(req, res) {
        try {
            await Projects.create({
                slug: req.body.slug,
                title: req.body.title,
                client: req.body.client,
                description: req.body.description,
                tools: req.body.tools
            })
            res.redirect("/" + req.params.locale + '/projects')
        } catch(e) {
            console.log(e)
            res.render('pages/projects/all', {title: "Something goes wrong!", errors: e.errors, form: req.body});
        }
    }

}

module.exports = new ProjectsController();