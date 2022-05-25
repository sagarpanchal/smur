const fse = require('fs-extra')

const jwt = require('utils/jwt')

const test_rsaPrivatePath = `${__dirname}/test_jwt_rsa.key`
const test_rsaPublicPath = `${__dirname}/test_jwt_rsa.key.pub`

describe('JWT Utils', () => {
  const object = { uid: 'uid', sid: 'sid' }
  let token

  test('should find rsa private key', async () => {
    const fileExists = await fse.exists(jwt.rsaPrivatePath)
    expect(fileExists).toBe(true)
  })

  test('should find rsa public key', async () => {
    const fileExists = await fse.exists(jwt.rsaPublicPath)
    expect(fileExists).toBe(true)
  })

  test('should generate jwt', async () => {
    const secret = await fse.readFile(test_rsaPrivatePath)
    token = await jwt.generate(object, { secret })
    expect(typeof token === 'string').toBe(true)
  })

  test('should verify jwt', async () => {
    const secret = await fse.readFile(test_rsaPublicPath)
    const verified = await jwt.verify(token, { secret })
    expect(verified.uid).toBe(object.uid)
    expect(verified.sid).toBe(object.sid)
  })
})
