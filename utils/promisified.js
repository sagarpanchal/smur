const fs = require('fs')
const { promisify } = require('util')

exports.pfs = {
  unlink: promisify(fs.unlink),
  rename: promisify(fs.rename),
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  appendFile: promisify(fs.appendFile),
}
