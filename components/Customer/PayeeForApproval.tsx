import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { backendCustomerPendingPayeeList } from '../../helpers/backend_helper'
import { Button, Col, Row, Table, Image } from 'react-bootstrap'
import Link from 'next/link'
import { CustomerInfoInterface } from '../../interfaces/customer.interface';
const PayeeForApproval = () => {
  const router = useRouter()
  const [payeeData, setPayeeData] = useState<Array<CustomerInfoInterface>>([])
  const fetchCustomerPendingPayeeList = async () => {
    await backendCustomerPendingPayeeList({}).then((res) => {
      if (res.isError == false) {
        setPayeeData(res.data)
      }
    })
  }
  useEffect(() => {
    fetchCustomerPendingPayeeList()
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
                  {Array.isArray(payeeData) && payeeData.map((item, index) => {
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

export default PayeeForApproval