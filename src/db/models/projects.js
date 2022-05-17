const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsSchema = new Schema(
    {
        slug: {
            type: String,
            required: [true, 'Pole slug jest wymagane..'],
            minLength: [3, 'Minimalna liczba znaków to 3...'],
            validate: (value => {
                if (value === "slug") {
                    throw new Error("Nazwa slug jest zakazana")
                }
            }),
            trim: true,
            lowercase: true,
        },
        client: {
            type: String,
            required: [true, "Pole klient jest wymagane.."],
        },
        description: {
            type: String,
            required: [true, "Pole opis jest wymagane.."],
        },
        age: {
            type: Number
        }
    }
)

const Projects = mongoose.model('projects', projectsSchema)

module.exports = Projects;