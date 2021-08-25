import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

export class DeletePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) { }

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ userId })
  }
}

describe('DeletePictureController', () => {
  it('Should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = jest.fn()
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id', file: undefined })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
