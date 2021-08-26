import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredBuffer } from '@/application/validation'

describe('RequiredBuffer', () => {
  it('Should extends Required', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    expect(sut).toBeInstanceOf(Required)
  })

  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })

  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})
