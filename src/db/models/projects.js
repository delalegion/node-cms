const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const projectsSchema = new Schema(
    {
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            minlength: [4, 'errors.projects.slug.minLength'],
            required: [true, 'errors.projects.slug.required']
        },
        title: {
            type: String,
            lowercase: true,
            minlength: [6, 'errors.projects.slug.minLength'],
            maxLength: [30, 'errors.projects.nameAndSurname.maxLength'],
            required: [true, 'errors.projects.slug.required']
        },
        client: {
            type: String,
            trim: true,
            minlength: [4, 'errors.projects.nameAndSurname.minLength'],
            maxLength: [30, 'errors.projects.nameAndSurname.maxLength'],
            required: [true, "errors.projects.nameAndSurname.required"]
        },
        description: {
            type: String,
            trim: true,
            minlength: [12, 'errors.projects.nameAndSurname.minLength'],
            maxLength: [300, 'errors.projects.nameAndSurname.maxLength'],
            required: [true, "errors.projects.nameAndSurname.required"]
        },
        tools: {
            type: String,
            minlength: [6, 'errors.projects.slug.minLength']
        }
    }
)

projectsSchema.plugin(uniqueValidator, { message: 'errors.projects.unique' });

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects;