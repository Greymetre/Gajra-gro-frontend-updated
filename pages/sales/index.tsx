import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown,Image, Row, Table, Form, Accordion } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import {  backendGetAllOrders, backendGetAllSales } from '../../helpers/backend_helper'
import Link from 'next/link'

import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'


export default function Sales() {
  
 
  const orderList = useSelector((state: any) => state?.orders?.orders);
  const dispatch = useDispatch();
  const fetchSale = async () => {
    await  backendGetAllOrders().then((res) => {
      dispatch({
        type: 'GET_ORDER',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchSale()
  }, [])

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Order List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={6}>
              <h3 className="card-body">Sales List({Array.isArray(orderList) ? orderList.length : '0'})</h3>
            </Col>
          
          </Row>
        </Col>
     
        {Array.isArray(orderList) && orderList.map((item, index) => {
          return (
            <Col xl={4} md={6} sm={6} xs={12} key={index} >
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row className='align-items-center'>
                    <Col md={5}>
                    <div className="media user-about-block align-items-center mt-0 mb-3">
                          <div className="position-relative d-inline-block">
                            <Image
                              src={(item.schemeImage) ? IMAGE_URL + item.schemeImage : IMAGE_URL + PROFILE_DEMO_IMAGE}
                              alt="User image"
                              className="img-fluid wid-56"
                              width={56}
                              height={56}
                            />
                          </div></div>

                    </Col>
                    <Col md={7}>
                   
                     
                      <p className="">Example</p>
                      <p className="m-0 d-inline-block align-middle font-16">
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star"></span>
                        <span className="text-muted"><span className="text-info"></span></span>
                      </p>
                      <div className="d-flex mt-3">
                        <h6 className="m-b-0 m-r-10 text-dark"> {item.address}</h6>
                        <h6 className="m-b-0 m-r-10 text-muted"><del>{item.paymentStatus}</del></h6>
                        <h6 className="m-b-0 text-success">{item.subTotal}</h6>
                      </div>
                      <p className="text-muted f-10 m-0">{item.totalAmount}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Layout>
  )
}

