import { ChangeProfilePicture } from '@/domain/use-cases'
import { badRequest, HttpResponse, ok } from '@/application/helpers'
import { RequiredFieldError, InvalidMimeTypeError, MaxFileSizeError } from '@/application/errors'
import { Controller } from './controller'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { pictureUrl?: string, initials?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg', 'jpg']))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    const data = await this.changeProfilePicture({ userId, file: file.buffer })
    return ok(data)
  }
}
