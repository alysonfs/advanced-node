import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

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
