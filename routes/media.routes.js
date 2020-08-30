const router = require('express').Router()
const MediaController = require('controllers/media.controller')
const AuthMiddleware = require('middleware/auth.middleware/auth.middleware')

// upload a file
router.post('/file', AuthMiddleware, MediaController.saveFile)

// upload an image
router.post('/image', AuthMiddleware, MediaController.saveImage)

// download any uploaded object
router.get('/:key(*)', MediaController.getAny)

module.exports = router
