const fse = require('fs-extra')
const jwt = require('utils/jwt')

describe('JWT Utils', () => {
  const object = { uid: 'uid', sid: 'sid' }
  let token

  test('should find rsa private key', () => {
    expect(fse.existsSync(jwt.rsaPrivatePath)).toBe(true)
  })

  test('should find rsa public key', () => {
    expect(fse.existsSync(jwt.rsaPublicPath)).toBe(true)
  })

  test('should generate jwt', async () => {
    token = await jwt.generate(object)
    expect(typeof token === 'string').toBe(true)
  })

  test('should verify jwt', async () => {
    const verified = await jwt.verify(token)
    expect(verified.uid).toBe(object.uid)
    expect(verified.sid).toBe(object.sid)
  })
})
