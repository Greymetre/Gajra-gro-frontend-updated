
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteProduct, backendGetProductInfo, backendPostProductStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
import { ProductViewInterface } from '../../interfaces/product.interface'
import { useRouter } from 'next/router'
const ProductDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState<ProductViewInterface>({ _id: id })
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'products.delete':
        return { ...acc, canDelete: true };
      default:
        return acc;
    }
  }, {});
  const dispatch = useDispatch();
  const fetchProductDetail = async () => {
    await backendGetProductInfo(id).then((res) => {
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
    backendDeleteProduct(id).then((result) => {
      if (!result.isError) {
        router.push('/products');
      }
      else {

      }
    })
  };

  const activeInactiveProduct = () => {
    backendPostProductStatus({ productid: id, active: (productInfo.active) ? false : true }).then((result) => {
      if (!result.isError) {
        fetchProductDetail()
      }
    }).catch((err) => {

    });

  }
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Dashboard' }} secondItem={{ href: '/products', label: 'ProductList' }} itemlabel='Product Detail' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">Product Details</h3>
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
                        onClick={() => { if (window.confirm(`Are you sure to ${(productInfo.active) ? 'Inactive' : 'Active'} product ?`)) { activeInactiveProduct() } }}
                        defaultChecked={productInfo.active}
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
                  <h6 className="m-b-0 text-dark f-20">{productInfo.name} </h6>
                  <p className="text-muted f-16 m-0">{productInfo.name}</p>
                  <p className="m-0 d-inline-block align-middle font-16">
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star-on"></span>
                    <span className="text-warning feather icon-star"></span>
                    <span className="text-muted"></span></p>
                  {Array.isArray(productInfo.productDetail) && productInfo.productDetail.map((item, index) => {
                    return (
                      <span className="text-muted">MRP:{item.mrp}
                        <h6 className="m-b-0 m-r-10 text-dark f-20">{item.price}</h6>
                      </span>
                    )
                  }
                  )}  <h6 className="m-b-0 text-success f-20">{productInfo.discount}%</h6>
                  <p className="text-muted f-16">Free delivery</p>
                  <div className="product-specifications card-body  border-bottom">
                    <h6 className="text-dark m-b-10 f-20">About</h6>
                    <Row>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i> Category
                        </h5>
                        <p className="m-l-30">{productInfo.categoryName}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i> Sub Category
                        </h5>
                        <p className="m-l-30">{productInfo.subcategoryName}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i> BrandName
                        </h5>
                        <p className="m-l-30">{productInfo.brand}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i>ModelName
                        </h5>
                        <p className="m-l-30">{productInfo.model}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i>Ranking                       </h5>
                        <p className="m-l-30">{productInfo.ranking}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h5 className="mb-0">
                          <i data-feather="user"></i>Discount
                        </h5>
                        <p className="m-l-30">{productInfo.discount}</p>
                      </Col>
                      <Col xl={6} sm={6} xs={12}>
                        <h6 className="mb-0">Product Description</h6>
                        <p className="text-muted f-16 m-0">{productInfo.description}</p>
                      </Col>
                    </Row>
                  </div>
                  <div className="product-details card-body m-b-20">
                    <h6 className="text-dark m-b-10 f-20">Product Details</h6>
                    {Array.isArray(productInfo.productDetail) && productInfo.productDetail.map((item, index) => {
                      return (
                        <span className="text-muted">MRP:{item.mrp}
                          &nbsp;&nbsp;
                          Price:{item.price}  &nbsp;&nbsp;
                          partNo:{item.partNo}  &nbsp;&nbsp;
                          specification:{item.specification}  &nbsp;&nbsp;
                        </span>
                      )
                    }
                    )}
                  </div>
                </Card.Body>
              </Col>
              <Col xl={5} sm={5} xs={5} className='position-relative align-items-center likebutton'>
                <Row>
                  <Col xl={12} sm={12} xs={12} className="text-end">
                    {moduleAccess.canDelete &&
                      <div className="p-4">
                        <div className="btn btn-dark float-end">
                          <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(productInfo._id) }} >
                            <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</a>
                        </div>
                      </div>}
                  </Col>
                </Row>
                <span className="heart"> <i className="fas fa-heart text-muted"></i></span>
                <Card.Body className="sticky-md-top product-sticky pt-20">
                  {/* <Image src={IMAGE_URL + CUSTOMER_DEMO_IMAGE} className="d-block w-100" /> */}
                  <Carousel className='carousel-fade' indicators={false}>
                    {Array.isArray(productInfo.images) && productInfo.images?.map((item) => {
                      return (<Carousel.Item interval={1000} >
                        <Image src={IMAGE_URL + item} className="d-block w-100 rounded-4 mt-3" alt="First slide" />
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

export default ProductDetail