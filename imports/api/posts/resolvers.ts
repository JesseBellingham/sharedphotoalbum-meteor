import Posts from "./posts"
import Feeds from "../feeds/feeds"
import Comments from "../comments/comments"
import Media from "../media/media"
import { media } from "../media/server/methods"
import { callWithPromise } from "../../../utils/method-utilities"
import { notifications } from "../notifications/server/methods"

export default {
    Post: {
        poster: (post: { userId: string }) => Meteor.users.findOne({ _id: post.userId }),
        comments: (post: { _id: string }) => Comments.find({ postId: post._id }).fetch(),
        media: (post: { _id: string }) => Media.find({ postId: post._id }).fetch()
    },
    Mutation: {
        async createPost(_: any, { text, feedId, files }: any, context: any) {
            const user = await context.user()
            const id = Posts.insert({
                text,
                userId: user._id,
                createdAt: new Date(),
                comments: [],
                media: [],
                feedId
            })

            try {
                await callWithPromise(media.createMedia, id, feedId, files)
                Feeds.update(feedId, {
                    $push: { posts: id }
                })
            }
            catch (error) {
                Posts.remove({ _id: id })
            }
            await callWithPromise(notifications.sendNotification)
            return Posts.findOne(id)
        },
    }
}