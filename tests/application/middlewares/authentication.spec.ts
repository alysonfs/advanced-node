import { ForbiddenError } from '@/application/errors'
import { forbiddenError, HttpResponse } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { Authorize } from '@/domain/use-cases'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  constructor (
    private readonly authorize: Authorize
  ) { }

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    if (error !== undefined) return forbiddenError()
    await this.authorize({ token: authorization })
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorization: string
  let authorize: jest.Mock

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
  })

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
  })

  it('Should return 403 if authorization if empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization if null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization if undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should call Authorize with correct input', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })
})
