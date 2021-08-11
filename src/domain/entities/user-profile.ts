export class UserProfile {
  initials?: string
  pictureUrl?: string

  constructor (readonly userId: string) { }

  setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined) {
      name = name.trim()
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`
      } else {
        this.initials = name.substr(0, 2).toUpperCase()
      }
    }
  }
}
