import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(async () => {
    sut = new UserProfile('any_id')
  })

  test('Slould create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({ userId: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })

  test('Slould create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({ userId: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })

  test('Slould create initials if first letter of first and last names', () => {
    sut.setPicture({ name: 'alyson Felipe de souza' })

    expect(sut).toEqual({ userId: 'any_id', pictureUrl: undefined, initials: 'AS' })
  })

  test('Slould create initials with first letter', () => {
    sut.setPicture({ name: 'a' })

    expect(sut).toEqual({ userId: 'any_id', pictureUrl: undefined, initials: 'A' })
  })

  test('Slould create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ })

    expect(sut).toEqual({ userId: 'any_id', pictureUrl: undefined, initials: undefined })
  })
})
