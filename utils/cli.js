const chalk = require('chalk')
const _times = require('lodash/times')

exports.clear = () => process.stdout.write('\u001b[2J\u001b[0;0H')

exports.breakLine = (n = 1) => _times(n).forEach((n) => (n, process.stdout.write('\n')))

exports.messages = {
  nodemonRestart: (restartCount) =>
    `${chalk.green('Restarting due to changes')} ${chalk.cyan(restartCount)}`,

  databaseDisconnected: (databaseUrl) =>
    `${chalk.yellow('Database disconnected')} ${chalk.cyan(databaseUrl)}`,
  databaseConnected: (databaseUrl) =>
    `${chalk.green('Database connected')} ${chalk.cyan(databaseUrl)}`,

  serverClosed: (port) => `${chalk.yellow('HTTP server closed')} ${chalk.cyan(port)}`,
  serverListening: (port) => `${chalk.green('HTTP server listening')} ${chalk.cyan(port)}`,
}
