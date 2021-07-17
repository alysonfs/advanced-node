import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly LoadUserAccountRepo: LoadUserAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Paramns): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      await this.LoadUserAccountRepo.load({ email: fbData.email })
    }
    return new AuthenticationError()
  }
}
