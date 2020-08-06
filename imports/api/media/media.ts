export interface MediaModel {
  _id?: string
  publicId: string
  createdAt: Date
  postId: string
}

const Media = new Mongo.Collection<MediaModel>('media');
export default Media