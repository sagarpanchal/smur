const httpErrors = require('utils/httpErrors')

module.exports =
  (rolesList = []) =>
  (req, res, next) => {
    const rolesUnmatched = rolesList.filter((role) => !req.auth.user.roles.includes(role)).length > 0
    rolesUnmatched ? httpErrors.accessDenied(res) : next()
  }
