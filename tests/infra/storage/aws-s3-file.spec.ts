import { UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

export class AWSS3FileStorage implements UploadFile {
  constructor (
    accessKey: string,
    secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: '',
        secretAccessKey: ''
      }
    })
  }

  async upload ({ key, file }: UploadFile.Input): Promise<UploadFile.Output> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}

jest.mock('aws-sdk')

describe('AWSS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let file: Buffer
  let sut: AWSS3FileStorage
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    accessKey = 'any_access_keey'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })

  beforeEach(() => {
    sut = new AWSS3FileStorage(accessKey, secret, bucket)
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

  it('Should call putObject with correct input', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return imageUrl', async () => {
    const imageUrl = await sut.upload({ key, file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  it('Should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ key: 'any key', file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })
})
