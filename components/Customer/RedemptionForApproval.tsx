import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { backendGetPendingRedemption } from '../../helpers/backend_helper'
import { Button, Col, Row, Table, Image } from 'react-bootstrap'
import Link from 'next/link'
import { RedemptionInfoInterface } from '../../interfaces/redemption.interface';
const RedemptionForApproval = () => {
  const router = useRouter()
  const [redemptionData, setRedemptionData] = useState<Array<RedemptionInfoInterface>>([])
  const fetchCustomerBankDetail = async () => {
    await backendGetPendingRedemption({}).then((res) => {
      if (res.isError == false) {
        setRedemptionData(res.data)
      }
    })
  }
  useEffect(() => {
    fetchCustomerBankDetail()
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
                      <th>Points</th>
                      <th>Date</th>
                      <th>Firm Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(redemptionData) && redemptionData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td><Link className="mb-3"
                            href={{
                              pathname: '/redemption/' + item._id,
                            }}
                          >{item.points}</Link></td>
                          <td>{(item.createdAt) ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            year: 'numeric',
                            month: '2-digit',
                            day: 'numeric'
                          }) : ''}</td>
                          <td><Link className="mb-3"
                            href={{
                              pathname: '/customer/' + item.customerid,
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

export default RedemptionForApproval