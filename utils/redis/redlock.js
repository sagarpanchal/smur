const debug = require('debug')('app:utils:redis:Lock')
const IORedisLock = require('ioredis-lock')
const asyncHandler = require('utils/factories/asyncError')
const chalk = debug.enabled ? require('chalk') : undefined

class Lock {
  /**
   * @param {RedisClient} redisClient Redis Client
   * @param {LockOptions} options
   */
  constructor(redisClient, options = {}) {
    this.redis = redisClient
    this.options = { timeout: 5000, retries: 625, delay: 8, ...options }
  }

  /**
   * Lock redis key
   * @param   {string} key key to aquire lock on
   * @returns {Lock}   ioredis lock
   */
  async aquire(key) {
    const lock = IORedisLock.createLock(this.redis, this.options)
    await asyncHandler(() => lock.acquire(`L-U-${key}`))
    this.debug(lock._locked, lock._key)
    return lock
  }

  /**
   * Unlock redis key
   * @param   {Lock}    lock lock to release
   * @returns {Boolean} lock released
   */
  async release(lock) {
    if (!lock._locked) return false
    const key = lock._key
    await asyncHandler(() => lock.release())
    this.debug(lock._locked, key)
    return true
  }

  debug(locked, key) {
    if (!debug.enabled) return
    const sym = locked ? '▶' : '◀'
    const color = locked ? chalk.red : chalk.green
    debug(color(`${sym} ${key}`))
  }
}

module.exports = Lock
