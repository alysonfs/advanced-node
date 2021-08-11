import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(async () => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Alyson Felipe Souza' })
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(async () => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('Should call UploadFile with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call UploadFile when file undefined', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('Should call SaveUserPicture with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AS' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when letters is lower case', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'alyson Felipe souza' })

    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AS' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when name with first name only', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'alyson' })

    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AL' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when name with one letter only', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'a' })

    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'A' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserPicture with correct input when name with one letter only', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: undefined })

    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call LoadUserProfile with correct input', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ userId: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should not call LoadUserProfile if file exists', async () => {
    await sut({ userId: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
