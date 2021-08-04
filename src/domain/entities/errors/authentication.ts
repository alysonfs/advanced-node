export class AuthenticationError extends Error {
  constructor () {
    super('Autentication fail')
    this.name = 'AuthenticationError'
  }
}
