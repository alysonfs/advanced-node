import { AWSS3FileStorage } from '@/infra/storage'

import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')

describe('AWSS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let sut: AWSS3FileStorage

  beforeAll(() => {
    accessKey = 'any_access_keey'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
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

  describe('Upload', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        putObject: putObjectSpy
      })))
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

    it('Should rethrow if putObject trhows', async () => {
      const error = new Error('aws_s3_upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.upload({ key: 'any key', file })

      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('Delete', () => {
    it('Should return imageUrl', async () => {

    })
  })
})
