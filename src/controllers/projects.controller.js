const Projects = require("../db/models/projects");
const path = require('path');
const fs = require('fs');

class ProjectsController {

    async showProjects(req, res) {
        const { q, sort } = req.query;
        let query = Projects.find({ name: { $regex: q || '', $options: 'i' } });

        const page = req.query.page || 1;
        const limitPerPage = 9;

        const count = await Projects.find({ name: { $regex: q || '', $options: 'i' } }).count();
        const pagesCount = count / limitPerPage;

        query = query.skip((page-1) * limitPerPage); 
        query = query.limit(limitPerPage);

        if (sort) {
            const a = sort.split('|');
            query = query.sort({ [a[0]]: a[1]})
        }
        const data = await query.exec();
        
        if(res.getLocales().includes(req.params.locale)) {
            res.render('pages/projects/projects', {title: "Projects management", layout: 'layouts/main', projects: data, pagesCount});
        } else {
            res.render('pages/404', {title: "404 - Site no found", layout: 'layouts/minimal'});
        }
    }
    async showCreateProjects(req, res) {
        res.render('pages/projects/create', {title: "Create new project", layout: 'layouts/main'});
    }
    async createProjects(req, res) {
        const images = req.files;

        const createdir = () => {
            const dir = path.join(__dirname, '../../public/uploads/' + req.body.slug);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
        const upload = () => {
            images.forEach((e) => {
                const newpath = path.join(__dirname, '../../public/uploads/' + req.body.slug + '/' + e.originalname);
                fs.writeFileSync(newpath, e.buffer);
            })
        }

        const modifyPaths = (paths) => {
            const pathsArray = [];
            paths.split(',').forEach((e) => {
                const newPath = '/uploads/' + req.body.slug + '/' + e;
                pathsArray.push(newPath)
            })
            return pathsArray.join(',');
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
                e.errors.files = { properties: { message: res.__('errors.projects.files'), path: 'files' } };
            }
            const newErrorsInstance = {};
            for (let i in e.errors) {
                newErrorsInstance[e.errors[i].properties.path] = res.__(e.errors[i].properties.message)
            }
            // res.render('pages/projects/projects', {title: "Error occured. Check entered data.", form: req.body, errors: e.errors});
            res.status(404).json({ errors: newErrorsInstance })
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
        const files = req.files;
        
        const upload = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    files.forEach((e) => {
                        if (e.buffer) {
                            const newpath = path.join(__dirname, '../../public/uploads/' + req.body.slug + '/' + e.originalname);
                            fs.writeFileSync(newpath, e.buffer);
                        }
                    })
                    resolve()
                }, 1000)
            })
        }

        const modifyPaths = (paths) => {
            const pathsArray = [];
            paths.split(',').forEach((e) => {
                const newPath = '/uploads/' + req.body.slug + '/' + e;
                pathsArray.push(newPath)
            })
            return pathsArray.join(',');
        }

        const oldProject = await Projects.findOne({ slug: req.params.slug })
        const projectPhotos = oldProject.photos.split(',');

        const deletePreviousImages = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (projectPhotos.length > 1) {
                        const imagesArray = images.split(',')
                        projectPhotos.forEach((image) => {
                            if(!imagesArray.includes(image.split('/uploads/'+oldProject.slug+'/')[1])) {
                                const dir = path.join(__dirname, '../../public/' + image);
                                console.log(dir, " usunieto")
                                fs.unlinkSync(dir)
                                return Promise.resolve();
                            }
                        })
                    }
                    resolve()
                }, 1000)
            })
        }

        const changeDestination = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (oldProject.slug !== req.body.slug) {
                        fs.rename(path.join(__dirname, '../../public/uploads/' + oldProject.slug), path.join(__dirname, '../../public/uploads/' + req.body.slug), function(err) {
                            if ( err ) console.log('ERROR: ' + err);
                        });
                        resolve()
                    }
                    resolve()
                }, 1000)
            })
        }

        const project = await Projects.findOne({ slug: req.params.slug });

        if (req.body.slug !== project.slug) project.slug = req.body.slug;
        project.title = req.body.title
        project.client = req.body.client
        project.description = req.body.description
        project.tools = req.body.tools
        project.photos = modifyPaths(req.body.rawData);

        try {
            await project.save();
            await deletePreviousImages();
            await changeDestination();
            await upload();
            res.redirect("/" + req.params.locale + '/projects')
        } catch(e) {
            if (req.fileValidationError) {
                e.errors.files = { properties: { message: res.__('errors.projects.files'), path: 'files' } };
            }
            const newErrorsInstnace = {};
            for (let i in e.errors) {
                newErrorsInstnace[e.errors[i].properties.path] = res.__(e.errors[i].properties.message)
            }
            // res.render('pages/projects/projects', {title: "Error occured. Check entered data.", form: req.body, errors: e.errors});
            res.status(404).json({ errors: newErrorsInstnace })
        }
    }

}

module.exports = new ProjectsController();