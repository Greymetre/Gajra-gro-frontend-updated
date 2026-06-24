import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Form, Spinner, InputGroup } from 'react-bootstrap'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendOtpLogReport, backendNewOtpRequest } from '../../helpers/backend_helper'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import * as XLSX from 'xlsx';
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface';
import { ReportOtpRequestInterface } from '../../interfaces/reports.interface';
import { Formik, FormikHelpers, useFormik, useFormikContext } from 'formik';
import * as yup from "yup";

const schema = yup.object().shape({
  mobile: yup.string().min(10, 'Enter valid Mobile No').max(10, 'Enter valid Mobile No').required('mobile is required'),
});

const OtpRequest = React.forwardRef((props, ref) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const [otpData, setOTPData] = useState<Array<ReportOtpRequestInterface>>([])
  const fetchOtpLogReport = async () => {
    await backendOtpLogReport(paginationData).then((res) => {
      const { docs, paginate } = res.data
      let totalData = Array.isArray(paginate) && paginate.length && paginate[0].totalDocs
      setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: Math.ceil(totalData / paginationData.recordPerPage) })
      setOTPData(docs)
      setIsLoading(false)
    })
  }
  useEffect(() => {
    fetchOtpLogReport()
  }, [paginationData, isSubmitting])

  const handleOnExport = async () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(otpData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "otps.xlsx");
  }

  const handleFormSubmit = async () => {
    try {
      backendNewOtpRequest(formik.values).then((result) => {
        if (!result.isError) {
          setIsSubmitting(true)
        }
      }).catch((err) => {

      });
    }
    catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: { mobile: '' },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: handleFormSubmit
  });
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Transaction List' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
          <Col sm={6}> </Col>
          <Col sm={6}>
              <Form.Group>
                <Form.Label>
                  Mobile
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="number"
                    name="mobile"
                    onChange={(e) => {
                      setIsSubmitting(false)
                      formik.setFieldValue('mobile', e.target.value);
                    }}
                    value={formik.values.mobile}
                    required={true}
                    autoComplete="off"
                    placeholder="Enter Mobile"
                  />
                  <InputGroup.Text className='bg-light'>
                    <Button className="btn btn-dark"
                      disabled={!(formik.isValid && formik.dirty)}
                      onClick={() => {
                        if (formik.isValid) {
                          formik.setSubmitting(true)
                          formik.handleSubmit();
                        }
                      }}>Send OTP </Button>

                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <h3 className="card-body">OTPRequest List({resPaginateData.totalDocs})</h3>
            </Col>
            <Col md={3}>
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label className='p-2'>Show</Form.Label>
                <Form.Select value={paginationData.recordPerPage} onChange={(e: any) => { setPaginationData({ ...paginationData, recordPerPage: e.target.value }) }}>
                  <option value={100}>{100}</option>
                  <option value={200}>{200}</option>
                  <option value={500}>{500}</option>
                  <option value={1000}>{1000}</option>
                  <option value={2000}>{2000}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className='text-end'>
              <Form.Group className="form-group">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => { setPaginationData({ ...paginationData, search: e.target.value }) }}
                  value={paginationData.search}
                  autoComplete='off'
                  placeholder='Search'
                />
              </Form.Group>
            </Col>
            <Col md={1} className="text-end mb-3">
              <Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export</Button>
            </Col>
            <Card className="flat-card p-0">
              <div className="row-table">
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              {/* <th>#</th> */}
                              <th>Date</th>
                              <th>Mobile</th>
                              <th>OTP</th>
                              <th>Firm Name</th>
                              <th>Contact Person</th>
                              <th>State</th>
                              <th>City</th>
                              <th>Login Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(otpData) && otpData.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.createdAt}</td>
                                  <td className="text-black">
                                    {item.mobile}
                                  </td>
                                  <td className="text-black">
                                    {item.otp}
                                  </td>
                                  <td>{item.firmName}</td>
                                  <td>{item.contactPerson}</td>
                                  <td>{item.state}</td>
                                  <td>{item.city}</td>
                                  <td>{item.loginAt}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                        <Row>
                          <Col xl={12} sm={12} xs={12} className='mb-3 text-end'>
                            <nav aria-label="Page navigation example">
                              <ul className="pagination justify-content-end">
                                <li className={`page-item ${paginationData.currentPage === 1 ? 'disabled' : ''}`}>
                                  <a className="page-link" onClick={() => {
                                    setPaginationData({ ...paginationData, currentPage: paginationData.currentPage - 1 })
                                    router.push(`/reports/otprequest/?page=${paginationData.currentPage - 1}`);
                                  }
                                  }>Previous</a>
                                </li>

                                <li className={`page-item ${paginationData.currentPage === resPaginateData.totalPages ? 'disabled' : ''}`}>
                                  <a className="page-link"
                                    onClick={() => {
                                      setPaginationData({ ...paginationData, currentPage: paginationData.currentPage + 1 })
                                      router.push(`/reports/otprequest/?page=${paginationData.currentPage + 1}`);
                                    }
                                    }>Next</a>
                                </li>
                              </ul>
                            </nav>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
                {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
              </div>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
})
export default OtpRequest
