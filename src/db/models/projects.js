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
            required: [true, 'errors.projects.slug.required'],
            validate: [(value => {
                const slugRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
                const slugRegexTest = slugRegex.test(value);
                const slugSpaceRegexTest = /\s/g.test(value);
                if (slugSpaceRegexTest || slugRegexTest) {
                    return false;
                }
            }), 'errors.projects.slug.validate']
        },
        title: {
            type: String,
            lowercase: true,
            minlength: [6, 'errors.projects.title.minLength'],
            maxLength: [30, 'errors.projects.title.maxLength'],
            required: [true, 'errors.projects.title.required']
        },
        client: {
            type: String,
            trim: true,
            minlength: [4, 'errors.projects.client.minLength'],
            maxLength: [30, 'errors.projects.client.maxLength'],
            required: [true, "errors.projects.client.required"]
        },
        description: {
            type: String,
            trim: true,
            minlength: [12, 'errors.projects.description.minLength'],
            maxLength: [300, 'errors.projects.description.maxLength'],
            required: [true, "errors.projects.description.required"]
        },
        tools: {
            type: String,
            minlength: [6, 'errors.projects.tools.minLength']
        },
        photos: {
            type: String
        }
    }
)

projectsSchema.plugin(uniqueValidator, { message: 'errors.projects.unique' });

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects;