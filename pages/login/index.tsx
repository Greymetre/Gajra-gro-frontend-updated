import React, { useState } from 'react'
import Router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { postAuthLogin } from '../../store/login/actions'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import ConstantsImagePath from '../../assets/svgimages'
import NonAuthLayout from '../../components/Layout/NonAuthLayout'
import authlogin from '../../assets/images/auth/login.png'
import Image from 'next/image'
import { backendPostAuthLogin } from "../../helpers/backend_helper"
import { getAuthToken, setLoginAuthToken } from "../../helpers/authHelper"

import { Formik, FormikHelpers, useFormik, useFormikContext } from 'formik';
import * as yup from "yup";

const schema = yup.object().shape({
  password: yup.string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  //.matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  username: yup.string()
    .min(8, "Mininum 2 characters")
    .max(50, "Maximum 30 characters")
    //.email("enter email")
    .required("username is required"),
});


export default function Login() {
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState('')
  const [requestData, setRequestData] = useState({})
  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    formik.setFieldValue(name, value);
    // setRequestData({ ...requestData, [name]: value })
  }
  const callback = async (resp: any) => {
    if (resp.id) {
      Router.push('dashboard')
    }
  }
  const handleFormSubmit = () => {

    try {
      //dispatch(postAuthLogin(requestData, callback))
      backendPostAuthLogin(formik.values).then(async (response) => {
          if (!response.isError) {
            var user = response.data;
            setLoginAuthToken(user.token)
            delete user['token'];
            localStorage.setItem('authInfo', JSON.stringify(user));
            Router.push('dashboard')
          }
          console.log(response);
        }).catch((error) => { 
          console.log('error');
          
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });
  return (
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
                  onBlur={formik.handleBlur}
                  placeholder="Enter  Mobile"
                  className="form-control"
                />
                {formik.errors.username && (
                  <div className="text-danger">{formik.errors.username}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={handleInputChange}
                placeholder="Password"
                className="form-control"
              />
              {formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
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
                disabled={!formik.isValid}
                onClick={() => {
                  if (formik.isValid) {
                    formik.handleSubmit();
                  }
                  else {
                    console.log("is invalid", !formik.isValid)
                  }
                }}

                className="btn text-white bg-dark w-100"
              >
                Sign In
              </Button>
            </Form.Group>
          </Row>
        </Col>
      </Row>
    </NonAuthLayout>
  )
}
