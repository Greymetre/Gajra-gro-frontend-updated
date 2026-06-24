import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Image, Carousel, Row, Table, Form, Accordion } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteProduct, backendGetAllCategories, backendGetAllProducts } from '../../helpers/backend_helper'
import Link from 'next/link'

import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import AccordionItem from 'react-bootstrap/esm/AccordionItem'

function CustomToggle(props: any) {
  const { eventKey } = props
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <button
      type="button"
      className="btn  btn-dark"
      onClick={decoratedOnClick}
    >Filter
    </button>
  );
}

export default function Product() {
  const [showFilterForm, setShowFilterForm] = useState(false)
  const toggleFilterForm = () => {
    setShowFilterForm(!showFilterForm)
  }
  const categoryList = useSelector((state: any) => state?.categorys?.categorys);
  const dispatch = useDispatch();
  const fetchProducts = async () => {
    await backendGetAllCategories().then((res) => {
      dispatch({
        type: 'GET_CATEGORY',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Category List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={6}>
              <h3 className="card-body">Category List({Array.isArray(categoryList) ? categoryList.length : '0'})</h3>
            </Col>
            <Col md={6} className='text-end'>
              <div className="card-body">
                <Link
                  href={{
                    pathname: '/category/create',
                  }}
                ><Button className='btn btn-dark'>
                    <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add Category</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        {Array.isArray(categoryList) && categoryList.map((item, index) => {
          return (
            <Col xl={4} md={6} sm={6} xs={12} key={index}>
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <Link className="mb-3"
                        href={{
                          pathname: '/category/' + item._id,
                        }}
                      >
                        <Image
                          src={(item.categoryImage) ? IMAGE_URL + item.categoryImage : IMAGE_URL + PROFILE_DEMO_IMAGE}
                          alt="User image"
                          className="img-radius img-fluid wid-56"
                        />
                      </Link>
                    </Col>
                    <Col md={8}>
                      <span className="heart">
                        <Link
                          href={{
                            pathname: '/category/create',
                            query: { id: item._id },
                          }}
                        >
                          <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                        </Link>
                      </span>
                      <Link className="mb-3"
                        href={{
                          pathname: '/category/' + item._id,
                        }}
                      >
                        <h6 className="m-b-0 text-dark f-14">{item.categoryName}</h6>
                      </Link>
                      <p className="m-0 d-inline-block align-middle font-16">
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star"></span>
                      </p>
                      <p className="text-muted f-10 m-0">{item.categoryDescription}</p>
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

