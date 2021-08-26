import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from './controller'
import { AllowedMimeType, MaxFileSize, Required, RequiredBuffer, Validator } from '@/application/validation'
import { HttpResponse, ok } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { pictureUrl?: string, initials?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  override async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ userId, file: file.buffer })
    return ok(data)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      new Required(file, 'file'),
      new RequiredBuffer(file.buffer, 'file'),
      new AllowedMimeType(['jpg', 'png'], file.mimeType),
      new MaxFileSize(5, file.buffer)]
  }
}
