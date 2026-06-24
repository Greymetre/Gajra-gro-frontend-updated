import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel, ButtonToolbar, ButtonGroup, Form } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare, EyeFill, EyeSlashFill, Pencil, Pentagon, Pen } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendApprovedRedemption, getRejectReasonList, backendDeleteRedemption, backendGetRedemptionInfo, backendPostCustomerStatus, backendRejectRedemption, backendTransferRedemption } from '../../helpers/backend_helper'
import Link from 'next/link'
import editimg from '../../assets/images/auth/edit-3.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { RedemptionDetailViewInterface, initialTransferUpdate } from '../../interfaces/redemption.interface'
import { Formik, useFormik } from 'formik';
import * as yup from "yup";
const schema = yup.object().shape({
  status: yup.string().min(3).required("Status is required"),
  redemptionid: yup.string().required('redemptionid is required'),
  transactionID: yup.string().max(100).required('Transaction ID is required'),
  details: yup.string().max(500).required('details is required'),
});

const RedemptionDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [redemptionInfo, setRedemptionInfo] = useState<RedemptionDetailViewInterface>({ _id: id })
  const [rejectReason, setRejectReason] = useState([])
  const [rejectForm, setRejectForm] = useState(false)
  const [transferForm, setTransferForm] = useState(false)
  const [reason, setReason] = useState('')
  const handleEditRedemption = (user: any) => {
    window.scrollTo(0, 0)
  }
  const redemptionDetail = useSelector((state: any) => state?.redemptions?.redemptions);
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'redemptions.read':
        return { ...acc, canRead: true };
      case 'redemptions.update':
        return { ...acc, canUpdate: true };
      case 'redemptions.delete':
        return { ...acc, canDelete: true };
      case 'redemptions.approver':
        return { ...acc, canApproved: true };
      case 'redemptions.transfer':
        return { ...acc, canTransfered: true };
      default:
        return acc;
    }
  }, {});
  const dispatch = useDispatch();
  const fetchCustomerDetail = async () => {
    await backendGetRedemptionInfo(id).then((res) => {
      if (!res.isError) {
        formik.setFieldValue('redemptionid', res.data._id);
        setRedemptionInfo(res.data)
      }
    })
  }
  const fetchRejectReasonList = async () => {
    await getRejectReasonList().then((res) => {
      if (!res.isError) {
        setRejectReason(res.data)
      }
    })
  }
  useEffect(() => {
    if (id)
      fetchCustomerDetail()
      fetchRejectReasonList()
  }, [id])
  const handleDeleteItem = (id: string) => {
    backendDeleteRedemption(id).then((result) => {
      if (!result.isError) {
        router.push('/redemption');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const handleApprovedRedemption = () => {
    if (window.confirm("Are you sure to approve this redemption?")) {
      backendApprovedRedemption({ redemptionid: id }).then((result) => {
        if (!result.isError) {
          router.push('/redemption');
        }
      }).catch((err) => {

      });
    }
  };

  const handleRejectRedemption = () => {
    if (window.confirm("Are you sure to reject this redemption?")) {
      backendRejectRedemption({ redemptionid: id, reason: reason }).then((result) => {
        if (!result.isError) {
          router.push('/redemption');
        }
      }).catch((err) => {

      });
    }
  };

  const handleBankTransferRedemption = () => {
    if (window.confirm("Are you sure to transfer this redemption?")) {
      backendTransferRedemption({ redemptionid: id, transactionID: '42141214142', details: "This is details", status: "UNDER PROCESS" }).then((result) => {
        if (!result.isError) {
          router.push('/redemption');
        }
      }).catch((err) => {

      });
    }
  };

  const handleTransferUpdate = () => {
    if (window.confirm("Are you sure to transfer this redemption?")) {
      backendTransferRedemption(formik.values).then((result) => {
        if (!result.isError) {
          router.push('/redemption');
        }
      }).catch((err) => {

      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target
    formik.setFieldValue(name, (type === "number") ? parseInt(value) : value);
  }

  const formik = useFormik({
    initialValues: initialTransferUpdate,
    validationSchema: schema,
    onSubmit: handleTransferUpdate,
    enableReinitialize : true
  });

  console.log('values', rejectReason);
  
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/redemption', label: 'RedemptionList' }} itemlabel='Redemption Detail' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">Redemption Details</h3>
            </Col>

          </Row>
        </Col>
        <Col xl={12} sm={12} xs={12}>
          <Card className='prod-p-card bg-white'>
            <Row className='border-top border-top-dashed p-30'>
              <Col xl={6} sm={6} xs={12}>
                <div className="mb-1">
                  <h4 className="mb-0 f-12">Status : {redemptionInfo.status}</h4>
                </div>
              </Col>
              <Col xl={6} sm={6} xs={12}>
                {(redemptionInfo.status === 'Pending' && moduleAccess.canApproved) ? (<>
                  <ButtonGroup className="me-2" aria-label="First group">
                    <Button className="btn-info" onClick={() => { handleApprovedRedemption() }}>Approved</Button>
                    <Button variant="danger" onClick={() => { setRejectForm(true) }} >Reject</Button>
                  </ButtonGroup>
                </>) : null}
                {(redemptionInfo.status === 'Approved' && moduleAccess.canTransfered) ? (
                  <ButtonGroup className="me-2" aria-label="First group">
                    <Button className="btn-info" onClick={() => { handleBankTransferRedemption() }}>Transfer</Button>
                    <Button className="btn-warning" onClick={() => {
                      setTransferForm(true)
                      setRejectForm(false)
                    }} >Transfer Update</Button>
                  </ButtonGroup>) : null}
              </Col>
            </Row>
            {(rejectForm) ? (<Row className='p-20'>
              <Col xl={12} sm={12} xs={12}>
                <Form.Group className="mb-1">
                    <Form.Label htmlFor="Country">Reason To Reject Redemption</Form.Label>
                    <Form.Select aria-label="Select Reason"  name='Reason' value={reason} onChange={(e) => { setReason(e.target.value) }} required={true} autoComplete='off' >
                        <option>Select Reason To Reject</option>
                        { rejectReason.map((item :any, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
              </Col>
              <Col xl={12} sm={12} xs={12}>
                <Button className="p-2 btn-info float-end" onClick={() => handleRejectRedemption()}> Reject</Button>
              </Col>
            </Row>) : null}
            {(transferForm) ? (<Row className='p-20'>
              <Col xl={4} sm={4} xs={4}>
                <Form.Group className="mb-1">
                  <Form.Label htmlFor="status">Status</Form.Label>
                  <Form.Select name='status' defaultValue={formik.values.status} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                    <option>Select Status</option>
                    <option value="Success">Success</option>
                    <option value="Fail">Fail</option>
                  </Form.Select>
                  {formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xl={4} sm={4} xs={4}>
                <Form.Group className="form-group">
                  <Form.Label>TransactionID</Form.Label>
                  <Form.Control
                    type="text"
                    name="transactionID"
                    onChange={handleInputChange}
                    value={formik.values.transactionID}
                    onBlur={formik.handleBlur}
                    required={true}
                    autoComplete='off'
                    placeholder='Transaction ID'
                  />
                  {formik.errors.transactionID && (
                    <div className="text-danger">{formik.errors.transactionID}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xl={6} sm={6} xs={6}>
                <Form.Group className="form-group">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    type="text"
                    name="details"
                    as="textarea"
                    onChange={handleInputChange}
                    value={formik.values.details}
                    onBlur={formik.handleBlur}
                    required={true}
                    autoComplete='off'
                    placeholder='Detail'
                  />
                  {formik.errors.details && (
                    <div className="text-danger">{formik.errors.details}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xl={12} sm={12} xs={12}>
                <Button className="p-2 btn-sm btn-dark float-end"
                  disabled={!formik.isValid}
                  onClick={() => {
                    if (formik.isValid) {
                      formik.handleSubmit();
                    } else {
                      console.log("is invalid", !formik.isValid);
                    }
                  }}> Save</Button>
              </Col>
            </Row>) : null}
            <Row className='border-top border-top-dashed'>
              <Col xl={12} sm={12} xs={12}>
                <Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Firm Name</p>
                      <span className="text-muted f-14">{redemptionInfo?.firmName}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Points</p>
                      <span className="text-muted f-14">{redemptionInfo?.points}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={6}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Status</p>
                      <span className="text-muted f-14">{redemptionInfo?.status}</span>
                    </div>
                  </Col>
                </Row>
                <Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Contact Person</p>
                      <span className="text-muted f-14">{redemptionInfo?.contactPerson}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Mobile</p>
                      <span className="text-muted f-14">{redemptionInfo?.mobile}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={6}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Address</p>
                      <span className="text-muted f-14">{redemptionInfo?.address}</span>
                    </div>
                  </Col>
                </Row>
                {(redemptionInfo?.accountNo) ? (<Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Account</p>
                      <span className="text-muted f-14">{redemptionInfo?.accountNo}</span>
                      <br />
                      <span className="text-muted f-14">{redemptionInfo?.holderName}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Bank</p>
                      <span className="text-muted f-14">{redemptionInfo?.bankName}</span> <br />
                      <span className="text-muted f-14">{redemptionInfo?.ifsc}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Amount</p>
                      <span className="text-muted f-14">{redemptionInfo?.amount}</span>
                    </div>
                  </Col>
                </Row>) : null}
                {(redemptionInfo?.upiNumber) ? (<Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">UPI Number</p>
                      <span className="text-muted f-14">{redemptionInfo?.upiNumber}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Amount</p>
                      <span className="text-muted f-14">{redemptionInfo?.amount}</span>
                    </div>
                  </Col>
                </Row>) : null}
                {(redemptionInfo?.approvedAt) ? (<Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Approved Date</p>
                      <span className="text-muted f-14">{redemptionInfo?.approvedAt ? new Date(redemptionInfo?.approvedAt).toISOString().split('T')[0] : ''}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Approved By</p>
                      <span className="text-muted f-14">{redemptionInfo?.approverName}</span>
                    </div>
                  </Col>
                </Row>) : null}
                {(redemptionInfo?.rejectedAt) ? (<Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Rejected Date</p>
                      <span className="text-muted f-14">{redemptionInfo?.rejectedAt ? new Date(redemptionInfo?.rejectedAt).toISOString().split('T')[0] : ''}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Rejected By</p>
                      <span className="text-muted f-14">{redemptionInfo?.rejectedName}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Reject Reason</p>
                      <span className="text-muted f-14">{redemptionInfo?.reason}</span>
                    </div>
                  </Col>
                </Row>) : null}
                {(redemptionInfo?.paymentDate ) ? (<><Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Paid Date</p>
                      <span className="text-muted f-14">{redemptionInfo?.paymentDate ? new Date(redemptionInfo?.paymentDate).toISOString().split('T')[0] : ''}</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Transfer By</p>
                      <span className="text-muted f-14">{redemptionInfo?.transferName ? redemptionInfo?.transferName : redemptionInfo?.fundSource  }</span>
                    </div>
                  </Col>
                  <Col xl={4} sm={4} xs={12}>
                    <div className="mb-1">
                      <p className="mb-0 f-14">Transaction ID</p>
                      <span className="text-muted f-14">{redemptionInfo?.transactionID}</span>
                    </div>
                  </Col>
                 
                </Row> </>) : null}
                {redemptionInfo?.details && <Row className='align-items-start card-body'>
                  <Col xl={4} sm={4} xs={12}>
                   <div className="mb-1">
                     <p className="mb-0 f-14">Details</p>
                     <span className="text-muted f-14">{redemptionInfo?.details}</span>
                   </div>
                 </Col>
                </Row>
                  
                }
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default RedemptionDetail

