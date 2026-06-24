import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row,  Image ,Table, Form, Accordion } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllGifts } from '../../helpers/backend_helper'
import Link from 'next/link'
import editimg from '../../assets/images/auth/edit-3.svg'
import giftimg from '../../assets/images/product/product.png'

import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

export default function Gift() {
  const [showFilterForm, setShowFilterForm] = useState(false)
  const toggleFilterForm = () => {
    setShowFilterForm(!showFilterForm)
  }
  const giftList = useSelector((state: any) => state?.gifts?.gifts);
  const dispatch = useDispatch();
  const fetchGifts = async () => {
    await backendGetAllGifts().then((res) => {
      dispatch({
        type: 'GET_GIFTS',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchGifts()
  }, [])

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Gift List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={6}>
              <h3 className="card-body">Gift List({Array.isArray(giftList) ? giftList.length : '0'})</h3>
            </Col>
            <Col md={6} className='text-end'>
              <div className="card-body">
                <Link
                  href={{
                    pathname: '/gifts/create',
                  }}
                >
                  <Button className="btn btn-dark"><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add Gift</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        {Array.isArray(giftList) && giftList.map((item, index) => {
          return (
            <Col xl={4} md={6} sm={6} xs={12} key={index}>
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row className='align-items-center'>
                   <Col md={5}><Link className="mb-3"
                        href={{
                          pathname: '/gifts/' + item._id,
                        }}
                      >
                        <Image
                      src=
{(item.images) ? IMAGE_URL + item.images : IMAGE_URL + PROFILE_DEMO_IMAGE}
                      alt="User image"
                      className=" img-fluid wid-56"
                        />
                      </Link>
                      
                     
                    </Col>
                    <Col md={7}>
                      <span className="heart">
                        <Link
                          href={{
                            pathname: '/gifts/create',
                            query: { id: item._id },
                          }}

                        ><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></Link>
                      </span>
                      <Link className="mb-3"
                        href={{
                          pathname: '/gifts/' + item._id,
                        }}
                      >
                        <h6 className="m-b-0 text-dark f-14">{item.giftName}</h6>
                      </Link>
                      <p className="text-muted f-10 m-0">{item.model}</p>
                      <p className="text-muted f-10 m-0">{item.brand}</p>
                      <p className="m-0 d-inline-block align-middle font-16">
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star"></span>
                        <span className="text-muted"><span className="text-info"></span>{item.giftType}</span>
                      </p>
                      <div className="d-flex mt-3">
                        <h6 className="m-b-0 m-r-10 text-dark">{item.points}</h6>
                        <h6 className="m-b-0 m-r-10 text-muted"><del>₹{item.mrp}</del></h6>
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

