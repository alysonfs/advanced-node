export interface SaveUserPicture {
  savePicture: (input: SaveUserPicture.Input) => Promise<void>
}

export namespace SaveUserPicture {
  export type Input = { userId: string, pictureUrl?: string, initials?: string }
}

export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<LoadUserProfile.Output>
}

export namespace LoadUserProfile {
  export type Input = { userId: string }
  export type Output = { name?: string} | undefined
}
