import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture // SETUP é como se fosse o contrutor de uma classe
type Input = { userId: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ userId, file }) => {
  const key = crypto.uuid({ key: userId })
  const data: { pictureUrl?: string, name?: string } = {}
  if (file !== undefined) {
    data.pictureUrl = await fileStorage.upload({ file, key })
  } else {
    data.name = (await userProfileRepo.load({ userId })).name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  await userProfileRepo.savePicture(userProfile)
  return {
    pictureUrl: userProfile.pictureUrl,
    initials: userProfile.initials
  }
}
