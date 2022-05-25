const debug = require('debug')('app:development')
const nodemon = require('nodemon')

const cli = require('utils/cli')

nodemon({
  exec: 'npm run lint && node',
  script: 'index.js',
  ext: 'js json pug ejs html env',
  ignore: ['public', '*.test.js'],
})

nodemon.on('start', () => {
  if (process.env.INIT !== '0') {
    cli.breakLine()
    debug(cli.messages.nodemonRestart(process.env.INIT))
  }
  process.env.INIT = parseInt(process.env.INIT) + 1
})
