import React, { useEffect, useState } from 'react'
import { Card, Col, Button, Row, Image, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteLoyaltyScheme, backendGetLoyaltySchemeInfo, backendPostLoyaltySchemeStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EDIT_WHITE_DEMO_IMAGE, SHOPPING_BAG_IMAGE, SHOP_ALT_IMAGE, USER_ALT_IMAGE, SHOP_EARN_POINT_IMAGE, WHITE_TRASH_IMAGE, EXCEL_DEMO_IMAGE } from '../../utils/constant'
import { useRouter } from 'next/router'
import { LoyaltySchemeInterface, initialLoyaltyScheme } from '../../interfaces/scheme.interface'
import * as XLSX from 'xlsx';
import { CategoryViewInterface, ProductLoyaltyViewInterface, SubCategoryViewInterface } from '../../interfaces/category.interface'

const LoyaltySchemeDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [schemeInfo, setSchemeInfo] = useState<LoyaltySchemeInterface>(initialLoyaltyScheme)
  const [productsData, setProductsData] = useState<Array<ProductLoyaltyViewInterface>>([])
  const [categoryData, setCategoryData] = useState<Array<CategoryViewInterface>>([])
  const [subcategoryData, setSubcategoryData] = useState<Array<SubCategoryViewInterface>>([])
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'loyaltyscheme.read':
        return { ...acc, canRead: true };
      case 'loyaltyscheme.update':
        return { ...acc, canUpdate: true };
      case 'loyaltyscheme.delete':
        return { ...acc, canDelete: true };
      case 'loyaltyscheme.create':
        return { ...acc, canCreate: true };
      case 'loyaltyscheme.export':
        return { ...acc, canExport: true };
      case 'loyaltyscheme.import':
        return { ...acc, canImport: true };
      default:
        return acc;
    }
  }, {});
  const fetchLoyaltySchemeDetail = async () => {
    await backendGetLoyaltySchemeInfo(id).then(async(res) => {
      if (!res.isError) {
        const { productInfo, categoryInfo, subcategoryInfo } = res.data
        await setSchemeInfo(res.data)
        await setProductsData(productInfo)
        await setCategoryData(categoryInfo)
        await setSubcategoryData(subcategoryInfo)
      }
    })
  }
  useEffect(() => {
    if(id)
      fetchLoyaltySchemeDetail()
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteLoyaltyScheme(id).then((result) => {
      if (!result.isError) {
        router.push('/loyaltyscheme');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const activeInactiveLoyaltyScheme = () => {
    backendPostLoyaltySchemeStatus({ schemeid: id, active: (schemeInfo.active) ? false : true }).then((result) => {
      if (!result.isError) {
        fetchLoyaltySchemeDetail()
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const downloadLoyaltySchemeDetails = async() => {
    const mappedArray = await Promise.all(schemeInfo.schemeDetail.map(async (detail: any) => {
        let detailrow = await Promise.all(detail.products.map(async (product: any) => {
         let productInfo = await Array.isArray(productsData) && productsData.filter(function (rows:any) { return rows._id == product })
         let productNo = (Array.isArray(productInfo) && productInfo.length) ? productInfo[0].productNo : '';
         let productName = (Array.isArray(productInfo) && productInfo.length) ? productInfo[0].name : '';
         let categoryid = (Array.isArray(productInfo) && productInfo.length) ? productInfo[0].categoryid : '';
         let subcategoryid = (Array.isArray(productInfo) && productInfo.length) ? productInfo[0].subcategoryid : '';
         let categoryInfo = await Array.isArray(categoryData) && categoryData.filter(function (rows :any) { return rows._id == categoryid })
         let subcategoryInfo = await Array.isArray(subcategoryData) && subcategoryData.filter(function (rows) { return rows._id == subcategoryid })
          let rows = {
            schemeName : schemeInfo.schemeName,
            startedAt : schemeInfo.startedAt,
            endedAt : schemeInfo.endedAt,
            schemeType : schemeInfo.schemeType,
            basedOn : schemeInfo.basedOn,
            frequency : schemeInfo.frequency,
            schemeDescription : schemeInfo.schemeDescription,
            detailName : detail.detailName,
            categoryName : (Array.isArray(categoryInfo) && categoryInfo.length) ? categoryInfo[0].categoryName : '',
            subcategoryName : (Array.isArray(subcategoryInfo) && subcategoryInfo.length) ? subcategoryInfo[0].subcategoryName : '',
            productNo : productNo,
            productName: productName,
            productid: product,
            points : detail.points,
          }
          return rows
        }))
        return detailrow
    }))
    const finalData =  await mappedArray.flat(2);
    var wb= XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(finalData)
    XLSX.utils.book_append_sheet(wb,ws,"mysheet1");
    XLSX.writeFile(wb,"loyaltyscheme.xls");
  }


  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/loyaltyscheme', label: 'LoyaltySchemeList' }} itemlabel='LoyaltyScheme Details' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={4} sm={4} xs={6}>
              <h3 className="card-body mb-4">LoyaltyScheme Details </h3>
            </Col>
            <Col xl={4} sm={4} xs={4} className='text-end'>
            { moduleAccess.canExport && <Button onClick={()=> {
              downloadLoyaltySchemeDetails()
            }} className="p-2 pr-2 text-end" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export</Button>}
            </Col>
            <Col xl={4} sm={4} xs={4} className="text-end">
              <Card.Body>
              <div className="form-group d-flex align-items-center justify-content-end mb-0">
                  <Form.Group>
                    <Form.Label className='d-block m-r-10'></Form.Label>
                    <div className='form-check form-switch custom-control-inline' >
                      <Form.Check
                        inline
                        name="active"
                        type="checkbox"
                        onClick={() => { if (window.confirm(`Are you sure to ${(schemeInfo.active) ? 'Inactive' : 'Active'} loyalty scheme ?`)) { activeInactiveLoyaltyScheme() }} }
                        defaultChecked={schemeInfo.active}
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
              <Col xl={12} sm={12} xs={12}>
                <Row className='align-items-start card-body'>
                  <Col xl={6} sm={6} xs={6}>
                    <Image className='width240 rounded img-fluid' width={500}
                      height={500} src={(schemeInfo.image) ? IMAGE_URL + schemeInfo.image : IMAGE_URL + CUSTOMER_DEMO_IMAGE} />
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">SchemeName</p>
                      <span className="text-muted ">{schemeInfo.schemeName}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6} className="text-end">
                  { moduleAccess.canUpdate && <Link className="mb-3"
                      href={{
                        pathname: '/loyaltyscheme/create',
                        query: { id: schemeInfo._id },
                      }}
                    >
                      <Button className="btn btn-dark m-r-5"><Image src={IMAGE_URL + EDIT_WHITE_DEMO_IMAGE} /> Edit</Button>
                    </Link>
                  }
                  { moduleAccess.canDelete &&  <div className="btn  btn-dark">
                      <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(schemeInfo._id) }} >
                        <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</a>
                    </div>
                  }
                  </Col>
                </Row><Row className='align-items-start card-body'>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">CustomerType</p>
                      <span className="text-muted ">{schemeInfo.customerType}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">SchemeType</p>
                      <span className="text-muted ">{schemeInfo.schemeType}</span>
                    </div>
                  </Col>
                  {/* <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Points</p>
                      <span className="text-muted ">{schemeInfo.pointValue}</span>
                    </div>
                  </Col> */}
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Frequency</p>
                      <span className="text-muted ">{schemeInfo.frequency}</span>
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-start card-body'>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">StartDate</p>
                      <span className="text-muted ">{new Date(schemeInfo.startedAt).toLocaleDateString()}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">EndDate</p>
                      <span className="text-muted ">{new Date(schemeInfo.endedAt).toLocaleDateString()}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">State</p>
                      <span className="text-muted ">{schemeInfo.states}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">City</p>
                      <span className="text-muted ">{schemeInfo.cities}</span>
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-start card-body'>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">SchemeDescription</p>
                      <span className="text-muted ">{schemeInfo.schemeDescription}</span>
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-start card-body'>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Scheme Detail</p>
                      {Array.isArray(schemeInfo.schemeDetail) && schemeInfo.schemeDetail.map((item, index) => {
                        return (
                          <span className="text-muted">DetailName:{item.detailName}
                            &nbsp;&nbsp;
                            Points:{item.points}
                          </span>
                        )
                      }
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default LoyaltySchemeDetail

