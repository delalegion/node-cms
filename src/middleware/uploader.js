// Multer to upload photos
const multer = require('multer');
const storage = multer.memoryStorage();
const uploadMiddleware = (req,res,next)=>{

  let maxSize = (1*1024*1024).toFixed(2);
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  
  const uploader = multer({ storage: storage, limits: { fileSize: maxSize },
    fileFilter: function(req,file,cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      if (!validExtensions.includes(file.mimetype)) {
        req.fileValidationError = 'goes wrong on the mimetype'; 
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      cb(null, true);
    }
  }).array('photos', 15);

  // Here call the upload middleware of multer
  uploader(req, res, function (err) {
     if (err instanceof multer.MulterError) {
       // A Multer error occurred when uploading.
       const err = new Error('Multer error');
       next(err)
       } else if (err) {
       // An unknown error occurred when uploading.
       const err = new Error('Server Error')
       next(err)
     }
    // Everything went fine.
    next()
  })
}

module.exports = uploadMiddleware;