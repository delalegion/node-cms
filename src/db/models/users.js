const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const usersSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: [4, 'errors.users.nameAndSurname.minLength'],
            maxLength: [30, 'errors.users.nameAndSurname.maxLength'],
            required: [true, "errors.users.nameAndSurname.required"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'errors.users.email.required'],
            lowercase: true,
            unique: true,
            validate: [(value => {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            }), 'errors.users.email.validate'],
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            minlength: [4, 'errors.users.slug.minLength'],
            required: [true, 'errors.users.slug.required']
        },
        password: {
            type: String,
            required: [true, "errors.users.password.required"],
            validate: [(value => {
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/;
                return passwordRegex.test(value);
            }), "errors.users.password.validate"],
            minlength: [7, "errors.users.password.minLength"]
        }
    },
    {
        timestamps: true
    }
)

// usersSchema.index({
//     email: 1,
//     slug: 1,
//   }, {
//     unique: true,
// });

// usersSchema.post('save', function(error, doc, next) {
//     console.log(error)
//     next(error);
// });


// Salt and hash the password
usersSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('name')) {
        user.name = user.name.replace(/ +(?= )/g,'')
    }
    if (!user.isModified('slug')) {
        return next();
    }
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

usersSchema.plugin(uniqueValidator, { message: 'errors.users.unique' });

const Users = mongoose.model('users', usersSchema)

module.exports = Users;