import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Image, Row, } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllSubCategories } from '../../helpers/backend_helper'
import Link from 'next/link'
import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

export default function SubCategorySave() {
  const productList = useSelector((state: any) => state?.subcategory?.subcategory);
  const dispatch = useDispatch();
  const fetchProducts = async () => {
    await backendGetAllSubCategories().then((res) => {
      dispatch({
        type: 'GET_SUBCATEGORYS',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='SubCategory List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={6}>
              <h3 className="card-body">SubCategory List({Array.isArray(productList) ? productList.length : '0'})</h3>
            </Col>
            <Col md={6} className='text-end'>
              <div className="card-body">
                <Link
                  href={{
                    pathname: '/subcategory/create',
                  }}
                ><Button className='btn btn-dark'>
                    <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add SubCategory</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        {Array.isArray(productList) && productList.map((item, index) => {
          return (
            <Col xl={4} md={6} sm={6} xs={12} key={index} >
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row className='align-items-center'>
                    <Col md={5}>
                      <Link className="mb-3"
                        href={{
                          pathname: '/subcategory/' + item._id,
                        }}
                      >
                        <Image
                          // src={(item.images[0]) ? IMAGE_URL + item.images[0]: IMAGE_URL + PROFILE_DEMO_IMAGE}
                          src={IMAGE_URL + PROFILE_DEMO_IMAGE}
                          alt="User image"
                          className="img-fluid wid-56"
                        />
                      </Link>
                    </Col>
                    <Col md={7}>
                      <span className="heart">
                        <Link
                          href={{
                            pathname: '/subcategory/create',
                            query: { id: item._id },
                          }}
                        >
                          <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                        </Link>
                      </span>
                      <Link className="mb-3"
                        href={{
                          pathname: '/subcategory/' + item._id,
                        }}
                      >
                        <h6 className="m-b-0 text-dark f-14">{item.subcategoryName}</h6>
                      </Link>
                      <p className="m-0 d-inline-block align-middle font-16">
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star"></span>
                        <span className="text-muted"><span className="text-info"></span>{item.subcategoryDescription}</span>
                      </p>
                      <div className="d-flex mt-3">
                        <h6 className="m-b-0 text-success">{item.ranking}</h6>
                      </div>
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

