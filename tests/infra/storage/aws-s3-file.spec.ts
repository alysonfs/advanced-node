import { config } from 'aws-sdk'

export class AWSS3FileStorage {
  constructor (
    private readonly accessKey: string,
    private readonly secret: string
  ) {
    config.update({
      credentials: {
        accessKeyId: '',
        secretAccessKey: ''
      }
    })
  }
}

jest.mock('aws-sdk')

describe('AWSS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let sut: AWSS3FileStorage

  beforeAll(() => {
    accessKey = 'any_access_keey'
    secret = 'any_secret'
  })

  beforeEach(() => {
    sut = new AWSS3FileStorage(accessKey, secret)
  })

  it('Should config aws credentials on creation', async () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: '',
        secretAccessKey: ''
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
