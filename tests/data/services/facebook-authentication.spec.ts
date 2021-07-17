import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  const userAccountRepo = mock<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>()
  const sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  return {
    sut,
    facebookApi,
    userAccountRepo
  }
}

describe('FacebookAuthenticationService', () => {
  const token = 'any_token'
  const fbData = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email'
  }

  it('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, facebookApi } = makeSut()
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    const { sut, facebookApi } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserByEmailRepo when LoadFacebookUser return data', async () => {
    const { sut, facebookApi, userAccountRepo } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(fbData)
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: fbData.email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateFacebookAccountRepo when LoadUserByEmailRepo return undefined', async () => {
    const { sut, facebookApi, userAccountRepo } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(fbData)
    userAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(fbData)
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call UpdateFacebookAccountRepo when LoadUserByEmailRepo return data', async () => {
    const { sut, facebookApi, userAccountRepo } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(fbData)
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
