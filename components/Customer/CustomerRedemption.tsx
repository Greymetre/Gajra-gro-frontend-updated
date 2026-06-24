import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { backendCustomersAllRedemption } from '../../helpers/backend_helper'
import { RedemptionDetailViewInterface } from '../../interfaces/redemption.interface'
import { Button, Col, Row, Table, Image } from 'react-bootstrap'
import Link from 'next/link'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE } from '../../utils/constant';
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface';
import * as XLSX from 'xlsx';
const CustomerRedemptionList = ({ customerid }: { customerid: any }) => {
  const router = useRouter()
  const [redemptionData, setRedemptionData] = useState<Array<RedemptionDetailViewInterface>>([])
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const fetchCustomerBankDetail = async () => {
    await backendCustomersAllRedemption({ customerid: customerid }).then((res) => {
      if (res.isError == false) {
        setRedemptionData(res.data)
      }
    })
  }
  useEffect(() => {
    if (customerid)
      fetchCustomerBankDetail()
  }, [customerid])

  const handleOnExport = async() => {
    const mappedArray = await Promise.all(redemptionData.map(async (redemption: any) => {
      redemption.createdAt = (redemption.createdAt) ? new Date(redemption.createdAt).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
      }) : ''
      return redemption
    }))
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "redemption.xlsx");
  }
  return (<>
    <Row>
      <Col md={12} className='text-end'>
        <div className="card-body">
          <Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <div className="row-table">
        <Col sm={12} md={12}>
          <div className="card1">
            <div className="table-border-style">
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Points</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(redemptionData) && redemptionData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.refno}</td>
                          <td>{item.createdAt}</td>
                          <td>{item.points}</td>
                          <td>{item.type}</td>
                          <td>{item.status}</td>
                          <td></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
                <Col xl={12} sm={12} xs={12} className='text-end'>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                      <li className={`page-item ${paginationData.currentPage === 1 ? 'disabled' : ''}`}>
                        <a className="page-link" onClick={() => {
                          setPaginationData({ ...paginationData, currentPage: paginationData.currentPage - 1 })
                          router.push(`/redemption/?page=${paginationData.currentPage - 1}`);
                        }
                        }>Previous</a>
                      </li>

                      <li className={`page-item ${paginationData.currentPage === resPaginateData.totalPages ? 'disabled' : ''}`}>
                        <a className="page-link"
                          onClick={() => {
                            setPaginationData({ ...paginationData, currentPage: paginationData.currentPage + 1 })
                            router.push(`/redemption/?page=${paginationData.currentPage + 1}`);
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
    </Row>
  </>
  )
}

export default CustomerRedemptionList