import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Image2 from 'next/image'
import { Row, Col, Dropdown, Offcanvas, Button, Image, Tabs, Tab } from 'react-bootstrap'
import { removeAuthToken, setLoginAuthToken, getAuthToken } from "../../helpers/authHelper"
import { backendPostAuthLogin } from '../../helpers/backend_helper'
import { IMAGE_URL, PROFILE_DEMO_IMAGE } from '../../utils/constant'
import { List } from 'react-bootstrap-icons';
import KycPendingApprovalList from '../Customer/KycPendingApprovalList'
import PayeePendingForApproval from '../Customer/PayeeForApproval'
import RedemptionForApproval from '../Customer/RedemptionForApproval'
import { useDispatch, useSelector } from 'react-redux'
const Header = React.forwardRef((props, ref) => {
  const router = useRouter()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [key, setKey] = useState('kycApproval');
  const logoutAction = async () => {
    await removeAuthToken()
    router.push('/login');
  }
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'customers.kycapprover':
        return { ...acc, canKycApproved: true };
      case 'customers.payeeapprover':
        return { ...acc, canPayeeApproved: true };
      case 'redemptions.approver':
        return { ...acc, canRedemptionApproved: true };
      default:
        return acc;
    }
  }, {});



  return (
    <>
      <header className="pc-header ">
        <Row className="header-wrapper align-items-center">
          <Col xs={6} md={6} className="serchbox">
            {/* <div className="drp-search"></div> */}
          </Col>
          <Col xs={5} md={5} className="ms-auto text-end">
            <ul className="list-unstyled">
              <li className="dropdown pc-h-item">
                {/* <Link
                  className="pc-head-link dropdown-toggle arrow-none me-0"
                  href="#"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <Image src={bellimg} /> 
                </Link> */}

                <span className=" user-name username m-r-10">username</span>

                <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                  <a href="user-profile.html" className="dropdown-item">
                    <i className="fas fa-user-circle"></i>
                    <span>Profile</span>
                  </a>
                  <a className="dropdown-item">
                    <i className="fas fa-table"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </li>
              <li className="dropdown pc-h-item">
                <Dropdown className="align-items-center">
                  <Dropdown.Toggle variant="white" id="dropdown-basic" className="p-0">
                    <Image
                      src={IMAGE_URL + PROFILE_DEMO_IMAGE}
                      alt="User image"
                      className="user-avtar"
                      width={50}
                      height={50}
                    />
                    {/* <Image
                      src={avatarimg}
                      alt="user-image"
                      className="user-avtar"
                      width={50}
                      height={50}
                    /> */}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown p-0">
                    <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                    <Dropdown.Item onClick={() => logoutAction()}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {(moduleAccess?.canKycApproved || moduleAccess?.canPayeeApproved || moduleAccess?.canRedemptionApproved) &&(<li className="dropdown pc-h-item">
                <List onClick={handleShow} className='f-26' />
              </li>) }
            </ul>
          </Col>
        </Row>
      </header>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Approval Tab</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tabs
            defaultActiveKey="profile"
            id="pills-tab"
            className="nav-pills"
            fill
            activeKey={key}
            onSelect={(k: any) => setKey(k)}
          >
           {moduleAccess?.canKycApproved && (<Tab eventKey="kycApproval" title="Kyc">
              <KycPendingApprovalList />
            </Tab>)}
            {moduleAccess?.canPayeeApproved && (<Tab eventKey="payeeApproval" title="Payee">
              <PayeePendingForApproval />
            </Tab>)}
            {moduleAccess?.canRedemptionApproved && (<Tab eventKey="redemptionApproval" title="Redemption">
              <RedemptionForApproval />
            </Tab>) }
          </Tabs>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
})

export default Header
