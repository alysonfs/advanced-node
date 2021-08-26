import { MaxFileSize } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

describe('MaxFileSize', () => {
  test('Should return MaxFileSizeError if value is invalid', () => {
    const invalidateBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidateBuffer)

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  test('Should return undefined if value is valid less than limit', () => {
    const buffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(5, buffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid on limit', () => {
    const buffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, buffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
