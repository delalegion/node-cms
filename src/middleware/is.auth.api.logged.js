const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
   const token = req.headers.authorization?.split(' ')[1];
   jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Authorization failed from jwt." });
      next();
   })
   if (!token) {
      res.status(403).json({ message: "Authorization failed." });
   }
   next();
}