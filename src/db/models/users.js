const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Wartość name jest wymagana"]
        },
        email: {
            type: String,
            required: [true, "Email jest wymagany"],
            validate: [(value => {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            }), "Wprowadź prawidłowy email"],
        },
        slug: {
            type: String,
            lowercase: true,
            unique: [true, "Podana wartość istnieje juz w bazie danych."],
            required: [true, "Wartość slug jest wymagania"]
        }
    },
    {
        timestamps: true
    }
)

const Users = mongoose.model('users', usersSchema)

module.exports = Users;