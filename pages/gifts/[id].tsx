import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteGift, backendGetGiftInfo, backendPostGiftStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
import { useRouter } from 'next/router'
import { GiftInterface } from '../../interfaces/gift.interface'
const GiftDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [giftInfo, setGiftInfo] = useState<GiftInterface>({ _id: id })
  const dispatch = useDispatch();
  const fetchGiftDetail = async () => {
    await backendGetGiftInfo(id).then((res) => {
      if (!res.isError) {
        setGiftInfo(res.data)
      }
    })
  }
  useEffect(() => {
    if (id) {
      fetchGiftDetail()
    }
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteGift(id).then((result) => {
      
      if (!result.isError) {
        router.push('/gifts');
      }
      else {

      }
    })
    .catch((err) => {
    });
  };

  const activeInactiveGift = () => {
    backendPostGiftStatus({ giftid: id, active: (giftInfo.active) ? false : true }).then((result) => {
      if (!result.isError) {
        fetchGiftDetail()
      }
    }).catch((err) => {

    });
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/gifts', label: 'GiftList' }} itemlabel='Gift Profile' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">Gift Details</h3>
            </Col>
            <Col xl={6} sm={6} xs={6} className="text-end">
              <Card.Body>
                <div className="form-group d-flex align-items-center justify-content-end mb-0">
                  <Form.Group>
                    <Form.Label className='d-block m-r-10'></Form.Label>
                    <div className='form-check form-switch custom-control-inline' >
                      <Form.Check
                        inline
                        name="active"
                        type="checkbox"
                        onClick={() => { if (window.confirm(`Are you sure to ${(giftInfo.active) ? 'Inactive' : 'Active'} gift?`)) { activeInactiveGift() }} }
                        defaultChecked={giftInfo.active}
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Col>
        <Col xl={12} sm={12} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Row className='gx-0 align-items-start'>
              <Col xl={7} sm={7} xs={7} className='border-end'>
                <Card.Body className='product-top border-bottom'>
                  <h6 className="m-b-0 text-dark f-20">{giftInfo.giftName}</h6>
                  <p className="text-muted f-16 m-0">{giftInfo.giftType}</p>
                  <p className="m-0 d-inline-block align-middle font-16">
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star"></span>
                    <span className="text-muted">
                      <span className="text-info">{giftInfo.points}</span></span>
                  </p>
                  <div className="d-flex mt-4">
                    <h6 className="m-b-0 m-r-10 text-dark f-20">₹{giftInfo.price}</h6>
                    <h6 className="m-b-0 m-r-10 text-muted f-20">
                      <del>₹{giftInfo.mrp}</del>
                    </h6>
                    <h6 className="m-b-0 text-success f-20">20%</h6>
                  </div>
                  <p className="text-muted f-16">{giftInfo.points}</p>
                  <div className="product-specifications card-body  border-bottom">
                    <h6 className="text-dark m-b-10 f-20">Specifications</h6>
                    <Row>
                      <Col xl={6} sm={6} xs={12}>
                        <h6 className="mb-0">
                          <i data-feather="user"></i> Brand
                        </h6>
                        <p className="m-l-30">{giftInfo.brand}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h6 className="mb-0">
                          <i data-feather="user"></i> GiftType                       </h6>
                        <p className="m-l-30">{giftInfo.giftType}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h6 className="mb-0">
                          <i data-feather="user"></i> Model                       </h6>
                        <p className="m-l-30">{giftInfo.model}</p>
                      </Col>
         
                      
                    </Row>
                  </div>
                  <div className="product-details card-body m-b-20">
                    <h6 className="text-dark m-b-10 f-20">Gift Description</h6>
                    <p className="text-muted f-16 m-0">{giftInfo.giftDescription}</p>
                  </div>
                </Card.Body>
              </Col>
              <Col xl={5} sm={5} xs={5} className='position-relative align-items-center likebutton'>
                <span className="heart"> <i className="fas fa-heart text-muted"></i></span>
                <Card.Body className="sticky-md-top product-sticky pt-20">
                  <div className="mt-2 m-b-10">
                 
                    <div className="btn  btn-dark float-end  m-b-10">
                      <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(giftInfo._id) }} >
                        <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</a>
                    </div>          </div>
                    <br/>
                  <Carousel className='carousel-fade' indicators={false}>
                  <Image src={IMAGE_URL + CUSTOMER_DEMO_IMAGE} className="d-block w-100" alt="First slide" />

                    {Array.isArray(giftInfo.images) && giftInfo.images.map((item, index) => {
                      return (<Carousel.Item interval={1000} key={index}>
                        {/* <Image src={(item) ? IMAGE_URL + item : IMAGE_URL + CUSTOMER_DEMO_IMAGE} className="d-block w-100" alt="First slide" /> */}
                      </Carousel.Item>)
                    })}
                  </Carousel>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default GiftDetail

