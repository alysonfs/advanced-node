import { InvalidMimeTypeError } from '@/application/errors'

type Extension = 'png' | 'jpg' | 'jpeg'

export class AllowedMimeType {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) { }

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}

describe('AllowedMimeType', () => {
  test('Should return invalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeType(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})
