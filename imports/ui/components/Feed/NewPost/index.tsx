import React from 'react'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'
import ProfilePicture from '../../shared/ProfilePicture'
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import UploadPreview from './UploadPreview';

export interface INewPostProps {
    feedId: string
    refetchFeed: any
}

const CREATE_POST = gql`
    mutation ($text: String!, $feedId: String!, $files: [String]) {
        createPost(text: $text, feedId: $feedId, files: $files) {
            _id
        }
    }
`

function NewPost(props: INewPostProps): JSX.Element {
    const [postText, setPostTest] = React.useState('')
    const [files, setFiles] = React.useState([])
    const [newPostInProgress, setNewPostInProgress] = React.useState(false)
    const { feedId } = props
    
    const [createPost] = useMutation(CREATE_POST)

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setPostTest(event.currentTarget.value)
    }

    const createNewPost = async () => {
        event.preventDefault()
        event.stopPropagation()
        if (postText || files.length > 0) {
            setNewPostInProgress(true)
            await createPost({ variables: { text: postText, feedId, files }})
            setFiles([])
            setPostTest('')
            setNewPostInProgress(false)
        }
    }

    const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter') {
            await createNewPost()
        }
    }

    const onFileAdd = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let uploads = []
        let fileList = Array.from(event.currentTarget.files || [])
        fileList.forEach(file => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                uploads.push(fileReader.result)
                if (uploads.length === fileList.length) {
                    setFiles(uploads)
                }
            }
        })
    }

    return <>
        <Card className="new-post-container mb-2">
            <Card.Body>
                <div className="float-left">
                    <ProfilePicture userId={null} />
                </div>
                {newPostInProgress ?
                    <div className="d-flex justify-content-center">
                        <Spinner className="post-in-progress-spinner" animation="grow" variant="warning" />
                    </div>
                    :
                    <>
                        <div className="mb-3">
                            <Form>
                                <Row>
                                    <Col className="status-input">
                                        <Form.Control
                                            className="status-input-field align-middle"
                                            placeholder="Whats new?"
                                            value={postText}
                                            onKeyDown={onKeyDown}
                                            onChange={handleChange}
                                        />
                                        <a href="#" className="fas fa-play fa-2x status-input-submit align-middle" onClick={createNewPost}></a>
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-center mt-1">
                                    <Col md={{ offset: 1, span: 3 }}>
                                        <Form.File multiple onChange={onFileAdd} custom label="Photos/Videos" />
                                    </Col>
                                    <Col md={{ span: 3 }}>
                                        <Button className="life-event-button" variant="light" disabled>Life Event</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        {files.length > 0 &&
                            <UploadPreview files={files} />
                        }
                    </>
                }
            </Card.Body>
        </Card>
    </>
}

export default NewPost
