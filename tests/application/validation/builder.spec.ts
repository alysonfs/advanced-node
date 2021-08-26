import { ValidationBuilder, RequiredString, RequiredBuffer, Required, MaxFileSize, AllowedMimeType } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('Should return RequiredString to string validation', () => {
    const validators = ValidationBuilder.of({ value: 'any_value' }).required().build()

    expect(validators).toEqual([
      new RequiredString('any_value')
    ])
  })

  it('Should return RequiredBuffer to buffer validation', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: buffer }).required().build()

    expect(validators).toEqual([
      new RequiredBuffer(buffer)
    ])
  })

  it('Should return Required to object validation', () => {
    const validators = ValidationBuilder.of({ value: { any: 'any' } }).required().build()

    expect(validators).toEqual([
      new Required({ any: 'any' })
    ])
  })

  it('Should return Required and RequiredBuffer to object with buffer validation', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer } }).required().build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)
    ])
  })

  it('Should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new MaxFileSize(6, buffer)
    ])
  })

  it('Should return correct image validators', () => {
    const validators = ValidationBuilder.of({ value: { mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeType(['png'], 'image/png')
    ])
  })

  it('Should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeType(['png'], 'image/png'),
      new MaxFileSize(6, buffer)
    ])
  })
})
