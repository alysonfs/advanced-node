import { JwtTokenHandler } from '@/infra/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('Infra JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken handle', () => {
    let key: string
    let expirationInMs: number
    let token: string

    beforeAll(() => {
      key = 'any_key'
      expirationInMs = 1000
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('Shoul call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('Shoul return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    it('Should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('validateToken handle', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_token'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('Shoul call sign with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('Shoul return the key used to sign', async () => {
      const generetadKey = await sut.validateToken({ token })

      expect(generetadKey).toBe(key)
    })

    it('Should rethrow if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('Should throw if verify return null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })
  })
})
