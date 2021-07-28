import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/services'

export const makeFacebookController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationService())
}
