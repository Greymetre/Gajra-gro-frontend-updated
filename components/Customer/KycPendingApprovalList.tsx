import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { backendCustomerListStatus } from '../../helpers/backend_helper'
import { Button, Col, Row, Table, Image } from 'react-bootstrap'
import Link from 'next/link'
import { CustomerInfoInterface } from '../../interfaces/customer.interface';
const KycPendingApprovalList = () => {
  const router = useRouter()
  const [customerData, setCustomerData] = useState<Array<CustomerInfoInterface>>([])
  const fetchCustomerList = async () => {
    const iData = { status: ["Pending"], search: "" }
    await backendCustomerListStatus(iData).then((res) => {
      if (res.isError == false) {
        setCustomerData(res.data)
      }
    })
  }
  useEffect(() => {
    fetchCustomerList()
  }, [])

  return (
    <Row>
      <div className="row-table">
        <Col sm={12} md={12}>
          <div className="card1">
            <div className="table-border-style">
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Firm Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(customerData) && customerData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{(item.createdAt) ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            year: 'numeric',
                            month: '2-digit',
                            day: 'numeric'
                          }) : ''}</td>
                          <td><Link className="mb-3"
                            href={{
                              pathname: '/customer/' + item._id,
                            }}
                          >{item.firmName}</Link></td>
                        </tr>
                      )
                    })
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </Row>
  )
}

export default KycPendingApprovalList