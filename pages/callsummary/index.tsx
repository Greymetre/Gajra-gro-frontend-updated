import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Form, Spinner } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllCallSummary, backendDeleteCallSummary } from '../../helpers/backend_helper'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import * as XLSX from 'xlsx';
import { CallSummaryInterface } from '../../interfaces/callsummary.interface';
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface';

const CallSummary = React.forwardRef((props, ref) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [callsummaryData, setCallSummaryData] = useState<Array<CallSummaryInterface>>([])
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const callsummaryList = useSelector((state: any) => state?.callsummary?.callsummary);
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
  const dispatch = useDispatch();
  const fetchCallSummary = async () => {
    await backendGetAllCallSummary(paginationData).then((res) => {
      const { docs, paginate } = res.data
      let totalData = Array.isArray(paginate) && paginate.length && paginate[0].totalDocs
      let totalPages = Math.ceil(totalData / paginationData.recordPerPage)
      setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: (totalPages) ? totalPages : 1 })
      setCallSummaryData(docs)   
      setIsLoading(false)   
    })
  }
  useEffect(() => {
    setIsLoading(true)
    fetchCallSummary()
  }, [paginationData])

  const handleDeleteItem = (id: string) => {
    backendDeleteCallSummary(id).then((result) => {
      if (!result.isError) {
        fetchCallSummary()
        // router.push('/callsummary');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(callsummaryData.map(async (item: any) => {
      item.createdAt = (item.createdAt) ? new Date(item.createdAt).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
      }) : ''
      return item
    }))
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "callsummary.xlsx");
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='CallSummary List' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={3}>
              <h3 className="card-body">CallSummary List({resPaginateData.totalDocs})</h3>
            </Col>
            <Col md={2}>
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
            <Col md={4} className="text-end mb-3">
            {moduleAccess?.canExport && <Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export</Button>}
            {moduleAccess?.canCreate &&  <Link href={{ pathname: '/callsummary/create', }}>
                <Button className="m-r-5" variant="dark"><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> CallSummary</Button>
              </Link> }
              {/* <Button variant="dark"><Image src={IMAGE_URL + WHITE_FILTER_IMAGE} /> Filters</Button> */}
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
                              <th>#</th>
                              <th>Firm Name</th>
                              <th>Contact Person</th>
                              <th>Call Type</th>
                              <th>Summary</th>
                              <th>Call Status</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(callsummaryData) && callsummaryData.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.userid}</td>
                                  <td className="text-black">
                                    <Link className="mb-2"
                                      href={{
                                        pathname: '/callsummary/' + item._id,
                                      }}
                                    >
                                      {item.firmName}
                                    </Link></td>
                                    <td className="text-black">
                                    {item.contactPerson}</td>
                                  <td>{item.callType}</td>
                                  <td>{item.summary}</td>
                                  <td>{item.callStatus}</td>
                                  <td>{item.createdAt}</td>
                                  <td>
                                  { moduleAccess?.canUpdate &&<Link className="pt-2"
                                      href={{
                                        pathname: '/callsummary/create',
                                        query: { id: item._id },
                                      }}><Button className="p-0" variant="outline-light"><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></Button></Link> }
                                  { moduleAccess?.canDelete &&  <Button className="p-2" variant="outline-light" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></Button> }
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                        {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
                        <Col xl={12} sm={12} xs={12} className='mb-3 text-end'>
                          <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end">
                            <li className={`page-item ${paginationData.currentPage === 1 ? 'disabled' : ''}`}>
                              <a className="page-link" onClick={() => {
                                setPaginationData({ ...paginationData, currentPage: paginationData.currentPage -1 })
                                  router.push(`/callsummary/?page=${paginationData.currentPage -1}`);
                                }
                                }>Previous</a>
                            </li>
                            <li className={`page-item ${paginationData.currentPage === resPaginateData.totalPages ? 'disabled' : ''}`}>
                              <a className="page-link" 
                                onClick={() => {
                                  setPaginationData({ ...paginationData, currentPage: paginationData.currentPage + 1 })
                                  router.push(`/callsummary/?page=${paginationData.currentPage + 1}`);
                                }
                                }>Next</a>
                            </li>
                          </ul>
                        </nav>
                      </Col>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
})
export default CallSummary
