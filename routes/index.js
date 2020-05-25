const router = require('express').Router()
const userRoutes = require('./user.route')
const commonRoutes = require('./common.route')

router.use('/', commonRoutes)
router.use('/', userRoutes)

module.exports = router
