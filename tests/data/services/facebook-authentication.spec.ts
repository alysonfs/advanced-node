import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { FacebookAccount } from '@/domain/models'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  const token = 'any_token'

  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(fbData)
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: fbData.email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
