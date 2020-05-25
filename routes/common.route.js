const router = require('express').Router()
const mediaRoutes = require('./common/media.route')
const docRoutes = require('./common/docs.route')

router.use('/media', mediaRoutes)
router.use('/docs', docRoutes)

module.exports = router
