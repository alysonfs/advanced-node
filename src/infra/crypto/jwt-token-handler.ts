import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

type GenerateParams = TokenGenerator.Params
type GenerateResult = TokenGenerator.Result
type ValidateParams = TokenValidator.Params
type ValidateResult = TokenValidator.Result

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) { }

  async generate ({ key, expirationInMs }: GenerateParams): Promise<GenerateResult> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }

  async validate ({ token }: ValidateParams): Promise<ValidateResult> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
