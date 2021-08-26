import { InvalidMimeTypeError } from '@/application/errors'

type Extension = 'png' | 'jpg'

export class AllowedMimeType {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) { }

  validate (): Error | undefined {
    let isValid = false
    if (this.isPng()) isValid = true
    if (this.isJpg()) isValid = true
    if (!isValid) return new InvalidMimeTypeError(this.allowed)
  }

  private isPng (): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg (): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
  }
}

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
