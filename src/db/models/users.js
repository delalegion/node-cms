const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const usersSchema = new Schema(
    {
        name: {
            type: String,
            minlength: [4, "Minimalna liczba znaków to 4..."],
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
            minlength: [4, "Minimalna liczba znaków to 4..."],
            unique: [true, "Podana wartość istnieje juz w bazie danych."],
            required: [true, "Wartość slug jest wymagania"]
        },
        password: {
            type: String,
            required: true,
            minlength: [5, "Hasło powinno posiadać minimum 5 znaków"]
        }
    },
    {
        timestamps: true
    }
)

// Salt and hash the password
usersSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        next();
    }
})

usersSchema.methods = {
    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

const Users = mongoose.model('users', usersSchema)

module.exports = Users;