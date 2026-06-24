import { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Image, Form, Tabs, Tab } from 'react-bootstrap'
import { Tools, PersonVcardFill, Download, QrCode, QrCodeScan, GiftFill, UpcScan, 
CurrencyExchange, ExclamationCircleFill, PatchExclamationFill, CurrencyRupee, CartCheckFill, PersonCheckFill } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetDashboards } from '../../helpers/backend_helper'
import { IMAGE_URL, CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EDIT_WHITE_DEMO_IMAGE, SHOPPING_BAG_IMAGE, SHOP_ALT_IMAGE, USER_ALT_IMAGE, SHOP_EARN_POINT_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant'
import Link from 'next/link'
import { DashboardCouponInterface, DashboardCustomerInterface, DashboardRedemptionInterface, DashboardTransactionInterface } from '../../interfaces/dashboard.interface'
export default function Dashboard() {
  const [customerDashboardData, setCustomerDashboardData] = useState<DashboardCustomerInterface>({})
  const [pointDashboardData, setPointDashboardData] = useState<DashboardTransactionInterface>({})
  const [pendingApprovalData, setPendingApprovalData] = useState<DashboardRedemptionInterface>({})
  const [approvedRedemptionData, setApprovedRedemptionData] = useState<DashboardRedemptionInterface>({})
  const [redeemptionData, setRedemptionData] = useState<DashboardRedemptionInterface>({})
  const [couponData, setCouponData] = useState<DashboardCouponInterface>({})
  const [redemptionSuccess, setRedemptionSuccess] = useState(0)

  const [activeCustomers, setActiveCustomers] = useState(0)
  const [currentCustomerType, setCurrentCustomerType] = useState("Mechanic")
 const resetdata = () => {
  setCustomerDashboardData({})
  setPointDashboardData({})
  setPendingApprovalData({})
  setApprovedRedemptionData({})
  setRedemptionData({})
  setCouponData({})
  setRedemptionSuccess(0)
  setActiveCustomers(0)

 }
  const fetchCustomers = async () => {
    resetdata()
    await backendGetDashboards(currentCustomerType).then((res :any) => { 
      if (!res.isError) {
        const { customers , transactions, pendingApproval, approvedRedeemption, redeemptions, coupons, activeCustomers , successRedemption } = res.data
        setCustomerDashboardData(customers)
        setPointDashboardData(transactions)
        setPendingApprovalData(pendingApproval)
        setApprovedRedemptionData(approvedRedeemption)
        setRedemptionData(redeemptions)
        setCouponData(coupons)
        setActiveCustomers(activeCustomers)
        setRedemptionSuccess(successRedemption?.totalPoints)
      }
    })
  }
  useEffect(() => {
    fetchCustomers()
  }, [currentCustomerType])

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: '/dashboard', label: currentCustomerType }}
        secondItem={{ href: '', label: '' }}
        itemlabel="Dashboard"

      />
      <Row className='py-4' >
        <Col className='text-start' >
      <Button className={`${currentCustomerType == "Mechanic" ? "btn btn-dark me-2"  :  'me-2 btn btn-outline-dark border border-dark' } `} onClick={() => {setCurrentCustomerType("Mechanic") ;resetdata() }}  >Mechanic</Button>
      <Button className={`${currentCustomerType == "Retailer" ? "btn btn-dark me-2"  :  'me-2 btn btn-outline-dark border border-dark' } `}  onClick={() => {setCurrentCustomerType("Retailer"); resetdata()}} >Retailer</Button>
      </Col>
      </Row>
      <Row>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <Tools size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total {currentCustomerType}</h6>
                  <h3 className="m-b-0 text-dark">{ (customerDashboardData.totalCount) ? customerDashboardData.totalCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <PersonVcardFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Self Registrations</h6>
                  <h3 className="m-b-0 text-dark">{ (customerDashboardData.selfRegistrations) ? customerDashboardData.selfRegistrations : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <Download size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total App Downloads</h6>
                  <h3 className="m-b-0 text-dark">{ (customerDashboardData.loginCount) ? customerDashboardData.loginCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <QrCode size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">QR Codes Generated</h6>
                  <h3 className="m-b-0 text-dark">{ (couponData.totalCount) ? couponData.totalCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <QrCodeScan size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">QR Codes Scaned</h6>
                  <h3 className="m-b-0 text-dark">{(pointDashboardData.scannedCount) ? pointDashboardData.scannedCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <PersonCheckFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Active {currentCustomerType}</h6>
                  <h3 className="m-b-0 text-dark">{(activeCustomers) ? activeCustomers : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    
      <Row>
      {
        currentCustomerType  == "Mechanic" && 
       <>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                  <GiftFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Welcome Points</h6>
                  <h3 className="m-b-0 text-dark">{(pointDashboardData.welcomePoints) ? pointDashboardData.welcomePoints : 0  }</h3>
                </Col>
              </Row>
      
            </Card.Body>
          </Card>
        </Col>
        </>

      }
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <UpcScan size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Scanned Points</h6>
                  <h3 className="m-b-0 text-dark">{(pointDashboardData.scannedPoints) ? pointDashboardData.scannedPoints : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <CurrencyExchange size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Points</h6>
                  <h3 className="m-b-0 text-dark">{(pointDashboardData.totalPoints) ? pointDashboardData.totalPoints : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {
          currentCustomerType == "Retailer" && <>
            <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <CartCheckFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Redemptions</h6>
                  <h3 className="m-b-0 text-dark">{(redeemptionData.totalCount) ? redeemptionData.totalCount : 0 }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
          </>
        }
      </Row>
      <Row>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <ExclamationCircleFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Redemptions Pending Approvals</h6>
                  <h3 className="m-b-0 text-dark">{ (pendingApprovalData.totalCount) ? pendingApprovalData.totalCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <PatchExclamationFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Redemptions Pending For Transfers</h6>
                  <h3 className="m-b-0 text-dark">{ (approvedRedemptionData.totalCount) ? approvedRedemptionData.totalCount : 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <CurrencyRupee size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Redeemed Points</h6>
                  <h3 className="m-b-0 text-dark">{(redeemptionData.totalPoints) ? redeemptionData.totalPoints : 0 }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {
          currentCustomerType == "Mechanic" && 
        
        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <CartCheckFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Redemptions</h6>
                  <h3 className="m-b-0 text-dark">{(redeemptionData.totalCount) ? redeemptionData.totalCount : 0 }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
}

        <Col xl={4} sm={6} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Card.Body className='p-20'>
              <Row className='align-items-center'>
                <Col xl={3} sm={3} xs={3}>
                <GiftFill size={48} color='gray'/>
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Redemptions Success</h6>
                  <h3 className="m-b-0 text-dark">{redemptionSuccess || 0  }</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}
