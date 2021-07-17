import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  const loadUserAccountRepo = mock<LoadUserAccountRepository>()
  const createFacebookAccountRepo = mock<CreateFacebookAccountRepository>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
  return {
    sut,
    loadFacebookUserApi,
    loadUserAccountRepo,
    createFacebookAccountRepo
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
    const { sut, loadFacebookUserApi } = makeSut()
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserByEmailRepo when LoadFacebookUser return data', async () => {
    const { sut, loadFacebookUserApi, loadUserAccountRepo } = makeSut()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(fbData)
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: fbData.email })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateUserAccountRepo when LoadUserByEmailRepo return undefined', async () => {
    const { sut, loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo } = makeSut()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(fbData)
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith(fbData)
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
