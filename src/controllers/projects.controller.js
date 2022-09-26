const Projects = require("../db/models/projects");

class ProjectsController {

    async showProjects(req, res) {

        // console.log(req);
        const data = await Projects.findOne({ slug: 'pommmmmmmmm' });
        const photo = data.photos.split(',')[0]
        res.render('pages/projects/projects', {title: "Projects management", layout: 'layouts/main', photo});
    }
    async editProjects(req, res) {
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

}

module.exports = new ProjectsController();