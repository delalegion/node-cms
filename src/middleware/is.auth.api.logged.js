const Project = require('../db/models/projects');

module.exports = async function (req, res, next) {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      res.status(403).json({ message: "Authorization failed." });
   }
   const project = await Project.findOne({ apiToken: token })
   if (!project) {
      res.status(403).json({ message: "Authorization failed." });
   }
   req.project = project;
   next();
}