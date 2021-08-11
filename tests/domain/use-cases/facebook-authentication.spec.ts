import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { AccessToken, FacebookAccount } from '@/domain/entities'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account')

describe('Use case FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUser>
  let token: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>
  let sut: FacebookAuthentication
  let tokenGenerated: string
  let fbData: any

  beforeAll(() => {
    tokenGenerated = 'any_token'
    fbData = {
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    }
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(fbData)
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    token = mock()
    token.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepo,
      token)
  })

  it('Should call LoadFacebookUser with correct params', async () => {
    await sut({ token: tokenGenerated })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: tokenGenerated })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should throw AuthenticationError when LoadFacebookUser return undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token: tokenGenerated })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUser return data', async () => {
    await sut({ token: tokenGenerated })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: fbData.email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccount with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut({ token: tokenGenerated })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct params', async () => {
    await sut({ token: tokenGenerated })

    expect(token.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  it('Should return a AccessToken on success', async () => {
    const authResult = await sut({ token: tokenGenerated })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  it('Should rethrow if LoadFacebookUser thorws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut({ token: tokenGenerated })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow if LoadUserAccount thorws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ token: tokenGenerated })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if SaveWithFacebook thorws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut({ token: tokenGenerated })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator thorws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token: tokenGenerated })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
