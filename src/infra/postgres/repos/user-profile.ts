import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ userId, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = await getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(userId) }, { pictureUrl, initials })
  }

  async load ({ userId }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: parseInt(userId) })
    if (pgUser !== undefined) return { name: pgUser.name }
  }
}
