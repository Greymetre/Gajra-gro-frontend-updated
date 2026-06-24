import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { PlusCircleFill, XCircleFill } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllCustomers } from '../../helpers/backend_helper'
export default function SurveyQuestion() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }
  const customerList = useSelector((state: any) => state?.customers?.customerList);
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    await backendGetAllCustomers().then((res) => {
      dispatch({
        type: 'GET_CUSTOMERS',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchCustomers()
  }, [])
  return (
    <Layout>
    <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Beat List' />
    <Row>
      <Col xl={12} md={12}>
        <Card className='flat-card'>
          <Card.Body>
            <Row>
              <Col>
              <Button className={"btn p-0 btn-icon float-end " + (showCreateForm ? 'btn-danger' : 'btn-info')} onClick={toggleShowCreateForm}>{showCreateForm ? <XCircleFill/> : <PlusCircleFill/>} </Button>
              </Col>
            </Row>
            <Row>
            {showCreateForm ? ('') : null}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Layout>
  )
}
