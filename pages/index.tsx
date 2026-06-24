import type { NextPage } from 'next'
import React, { useState } from 'react'
import Router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { postAuthLogin } from '../store/login/actions'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import ConstantsImagePath from '../assets/svgimages'
import NonAuthLayout from '../components/Layout/NonAuthLayout'
import authlogin from '../assets/images/auth/login.png'
import Image from 'next/image'
import { backendPostAuthLogin } from "../helpers/backend_helper"
import { setLoginAuthToken } from "../helpers/authHelper"

const Home: NextPage = () => {
  const [requestData, setRequestData] = useState({})
  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    setRequestData({ ...requestData, [name]: value })
  }
  const handleFormSubmit = () => {
    try {
      //dispatch(postAuthLogin(requestData, callback))
      backendPostAuthLogin(requestData)
        .then(async (response) => {
          if (!response.isError) {
            var user = response.data;
            setLoginAuthToken(user.token)
            delete user['token'];
            localStorage.setItem('authInfo', JSON.stringify(user));
            Router.push('dashboard')
          }
        },
          error => {

          })

    } catch (e) {
      console.log(e, 'Error in the Login')
    }
  }
  return (
    <>
      <NonAuthLayout>
        <Row className="align-items-center h-100">
          <Col xs={6} className="mobilenone">
            <Image src={authlogin} alt="Field Konnect" className="img-fluid" />
          </Col>
          <Col xs={6} className="customwidth m-auto">
            <h1 className="f-w-700">Sign In</h1>
            <p className="f-18">Admin account</p>
            <Row>
              <Col>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    onChange={handleInputChange}
                    placeholder="Enter Email / Mobile"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="form-control"
                />
              </Form.Group>
            </Row>
            <div className="text-end form-group ">
              <a className="text-dark" href="#!">
                Forgot Password?
              </a>
            </div>
            <Row className="align-items-center">
              <Form.Group className="form-group">
                <Button
                  type="submit"
                  onClick={handleFormSubmit}
                  className="btn text-white bg-dark w-100"
                >
                  Sign In
                </Button>
              </Form.Group>
            </Row>
          </Col>
        </Row>
      </NonAuthLayout>
    </>
  );
}

export default Home
