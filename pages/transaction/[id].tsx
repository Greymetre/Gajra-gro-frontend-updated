import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Carousel } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare, EyeFill, EyeSlashFill, Pencil, Pentagon, Pen } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteCustomer, backendDeleteTransaction, backendGetAllTransactions, backendGetCustomerInfo, backendGetTransactionInfo, backendPostCustomerStatus, backendPostTransactionStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { TransactionDetailViewInterface } from '../../interfaces/transaction.interface'
const TransactionDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [transactionInfo, setTransactionInfo] = useState<TransactionDetailViewInterface>({
    _id: id,
    packingList: '', // Provide a default value for packingList as a string
    // Add other required properties with default values if needed
  })
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'transactions.read':
        return { ...acc, canRead: true };
      case 'transactions.update':
        return { ...acc, canUpdate: true };
      case 'transactions.delete':
        return { ...acc, canDelete: true };
      case 'transactions.create':
        return { ...acc, canCreate: true };
      case 'transactions.export':
        return { ...acc, canExport: true };
      case 'transactions.import':
        return { ...acc, canImport: true };

      default:
        return acc;
    }
  }, {});
  const [transactionStatus, setTransactionStatus] = useState(true)
  const fetchCustomerDetail = async () => {
    await backendGetTransactionInfo(id).then((res) => {
      if (!res.isError) {
        setTransactionInfo(res.data)
      }
    })
  }
  useEffect(() => {
    fetchCustomerDetail()
  }, [])
  const handleDeleteItem = (id: string) => {
    backendDeleteTransaction(id).then((result) => {
      if (!result.isError) {
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const activeInactiveTransaction = () => {
    var iData = { transactionid: id, active: (transactionStatus) ? "true" : "false" }
    backendPostTransactionStatus(iData).then((result) => {
      if (!result.isError) {
      }
      else {

      }
    }).catch((err) => {

    });
  }




  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/transaction', label: 'TransactionList' }} itemlabel='Transaction Profile' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">Transaction Details</h3>
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

                        <span className="text-muted ">{transactionInfo.firmName}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Points</p>

                        <span className="text-muted ">{transactionInfo.points}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">Coupon</p>

                        <span className="text-muted ">{transactionInfo.coupon}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                     { moduleAccess.canDelete && <div className="btn  btn-dark">
                        <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(transactionInfo._id) }} >
                          <XSquare className="f-14" />Delete</a>
                      </div> }
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='border-top border-top-dashed'>
                <Col xl={12} sm={12} xs={12}>
                  <Row className='align-items-start card-body'>

                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">TransactionType</p>
                        <span className="text-muted ">{transactionInfo.transactionType}</span>
                      </div>
                    </Col>
                    <Col xl={3} sm={4} xs={6}>
                      <div className="mb-2">
                        <p className="mb-0 f-12">PointType</p>

                        <span className="text-muted ">{transactionInfo.pointType}</span>
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

export default TransactionDetail

