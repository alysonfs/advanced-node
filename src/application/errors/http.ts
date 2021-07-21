export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server faied. Try agani soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
