const path = require('path')

const config = require('config')
const debug = require('debug')('app:utils:transport')
const fse = require('fs-extra')
const mkdirp = require('make-dir')
const moment = require('moment')
const Transport = require('winston-transport')

const getFileName = (date = moment()) => {
  // TODO: separate log file for each instance (for production)
  const file = `${date.format('YYYY-MM-DD')}.log`
  const dir = file.split('-').splice(0, 2)
  return `./.logs/${config.get('env')}/${dir[0]}-${dir[1]}/${file}`
}

class JsonTransport extends Transport {
  constructor() {
    super()
    this.filename = null
    this.nextFilename = null
    this.init()
  }

  init() {
    this.filename = this.filename !== this.nextFilename ? this.nextFilename : getFileName()
    this.nextFilename = getFileName(moment().add(1, 'days'))
  }

  async writeLog(info) {
    if (this.filename === this.nextFilename) await this.init()
    info.timestamp = {
      ISO: moment().toISOString(),
      Locale: moment().format('YYYY-MM-DD hh:mm:ss A'),
    }
    if (info?.stack?.constructor?.name === 'String') info.stack = info.stack.toString().split('\n    ')
    const line = `${JSON.stringify(info)}\n`

    try {
      if (!fse.existsSync(this.filename, 'utf8')) {
        await mkdirp(path.parse(this.filename).dir)
        await fse.writeFile(this.filename, line, 'utf8')
      } else {
        await fse.appendFile(this.filename, line, 'utf8')
      }
    } catch (error) {
      debug(error)
    }
  }

  async log(info, next) {
    await this.writeLog(info)
    setImmediate(() => this.emit('logged', info))
    next()
  }
}

exports.getFileName = getFileName
exports.JsonTransport = JsonTransport
