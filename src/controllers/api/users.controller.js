const Users = require("../../db/models/users");

class UserController {
    async loginUser(req, res) {
        try {
            const user = await Users.findOne({ email: req.body.email })
            if (!user) {
                throw new Error("user not found")
            }
            const isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
                throw new Error("password not valid")
            }
            
            res.status(200).json({ apiToken: user.apiToken });
        }
        catch (e) {
            res.sendStatus(401);
        }
    }
}

module.exports = new UserController();