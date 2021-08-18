import { UUIDGenerator } from '@/domain/contracts/gateways'
import { mocked } from 'ts-jest/utils'

import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

describe('UUIDHandler', () => {
  it('Should call uuid.v4', async () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should return correct uuid', async () => {
    mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
