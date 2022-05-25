const Debug = require('debug')
const multer = require('multer')

const MulterError = require('middleware/multerError.middleware')
const s3utils = require('utils/aws/AwsS3Helper')
const httpErrors = require('utils/httpErrors')
const { imageFilter } = require('utils/multer/filter')
const { s3Storage } = require('utils/multer/storage')

const files = multer({
  storage: s3Storage,
  limits: { fileSize: 1099511627776 },
})

const images = multer({
  storage: s3Storage,
  fileFilter: imageFilter,
  limits: { fileSize: 26843545600 },
})

const save = async (req, res) =>
  req.file
    ? res.json({
        ...req.file.metadata,
        acl: req.file.acl,
        key: req.file.key,
        location: req.file.location,
        etag: req.file.etag,
      })
    : httpErrors.unsupportedMediaType(res, 'Invalid file format')

const retrieve = async (req, res) => {
  const debug = Debug('app:controllers:media:send')
  debug({ params: req.params })
  try {
    const object = await s3utils.get(req.params.key)
    debug({ object })
    return res.type(object.Metadata.mimetype).send(object.Body)
  } catch (error) {
    return httpErrors.notFound(res, 'File')
  }
}

exports.saveFile = [files.single('file'), MulterError, save]

exports.saveImage = [images.single('image'), MulterError, save]

exports.getAny = retrieve
