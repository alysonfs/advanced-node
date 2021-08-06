import { forbiddenError, HttpResponse } from '@/application/helpers'
import { ForbiddenError } from '@/application/errors'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbiddenError()
  }
}

describe('AuthenticationMiddleware', () => {
  beforeEach
  it('Should return 403 if authorization if empty', async () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization if null', async () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization if undefined', async () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
