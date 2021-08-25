import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, noContent } from '@/application/helpers'

type HttpRequest = { userId: string }

export class DeletePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) { }

  async handle ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ userId })
    return noContent()
  }
}

describe('DeletePictureController', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeletePictureController

  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })

  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id', file: undefined })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('Should returns 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})
