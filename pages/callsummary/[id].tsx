import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare, EyeFill, EyeSlashFill, Pencil, Pentagon, Pen } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetCallSummary, backendDeleteCallSummary} from '../../helpers/backend_helper'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CallSummaryInterface, initialCallSummary,  } from '../../interfaces/callsummary.interface'
const CallSummaryInfo = () => {
  const router = useRouter()
  const { id } = router.query
  const [callsummaryInfo, setCallSummaryInfo] = useState<CallSummaryInterface>(initialCallSummary)
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'callsummary.read':
        return { ...acc, canRead: true };
      case 'callsummary.update':
        return { ...acc, canUpdate: true };
      case 'callsummary.delete':
        return { ...acc, canDelete: true };
      case 'callsummary.create':
        return { ...acc, canCreate: true };
      case 'callsummary.export':
        return { ...acc, canExport: true };
      case 'callsummary.import':
        return { ...acc, canImport: true };

      default:
        return acc;
    }
  }, {});
  const [callsummaryStatus, setCallSummaryStatus] = useState(true)
  const fetchCustomerDetail = async () => {
    await backendGetCallSummary(id).then((res) => {
      if (!res.isError) {
        setCallSummaryInfo(res.data)
      }
    })
  }
  useEffect(() => {
    fetchCustomerDetail()
  }, [])
  const handleDeleteItem = (id: string) => {
    backendDeleteCallSummary(id).then((result) => {
      if (!result.isError) {
        router.push('/callsummary');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/callsummary', label: 'CallSummaryList' }} itemlabel='CallSummary Profile' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">CallSummary Details</h3>
            </Col>

          </Row>
        </Col>


        <Card className="flat-card">
          <Row>
            <Col xl={12} sm={12} xs={12} className="border-end border-end-dashed">

              <Row className='border-top border-top-dashed'>
                <Col xl={12} sm={12} xs={12}>
                  <Row className='align-items-start card-body'>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Firm Name</p>
                        <span className="text-muted ">{callsummaryInfo.firmName}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Contact Person</p>
                        <span className="text-muted ">{callsummaryInfo.contactPerson}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">User Name</p>
                        <span className="text-muted ">{callsummaryInfo.userName}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                     { moduleAccess.canDelete && <div className="btn  btn-dark">
                        <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(callsummaryInfo._id) }} >
                          <XSquare className="f-14" />Delete</a>
                      </div> }
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='border-top border-top-dashed'>
                <Col xl={12} sm={12} xs={12}>
                  <Row className='align-items-start card-body'>

                    <Col xl={4} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Call Type</p>
                        <span className="text-muted ">{callsummaryInfo.callType}</span>
                      </div>
                    </Col>
                    <Col xl={4} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Call Status</p>
                        <span className="text-muted ">{callsummaryInfo.callStatus}</span>
                      </div>
                    </Col>
                    <Col xl={4} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Date</p>
                        <span className="text-muted ">{callsummaryInfo.createdAt}</span>
                      </div>
                    </Col>
                    <Col xl={12} sm={12} xs={12}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Summary</p>
                        <span className="text-muted ">{callsummaryInfo.summary}</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </Col>
          </Row>

        </Card>


      </Row>
    </Layout>
  );
}

export default CallSummaryInfo

