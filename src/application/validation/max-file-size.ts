import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSize {
  private readonly maxSizeInByte: number

  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {
    this.maxSizeInByte = this.maxSizeInMb * 1024 * 1024
  }

  validate (): Error | undefined {
    if (this.value.length > this.maxSizeInByte) return new MaxFileSizeError(this.maxSizeInMb)
    return undefined
  }
}
