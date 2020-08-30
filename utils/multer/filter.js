exports.imageFilter = (req, file, cb) => cb(null, ['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype))
