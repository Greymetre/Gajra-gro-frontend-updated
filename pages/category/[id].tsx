
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteCategory, backendDeleteProduct, backendGetCategoryInfo, backendGetProductInfo, backendPostProductStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
import { ProductViewInterface } from '../../interfaces/product.interface'
import { useRouter } from 'next/router'
import { CategoryViewInterface, initialCategory } from '../../interfaces/category.interface'
const ProductDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState<CategoryViewInterface>()
  const dispatch = useDispatch();
  const fetchProductDetail = async () => {
    await backendGetCategoryInfo(id).then((res) => {
      if (!res.isError) {
        setProductInfo(res.data)
      }
    })
  }
  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteCategory(id).then((result) => {
      if (!result.isError) {
        router.push('/category');
      }
      else {

      }
    })
  };



  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Dashboard' }} secondItem={{ href: '/products', label: 'ProductList' }} itemlabel='Product Detail' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">Category Details</h3>
            </Col>

          </Row>
        </Col>
        <Col xl={12} sm={12} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Row className='gx-0 align-items-start'>
              <Col xl={7} sm={7} xs={7} className='border-end'>
                <Card.Body className='product-top border-bottom'>
                  <h6 className="m-b-0 text-dark f-20">{productInfo?.categoryName} </h6>

                  <p className="m-0 d-inline-block align-middle font-16">
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star"></span>
                    <span className="text-muted"></span></p>


                  <Row>
                    <Col xl={6} sm={6} xs={12}>
                      <h5 className="mb-0">
                        <i data-feather="user"></i> Category
                      </h5>
                      <p className="m-l-30">{productInfo?.categoryName}</p>
                    </Col>


                    <Col xl={6} sm={6} xs={12}>
                      <h5 className="mb-0">
                        <i data-feather="user"></i>Ranking                       </h5>
                      <p className="m-l-30">{productInfo?.ranking}</p>
                    </Col>

                    <Col xl={6} sm={6} xs={12}>
                      <h6 className="mb-0"> Description</h6>
                      <p className="text-muted f-16 m-0">{productInfo?.categoryDescription}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
              <Col xl={5} sm={5} xs={5} className='position-relative align-items-center likebutton'>
                <Row>
                  <Col xl={12} sm={12} xs={12} className="text-end">
                    <div className="p-4">
                      <div className="btn btn-dark float-end">
                        <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(productInfo?._id) }} >
                          <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <span className="heart"> <i className="fas fa-heart text-muted"></i></span>
                <Card.Body className="sticky-md-top product-sticky pt-20">
                  <Image
                    src={(productInfo?.image) ? IMAGE_URL + productInfo.image : IMAGE_URL + CUSTOMER_DEMO_IMAGE}
                    className="d-block w-100" />
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default ProductDetail