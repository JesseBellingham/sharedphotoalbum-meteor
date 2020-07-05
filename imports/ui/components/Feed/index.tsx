import NewPost from './NewPost'
import { Posts } from '/imports/api/posts'
import React, { useEffect } from 'react'
import Post from '../Post'
import { useTracker } from 'meteor/react-meteor-data'
import { useParams } from 'react-router-dom'
import { Feeds } from '/imports/api/feeds'
import { Col, Row } from 'react-bootstrap'
import FeedList from './FeedList/FeedList'

function Feed() {
    let { feedId } = useParams()
    const [selectedFeed, setSelectedFeed] = React.useState(feedId)
    if (feedId && selectedFeed !== feedId) {
        setSelectedFeed(feedId)
    }

    const onFeedSelected = (selectedFeedId: string) => {
        setSelectedFeed(selectedFeedId)
    }

    const feed = useTracker(() => {
        return Feeds.findOne({_id: selectedFeed})
    })

    const posts = useTracker(() => {
        return Posts.find({feedId: selectedFeed}, {sort: { createdAt: -1}}).fetch()
    })
    
    return (
        <div className="feed-container">
            <Row>
                <Col md={{ span: 2 }}>
                    <FeedList onFeedSelected={onFeedSelected} selectedFeed={selectedFeed} />
                </Col>
                <Col md={{ span: 6 }}>
                    <h1>{feed?.name}</h1>                    
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 6, offset: 2 }}>
                    <NewPost feedId={selectedFeed} />
                </Col>
            </Row>
            {posts.map((post) => (
            <Row>
                <Col md={{ span: 6, offset: 2 }}>
                    <Post post={post} key={post._id} />
                </Col>
            </Row>
            ))
            }            
        </div>
    )
}

export default Feed

