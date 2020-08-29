import React from 'react'
import { Button, Row, Col, Container } from 'react-bootstrap'
import { Meteor } from 'meteor/meteor'
import CollapseMenu from '../CollapseMenu'
import { GET_USER } from '../../../../api/users/methods'
import { useQuery } from 'react-apollo'

function CollapseContainer({ setLoggedIn, children }: any) {
    const [show, setShow] = React.useState(false)
    const { data, loading } = useQuery(GET_USER)
    const { name } = data?.getUser || {}

    const logout = () => {
        Meteor.logout()
        setLoggedIn(false)
    }

    return <>
        <div className="header">
            <Container fluid>
                <Row>
                    <Col md={{ span: 1 }} >
                        <Button onClick={() => setShow(!show)}><i className="fas fa-bars fa-2x"></i></Button>
                    </Col>
                    
                    <Col md={{ span: 2, offset: 8 }} >
                        {loading ? null : <span>Logged in as {name}</span>}
                    </Col>
                    <Col md={{span: 1}}>
                        <Button variant="primary" onClick={logout} >Logout</Button>
                    </Col>
                </Row>
            </Container>
        </div>
        <CollapseMenu children={children} show={show} />
    </>
}

export default CollapseContainer