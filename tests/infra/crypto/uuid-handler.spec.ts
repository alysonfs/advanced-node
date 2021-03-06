import { UUIDHandler } from '@/infra/crypto'

import { mocked } from 'ts-jest/utils'
import { v4 } from 'uuid'

jest.mock('uuid')

describe('UUIDHandler', () => {
  let sut: UUIDHandler

  beforeAll(() => {
    sut = new UUIDHandler()
  })

  beforeEach(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })

  it('Should call uuid.v4', async () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should return correct uuid', async () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
