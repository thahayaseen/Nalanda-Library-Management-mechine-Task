export interface IBook {
  _id: string
  title: string
  author: string
  ISBN: string
  publicationDate?: Date
  genre?: string
  copies: number
  listed: boolean
  createdAt: Date
}
