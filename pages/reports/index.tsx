import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Form } from 'react-bootstrap'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendOtpLogReport } from '../../helpers/backend_helper'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import * as XLSX from 'xlsx';
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface';
import { ReportOtpRequestInterface } from '../../interfaces/reports.interface';

const Reports = React.forwardRef((props, ref) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
  }, [])
  
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Transaction List' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={4}>
              <h3 className="card-body">Reports</h3>
            </Col>
            <Card className="flat-card p-0">
              <div className="row-table">
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive">
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
export default Reports
