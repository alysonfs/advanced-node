export interface TokenGenerator {
  generateToken: (paramns: TokenGenerator.Params) => Promise<void>
}

export namespace TokenGenerator {
  export type Params ={
    key: string
    expirationInMs: number
  }
}
