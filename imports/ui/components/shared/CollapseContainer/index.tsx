import React from 'react'
import { Button, Row, Col, Container } from 'react-bootstrap'
import { Meteor } from 'meteor/meteor'
import CollapseMenu, { collapseMenuEventEmitter } from '../CollapseMenu'
import { GET_USER } from '../../../../api/users/methods'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'

function CollapseContainer({ setLoggedIn, children }: any) {
    const history = useHistory()
    const { data, loading } = useQuery(GET_USER)
    const { name } = data?.getUser || {}

    const toggleMenu = () => {
        collapseMenuEventEmitter.emit('toggle')
    }

    const logout = () => {
        Meteor.logout()
        history.push('/')
        setLoggedIn(false)
    }

    return <>
        <div className="header">
            <Container fluid>
                <Row>
                    <Col md={{ span: 1 }} >
                        <Button onClick={() => toggleMenu()}><i className="fas fa-bars fa-2x"></i></Button>
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
        <CollapseMenu children={children} />
    </>
}

export default CollapseContainer