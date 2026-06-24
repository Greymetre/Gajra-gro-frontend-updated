
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteSubCategory, backendGetSubCategoryInfo, backendPostSubCategoryStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
import { SubCategoryViewInterface } from '../../interfaces/category.interface'
import { useRouter } from 'next/router'
const SubCategoryDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [subcategoryInfo, setSubCategoryInfo] = useState<SubCategoryViewInterface>()
  const dispatch = useDispatch();
  const fetchSubCategoryDetail = async () => {
    await backendGetSubCategoryInfo(id).then((res) => {
      if (!res.isError) {
        setSubCategoryInfo(res.data)
      }
    })
  }
  useEffect(() => {
    if (id) {
      fetchSubCategoryDetail()
    }
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteSubCategory(id).then((result) => {
      if (!result.isError) {
        router.push('/subcategory');
      }
      else {

      }
    })
  };

  const activeInactiveSubCategory = () => {
    backendPostSubCategoryStatus({ subcategoryid: id, active: (subcategoryInfo?.active) ? false : true }).then((result) => {
      if (!result.isError) {
        fetchSubCategoryDetail()
      }
    }).catch((err) => {

    });
  
  }
 
 
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Dashboard' }} secondItem={{ href: '/subcategory', label: 'SubCategoryList' }} itemlabel='SubCategory Detail' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">SubCategory Details</h3>
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
                        onClick={() => { if (window.confirm(`Are you sure to ${(subcategoryInfo?.active) ? 'Inactive' : 'Active'} product ?`)) { activeInactiveSubCategory() }} }
                        defaultChecked={subcategoryInfo?.active}
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
                  <h6 className="m-b-0 text-dark f-20">{subcategoryInfo?.subcategoryName} </h6>
                  <div className="product-specifications card-body  border-bottom">
                    <Row>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i> Category
                        </h5>
                        <p className="m-l-30">{subcategoryInfo?.categoryName}</p>
                      </Col>
                        <Col xl={6} sm={6} xs={12}>
                        <h6 className="mb-0">Description</h6>
                        <p className="text-muted f-16 m-0">{subcategoryInfo?.subcategoryDescription}</p>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Col>
              <Col xl={5} sm={5} xs={5} className='position-relative align-items-center likebutton'>
                <Row>
                  <Col xl={12} sm={12} xs={12} className="text-end">
                    <div className="p-4">
                      <div className="btn btn-dark float-end">
                        <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(subcategoryInfo?._id) }} >
                          <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <span className="heart"> <i className="fas fa-heart text-muted"></i></span>
                <Card.Body className="sticky-md-top product-sticky pt-20">
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default SubCategoryDetail