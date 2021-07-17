import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  perform: (param: FacebookAuthentication.Paramns) => Promise<FacebookAuthentication.Result>
}
// Aplicando param patners
export namespace FacebookAuthentication {
  export type Paramns = {
    token: string
  }
  export type Result = AccessToken | AuthenticationError
}
