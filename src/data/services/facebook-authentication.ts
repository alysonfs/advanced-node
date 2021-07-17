import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Paramns): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const userExists = await this.userAccountRepo.load({ email: fbData.email })
      if (userExists === undefined) {
        await this.userAccountRepo.createFromFacebook(fbData)
      }
    }
    return new AuthenticationError()
  }
}
