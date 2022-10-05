const Projects = require("../db/models/projects");
const path = require('path');
const fs = require('fs');
const i18n = require('i18n')

class ProjectsController {
    async showCreateProjects(req, res) {
        res.render('pages/projects/projects', {title: "Projects management", layout: 'layouts/main'});
    }
    async createProjects(req, res) {
        const images = req.files;
        console.log(req.body)

        const createdir = () => {
            const dir = path.join(__dirname, '../../public/uploads/' + req.body.photosUrl);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
        const upload = () => {
            images.forEach((e) => {
                const newpath = path.join(__dirname, '../../public/uploads/' + req.body.photosUrl + '/' + e.originalname);
                fs.writeFileSync(newpath, e.buffer);
            })
        }

        const modifyPaths = (paths) => {
            const pathsArray = [];
            paths.split(',').forEach((e) => {
                const newPath = '/uploads/' + req.body.photosUrl + '/' + e;
                pathsArray.push(newPath)
            })
            return pathsArray.join(',');
        }

        if (req.fileValidationError) {
            console.log("cosnietak z files")
        }

        try {
            await Projects.create({
                slug: req.body.slug,
                title: req.body.title,
                client: req.body.client,
                description: req.body.description,
                tools: req.body.tools,
                photos: modifyPaths(req.body.rawData)
            })
            await createdir();
            await upload();
            res.redirect("/" + req.params.locale + '/projects')
        } catch(e) {
            if (req.fileValidationError) {
                e.errors.files = { message: res.__('errors.projects.files') };
            }
            const newErrorsInstnace = {};
            for (let i in e.errors) {
                newErrorsInstnace[e.errors[i].properties.path] = res.__(e.errors[i].properties.message)
            }
            // res.render('pages/projects/projects', {title: "Error occured. Check entered data.", form: req.body, errors: e.errors});
            res.status(400).json({ errors: newErrorsInstnace })
        }
    }
    async showEditProjects(req, res) {
        try {
            const data = await Projects.findOne({ slug: req.params.slug });
            const tools = data.tools.split(',');
            const photos = data.photos.split(',');
            res.render('pages/projects/edit', {title: "Edit user data", form: data, tools, photos, slug: req.params.slug});
        } catch(e) {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        }
    }   
    async editProjects(req, res) {
        const images = req.body.rawData;

        const oldProject = await Projects.findOne({ slug: req.params.slug })
        const projectPhotos = oldProject.photos.split(',');

        if (projectPhotos.length > 0) {
            projectPhotos.forEach((image) => {
                if(!images.includes(image)) {
                    const dir = path.join(__dirname, '../../public/' + image);
                    fs.unlinkSync(dir)
                }
            })
        }

        const project = await Projects.findOne({ slug: req.params.slug });

        if (req.body.slug !== project.slug) project.slug = req.body.slug;
        project.title = req.body.title
        project.client = req.body.client
        project.description = req.body.description
        project.tools = req.body.tools
        project.photos = (typeof images === 'string') ? images : images.join(',');

        try {
            await project.save();
            res.redirect('/' + req.params.locale + '/');
        } catch(e) {
            res.render('pages/projects/edit', {title: "Something goes wrong!", errors: e.errors, form: req.body});
        }
    }

}

module.exports = new ProjectsController();