const router = require('express').Router()
const httpErrors = require('utils/httpErrors')
const authRoutes = require('./auth.routes')
const mediaRoutes = require('./media.routes')
const docRoutes = require('./docs.routes')

router.use('/docs', docRoutes)
router.use('/auth', authRoutes)
router.use('/media', mediaRoutes)

router.use((req, res) => httpErrors.notFound(res))

module.exports = router
