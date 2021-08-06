import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'

import { sign, verify } from 'jsonwebtoken'

type GenerateParams = TokenGenerator.Params
type GenerateResult = TokenGenerator.Result
type ValidateParams = TokenValidator.Params
// type ValidateResult = TokenValidator.Result

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) { }

  async generateToken ({ key, expirationInMs }: GenerateParams): Promise<GenerateResult> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }

  async validateToken ({ token }: ValidateParams): Promise<void> {
    verify(token, this.secret)
  }
}
