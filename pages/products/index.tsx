import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { Button, Card, Col, Dropdown, Image, Carousel, Row, Table, Form, Accordion, Spinner } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteProduct, backendGetAllProducts, backendGetAllSubCategories } from '../../helpers/backend_helper'
import Link from 'next/link'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import AccordionItem from 'react-bootstrap/esm/AccordionItem'
import { ProductFilterInterface, ProductViewInterface, initialFilterProduct } from '../../interfaces/product.interface'
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface'
import * as XLSX from 'xlsx';
function CustomToggle(props: any) {
  const { eventKey } = props
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('')
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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [filterData, setFilterData] = useState<ProductFilterInterface>(initialFilterProduct)
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const [productData, setProductData] = useState<Array<ProductViewInterface>>([])
  const productList = useSelector((state: any) => state?.products?.products);
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'products.read':
        return { ...acc, canRead: true };
      case 'products.update':
        return { ...acc, canUpdate: true };
      case 'products.delete':
        return { ...acc, canDelete: true };
      case 'products.create':
        return { ...acc, canCreate: true };
      case 'products.export':
        return { ...acc, canExport: true };
      case 'products.import':
        return { ...acc, canImport: true };
      default:
        return acc;
    }
  }, {});
  const dispatch = useDispatch();
  const fetchProducts = async () => {
    await backendGetAllProducts(paginationData).then((res) => {
      const { docs, paginate } = res.data
      let totalData = Array.isArray(paginate) && paginate.length && paginate[0].totalDocs
      setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: Math.ceil(totalData / paginationData.recordPerPage) })
      setProductData(docs)   
      setIsLoading(false)   
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [filterData, paginationData])

  const handleOnExport = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(productData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "products.xlsx");
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Product List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={3}>
              <h3 className="card-body">Product List({ resPaginateData.totalDocs })</h3>
            </Col>
            <Col md={2}>
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label>Show</Form.Label>
                <Form.Select value={paginationData.recordPerPage} onChange={(e: any) => { setPaginationData({ ...paginationData, recordPerPage: e.target.value }) }}>
                  <option value={100}>{100}</option>
                  <option value={200}>{200}</option>
                  <option value={500}>{500}</option>
                  <option value={1000}>{1000}</option>
                  <option value={2000}>{2000}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className='text-end'>
              <Form.Group className="form-group">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => { setPaginationData({ ...paginationData, search: e.target.value }) } }
                  value={paginationData.search}
                  autoComplete='off'
                  placeholder='Search'
                />
              </Form.Group>
            </Col>
            <Col md={4} className='text-end'>
              <div className="card-body">
              {moduleAccess?.canExport ?(<Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel</Button>) : null }
              {moduleAccess?.canCreate ?  (<Link
                  href={{
                    pathname: '/products/create',
                  }}
                ><Button className='btn btn-dark'>
                    <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add Product</Button>
                </Link>) : null }
              </div>
            </Col>
          </Row>
        </Col>
        {/* <Col xl={12} sm={12} xs={12} className='mb-3'>
          <Accordion defaultActiveKey="0">
            <CustomToggle eventKey="1"></CustomToggle>
            <Accordion.Collapse eventKey="1">
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row>
                    <Col md={4} className='border-end'>
                      <div className="p-3">
                        <h5>Brand</h5>
                        <Row className='mt-3 gx-0'>
                          <Col md={6} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="Beige"
                            />
                          </Col>
                          <Col md={6} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="Black"
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col md={4} className='border-end'>
                      <div className="p-3">
                        <h5>Price</h5>
                        <Row className='mt-3 gx-0'>
                          <Col md={12} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="Under 500"
                            />
                          </Col>
                          <Col md={12} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="500 - 1000"
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col md={4} className='border-end'>
                      <div className="p-3">
                        <h5>Deals</h5>
                        <Row className='mt-3 gx-0'>
                          <Col md={12} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="Coming Deals"
                            />
                          </Col>
                          <Col md={12} className='form-check mb-2'>
                            <Form.Check
                              type="checkbox"
                              label="Today’s Deals"
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Accordion.Collapse>
          </Accordion>
        </Col> */}
        {Array.isArray(productData) && productData.map((item: any, index: number) => {
          return (
            <Col xl={4} md={6} sm={6} xs={12} key={index} >
              <Card className='prod-p-card bg-white'>
                <Card.Body>
                  <Row className='align-items-center'>
                    <Col md={5}>
                      <Link className="mb-3"
                        href={{
                          pathname: '/products/' + item._id,
                        }}
                      >
                        <Image

                        // src={
//   item.images?.length > 0
//     ? IMAGE_URL + item.images[0].image
//     : IMAGE_URL + PROFILE_DEMO_IMAGE
// }
                          src={(item.images[0]) ? IMAGE_URL + item.images[0]: IMAGE_URL + PROFILE_DEMO_IMAGE}
                          // src={IMAGE_URL + PROFILE_DEMO_IMAGE}
                          alt="User image"
                          className="img-fluid wid-56 rounded-2 aspect-square"
                        />
                      </Link>
                      <Col>
                      </Col>
                    </Col>
                    <Col md={7}>
                      <span className="heart">
                      {moduleAccess?.canUpdate ? (<Link
                          href={{
                            pathname: '/products/create',
                            query: { id: item._id },
                          }}
                        >
                          <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                        </Link>) : null }
                      </span>
                      <Link className="mb-3"
                        href={{
                          pathname: '/products/' + item._id,
                        }}
                      >
                        <h6 className="m-b-0 text-dark f-14">{item.name}</h6>
                      </Link>
                      <p className="text-muted f-10 m-0">{item.partNo}</p>
                      <p className="m-0 d-inline-block align-middle font-16">
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star-on"></span>
                        <span className="text-warning feather icon-star"></span>
                        <span className="text-muted"><span className="text-info"></span>{item.subcategoryName}</span>
                      </p>
                      <div className="d-flex mt-3">
                        <h6 className="m-b-0 m-r-10 text-dark">₹ {item.price}</h6>
                        <h6 className="m-b-0 m-r-10 text-muted"><del>₹{item.mrp}</del></h6>
                        <h6 className="m-b-0 text-success">{item.discount}%</h6>
                      </div>
                      <p className="text-muted f-10 m-0">{item.categoryName}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
        {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
         <Col xl={12} sm={12} xs={12} className='mb-3 text-end'>
            <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end">
                            <li className={`page-item ${paginationData.currentPage === 1 ? 'disabled' : ''}`}>
                              <a className="page-link" onClick={() => {
                                setPaginationData({ ...paginationData, currentPage: paginationData.currentPage -1 })
                                  router.push(`/products/?page=${paginationData.currentPage -1}`);
                                }
                                }>Previous</a>
                            </li>

                            <li className={`page-item ${paginationData.currentPage === resPaginateData.totalPages ? 'disabled' : ''}`}>
                              <a className="page-link" 
                                onClick={() => {
                                  setPaginationData({ ...paginationData, currentPage: paginationData.currentPage + 1 })
                                  router.push(`/products/?page=${paginationData.currentPage + 1}`);
                                }
                                }>Next</a>
                            </li>
                          </ul>
                        </nav>

         </Col>
      </Row>
    </Layout>
  )
}

