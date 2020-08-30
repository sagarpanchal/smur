// const debug = require("debug")("app:multer:storage");
const multer = require('multer')
const multerS3 = require('multer-s3')
const mime = require('mime')
const uuid = require('uuid').v4
const s3Utils = require('utils/aws/AwsS3Helper')

/** Get accurate file extension */
const getExtension = (file) => {
  const originalExtension = file.originalname.split('.').pop()
  return originalExtension !== 'blob' ? originalExtension : mime.getExtension(file.mimetype)
}

/** Store File Objects on disk */
exports.diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './.uploads/temp'),
  filename: (req, file, cb) => cb(null, `${uuid()}.${getExtension(file)}`),
})

/** Store File Objects on AWS S3 Bucket */
exports.s3Storage = multerS3({
  s3: s3Utils.s3,
  bucket: s3Utils.bucket,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    const { originalname, encoding, mimetype } = file
    return cb(null, { originalname, encoding, mimetype })
  },
  key: (req, file, cb) => cb(null, `temp/${uuid()}.${getExtension(file)}`),
})
