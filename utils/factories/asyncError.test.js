const asyncHandler = require('./asyncError')

describe('Async Error Handler', () => {
  const asyncHandlerOptions = { report: false }

  test('should return promise resolution', async () => {
    const response = await asyncHandler(() => new Promise((r) => r(true)), asyncHandlerOptions)
    expect(response).toBe(true)
  })

  test('should handle promise rejection', async () => {
    const response = await asyncHandler(() => new Promise((r, j) => j(new Error('MockException'))), asyncHandlerOptions)
    expect(response).toBe(false)
  })
})
