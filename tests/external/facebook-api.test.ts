import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api integration tests', () => {
  const tokenStub = 'EABS86wxyA5MBAGab8uoORNLy50cavnpjQCBy3OVqbtyoulAFVxPkYZAKA4cKnsYjggE1YITqBMvLKni697FA1sHmIVWAgJt2ZC5CSUoBQZBQ60M16usL8CcT1g1rBWZASGpee5f0z7ZCEbLCiWSTFqjZBZAMp1B0raTyoQGt3ZC9mlNjgKyzRsrv9mJZCZBNZCxy3crOAZC8nRyBqEtSMo8ZBhbwY'

  it('Should return a Facebook User if Token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: tokenStub })

    expect(fbUser).toEqual({
      facebookId: '103379235380199',
      email: 'moldato_bwazpjv_teste@tfbnw.net',
      name: 'Moldato Teste'
    })
  })

  it('Should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
