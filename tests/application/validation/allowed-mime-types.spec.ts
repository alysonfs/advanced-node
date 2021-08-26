import { AllowedMimeType } from '@/application/validation'
import { InvalidMimeTypeError } from '@/application/errors'

describe('AllowedMimeType', () => {
  test('Should return invalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeType(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  test('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeType(['jpg'], 'image/jpg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeType(['jpg'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
