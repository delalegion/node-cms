const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const randomstring = require('randomstring')

const usersSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: [4, 'errors.users.nameAndSurname.minLength'],
            maxLength: [30, 'errors.users.nameAndSurname.maxLength'],
            required: [true, "errors.users.nameAndSurname.required"]
        },
        slug: {
            type: String,
            lowercase: true,
            minlength: [4, 'errors.users.slug.minLength'],
            required: [true, 'errors.users.slug.required'],
            validate: [(value => {
                // Check for white spaces and special characters // Not allowed
                const slugRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
                const slugRegexTest = slugRegex.test(value);
                const slugSpaceRegexTest = /\s/g.test(value);
                if (slugSpaceRegexTest || slugRegexTest) {
                    return false;
                }
            }), 'errors.users.slug.validate']
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'errors.users.email.required'],
            lowercase: true,
            validate: [(value => {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            }), 'errors.users.email.validate'],
        },
        password: {
            type: String,
            required: [true, "errors.users.password.required"],
            validate: [(value => {
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/;
                return passwordRegex.test(value);
            }), "errors.users.password.validate"],
            minlength: [7, "errors.users.password.minLength"]
        },
        apiToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// Salt and hash the password
usersSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('name')) {
        user.name = user.name.replace(/ +(?= )/g,'')
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

usersSchema.pre('save', function(next) {
    const user = this;
    if (user.isNew) {
        user.apiToken = randomstring.generate(60)
    }
    next();
})


const Users = mongoose.model('users', usersSchema)

module.exports = Users;