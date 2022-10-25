const Projects = require("../../db/models/projects");
const path = require('path');
const fs = require('fs');

class ProjectsController {

    async show(req, res) {
        const projects = await Projects.find({});
        res.json(projects)
    }
    async create(req, res) {
        const project = new Projects({
            slug: req.body.slug,
            title: req.body.title,
            client: req.body.client,
            description: req.body.description,
            tools: req.body.tools
        })
        try {
            await project.save();
            res.status(201).json(project);
        } catch(e) {
            res.status(404).json({ errors: e.errors })
        }
    }
    async update(req, res) {
        const images = req.body.rawData;
        const files = req.files;

        const upload = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    files.forEach((e) => {
                        if (e.buffer) {
                            const newpath = path.join(__dirname, '../../../public/uploads/' + req.body.slug + '/' + e.originalname);
                            fs.writeFileSync(newpath, e.buffer);
                        }
                    })
                    resolve()
                }, 5000)
            })
        }

        const modifyPaths = (paths) => {
            const pathsArray = [];
            paths.forEach((e) => {
                const newPath = '/uploads/' + req.body.slug + '/' + e.originalname;
                pathsArray.push(newPath)
            })
            return pathsArray.join(',');
        }

        const oldProject = await Projects.findOne({ slug: req.params.slug })
        let projectPhotos = ''
        if (typeof oldProject.photos !== 'undefined') {
            projectPhotos = oldProject.photos.split(',');
        }

        const deletePreviousImages = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (projectPhotos.length > 1) {
                        const imagesArray = images.split(',')
                        projectPhotos.forEach((image) => {
                            if(!imagesArray.includes(image.split('/uploads/'+oldProject.slug+'/')[1])) {
                                const dir = path.join(__dirname, '../../../public/' + image);
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
                    const dir = path.join(__dirname, '../../../public/uploads/' + req.body.slug);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    } 
                    const oldDir = path.join(__dirname, '../../../public/uploads/' + oldProject.slug);
                    if (fs.existsSync(oldDir)) {
                        if (oldProject.slug !== req.body.slug) {
                            fs.rename(path.join(__dirname, '../../../public/uploads/' + oldProject.slug), path.join(__dirname, '../../../public/uploads/' + req.body.slug), function(err) {
                                if ( err ) console.log('ERROR: ' + err);
                            });
                            resolve()
                        }
                    }
                    resolve()
                }, 1000)
            })
        }
        const project = await Projects.findOne({ slug: req.params.slug });
        if (req.body.slug) project.slug = req.body.slug;
        if (req.body.title) project.title = req.body.title
        if (req.body.client) project.client = req.body.client
        if (req.body.description) project.description = req.body.description
        if (req.body.tools) project.tools = req.body.tools
        if (files) project.photos = (files.length > 0) ? modifyPaths(files) : ''

        try {
            await deletePreviousImages();
            await changeDestination();
            await upload();
            await project.save();
            res.status(201).json(project);
        } catch(e) {
            res.status(404).json({ errors: e.errors })
        }
    }

}

module.exports = new ProjectsController();