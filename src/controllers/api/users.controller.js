require('dotenv').config();
const Users = require("../../db/models/users");
const jwt = require("jsonwebtoken");

class UserController {
    async loginUser(req, res) {
        try {
            const user = await Users.findOne({ email: req.body.email })
            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: 120 });
            // const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
            if (!user) {
                throw new Error("user not found")
            }
            const isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
                throw new Error("password not valid")
            }
            res.status(200).json({ accessToken: accessToken });
        }
        catch (e) {
            res.sendStatus(401);
        }
    }
    // async refresh(req, res) {
    //     const refreshToken = req.body.token;
    //     if (!refreshToken) {
    //        res.status(403).json({ message: "Authorization failed." });
    //     }
     
    //     const user = await Users.findOne({ refreshToken: refreshToken })
    //     if (!user) {
    //        res.status(403).json({ message: "Authorization failed." });
    //     }
        
    //     try {
    //        await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    //     } catch(e) {
    //        res.status(403).json({ message: "Authorization failed." });
    //     }
     
    //     const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: 64000 });
    //     res.status(200).json({ accessToken: accessToken });
    // }
}

module.exports = new UserController();