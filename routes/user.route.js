const router = require('express').Router()
const authRoutes = require('./user/auth.route')

router.use('/auth', authRoutes)

module.exports = router
