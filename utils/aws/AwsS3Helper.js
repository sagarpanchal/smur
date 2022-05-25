const aws = require('aws-sdk')
const config = require('config')
const debug = require('debug')('app:utils:aws:s3-utils')

const asyncHandler = require('utils/factories/asyncError')

aws.config.update(config.get('aws.config'))

/**
 * Common Functions to work with S3
 */
class AwsS3Helper {
  constructor() {
    this.s3 = new aws.S3()
    this.bucket = config.get('aws.buckets.default')
  }

  /**
   * Save  Object
   * @param {String} key    s3 Object key
   * @param {Buffer} buffer optional acl
   * @param {Object} meta   metadata
   * @param {String} acl    optional acl
   */
  async upload(key, buffer, meta, acl = 'public-read') {
    debug('save'), debug({ key })
    return this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        ACL: acl,
        Body: buffer,
        Metadata: meta,
      })
      .promise()
  }

  /**
   * Read Stored Object
   * @param {String} key s3 Object key
   */
  async get(key) {
    debug('read'), debug({ key })
    return this.s3
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise()
  }

  /**
   * Delete Stored Object
   * @param {String} key s3 Object key
   */
  delete(key) {
    debug('delete'), debug({ key })
    return this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise()
  }

  /**
   * Move Stored Object to different path
   * @param {String} moveFrom s3 Object key
   * @param {String} moveTo   s3 Object key
   * @param {String} acl      optional acl
   */
  async move(moveFrom, moveTo, acl = 'public-read') {
    debug('move'), debug({ moveFrom, moveTo })
    const response = await this.s3
      .copyObject({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${moveFrom}`,
        Key: moveTo,
        ACL: acl,
      })
      .promise()

    asyncHandler(() => this.delete(moveFrom))
    return response
  }
}

module.exports = new AwsS3Helper()
