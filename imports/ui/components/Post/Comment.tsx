import React, { ReactElement } from 'react'
import { CommentModel } from '../../../api/comments/comments'

function Comment(props: CommentModel): ReactElement {
    return (
        <div className="d-flex flex-row">
            <p className="comment">
                Likes:{props.likes}
                <br />
                {props.text}
            </p>
        </div>
    )
}

export default Comment
