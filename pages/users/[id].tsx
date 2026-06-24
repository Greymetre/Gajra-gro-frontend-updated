import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteUser, backendGetUserInfo, backendPostUserStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { ViewUserInfoInterface } from '../../interfaces/user.interface'
import { useRouter } from 'next/router'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, EDIT_WHITE_DEMO_IMAGE, SHOPPING_BAG_IMAGE, SHOP_ALT_IMAGE, USER_ALT_IMAGE, SHOP_EARN_POINT_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
const UserDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [userInfo, setUserInfo] = useState<ViewUserInfoInterface>({ _id: id })
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'users.update':
        return { ...acc, canUpdate: true };
      case 'users.delete':
        return { ...acc, canDelete: true };
      default:
        return acc;
    }
  }, {});
  const dispatch = useDispatch();
  const fetchUserDetail = async () => {
    await backendGetUserInfo(id).then((res) => {
      if (!res.isError) {
        setUserInfo(res.data)
      }
    })
  }
  useEffect(() => {
    if (id) {
      fetchUserDetail()
    }
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteUser(id).then((result) => {
      if (!result.isError) {
        router.push('/users');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const activeInactiveUser = () => {
    backendPostUserStatus({ userid: id, active: (userInfo.active) ? false : true }).then((result) => {
      if (!result.isError) {
        fetchUserDetail()
      }
    }).catch((err) => {

    });
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/users', label: 'UserList' }} itemlabel='User Profile' />
      <Row>
        <Col xl={3} sm={3} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOPPING_BAG_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Sales</h6>
                  <h3 className="m-b-0 text-dark">$1,783</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={3} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOP_ALT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Expenses</h6>
                  <h3 className="m-b-0 text-dark">$1,783</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={3} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + USER_ALT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Visitors</h6>
                  <h3 className="m-b-0 text-dark">$1,783</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={3} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOP_EARN_POINT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Points</h6>
                  <h3 className="m-b-0 text-dark">$1,783</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-0">User Profile</h3>
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
                        onClick={() => { if (window.confirm(`Are you sure to ${(userInfo.active) ? 'Inactive' : 'Active'} product ?`)) { activeInactiveUser() }} }
                        defaultChecked={userInfo.active}
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <Card className="flat-card">
            <Row>
              <Col xl={6} sm={6} xs={6} className="border-end border-end-dashed">
                <Row className='align-items-center card-body'>
                  <Col xl={6} sm={6} xs={6}>
                    <Image className='width240 rounded img-fluid' src={(userInfo.avatar) ? IMAGE_URL + userInfo.avatar : IMAGE_URL + CUSTOMER_DEMO_IMAGE} />
                  </Col>
                  <Col xl={6} sm={6} xs={6}>
                    <h4>{`${userInfo.firstName} ${userInfo.lastName}`}</h4>
                    <span className="text-muted">
                      <i className="feather icon-phone m-r-10 "></i>{userInfo.mobile}</span><br />
                    <span className="text-muted">
                      <i className="feather icon-mail m-r-10"></i>{userInfo.email} </span>
                  </Col>
                </Row>
              </Col>
              <Col xl={6} sm={6} xs={6}>
                <Row className='align-items-center card-body'>
                  <Col xl={6} sm={6} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">User Type</p>
                      <span className="text-muted ">{userInfo.userType}</span>
                    </div>
                  </Col>
                  <Col xl={6} sm={6} xs={6} className="text-end">
                    { moduleAccess.canUpdate && <Link
                      href={{
                        pathname: '/users/create',
                        query: { id: userInfo._id },
                      }}
                    >
                      <Button className="btn btn-dark m-r-5"><Image src={IMAGE_URL + EDIT_WHITE_DEMO_IMAGE} /> Edit</Button>
                    </Link>}
                    { moduleAccess.canDelete && <Button className="btn btn-dark" onClick={() => { handleDeleteItem(userInfo._id) }} ><Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />Delete</Button> }
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='border-top border-top-dashed'>
              <Col xl={12} sm={12} xs={12}>
                <Row className='align-items-start card-body'>
                <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Gender</p>
                      <span className="text-muted ">{userInfo.gender}</span>
                    </div>
                  </Col>
          
                 
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Mobile</p>
                      <span className="text-muted ">{userInfo.mobile}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Email</p>
                      <span className="text-muted ">{userInfo.email}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Date Of Birth</p>
                      <span className="text-muted ">{userInfo.dateOfBirth}</span>
                    </div>
                  </Col>
                  </Row>       
              </Col>
            </Row>
            <Row className='border-top border-top-dashed'>
              <Col xl={12} sm={12} xs={12}>
                <Row className='align-items-start card-body'>
                 
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">State</p>
                      <span className="text-muted ">{userInfo?.address?.state}</span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">City</p>
                      <span className="text-muted ">{userInfo?.address?.city}</span>
                    </div>
                  </Col>
                  <Col xl={6} sm={12} xs={12}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Address</p>
                      <span className="text-muted ">{userInfo?.address?.address}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='border-top border-top-dashed'>
              <Col xl={12} sm={12} xs={12}>
                <Row className='align-items-start card-body'>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">Reporting</p>
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

export default UserDetail

