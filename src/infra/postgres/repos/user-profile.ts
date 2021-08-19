import { SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ userId, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = await getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(userId) }, { pictureUrl, initials })
  }
}
