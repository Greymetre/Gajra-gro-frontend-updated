import React, { useEffect, useState } from 'react'
import { Alert, Badge, Button, Form, Image, InputGroup, Spinner, Table } from 'react-bootstrap'
import { Phone, Search, Send, X } from 'react-bootstrap-icons'
import Layout from '../../components/Layout'
import PaginationNav from '../../components/Common/PaginationNav'
import { backendOtpLogReport, backendNewOtpRequest } from '../../helpers/backend_helper'
import { EXCEL_DEMO_IMAGE, IMAGE_URL } from '../../utils/constant'
import * as XLSX from 'xlsx'
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface'
import { ReportOtpRequestInterface } from '../../interfaces/reports.interface'

const formatDate = (value?: any) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return String(value)
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const OtpRequest = React.forwardRef((props, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const [otpData, setOTPData] = useState<Array<ReportOtpRequestInterface>>([])
  const [mobile, setMobile] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  // search box text; the list reloads 400 ms after typing stops
  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationData((prev) => (prev.search === searchText ? prev : { ...prev, currentPage: 1, search: searchText }))
    }, 400)
    return () => clearTimeout(timer)
  }, [searchText])

  const fetchOtpLogReport = async () => {
    setIsLoading(true)
    try {
      const res = await backendOtpLogReport(paginationData)
      const { docs, paginate } = res.data
      const totalData = (Array.isArray(paginate) && paginate.length && paginate[0].totalDocs) || 0
      setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: Math.ceil(totalData / paginationData.recordPerPage) })
      setOTPData(Array.isArray(docs) ? docs : [])
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchOtpLogReport()
  }, [paginationData])

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(otpData)
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, 'otps.xlsx')
  }

  const mobileValid = /^\d{10}$/.test(mobile)
  const handleSendOtp = async () => {
    if (!mobileValid) return
    setIsSending(true)
    setSendStatus(null)
    try {
      const result = await backendNewOtpRequest({ mobile })
      if (!result?.isError) {
        setSendStatus({ type: 'success', text: `OTP sent to ${mobile}.` })
        setMobile('')
        fetchOtpLogReport()
      } else {
        setSendStatus({ type: 'danger', text: result.message || 'OTP could not be sent.' })
      }
    } catch (error: any) {
      setSendStatus({ type: 'danger', text: error?.response?.data?.message || 'OTP could not be sent.' })
    } finally {
      setIsSending(false)
    }
  }

  const total = Number(resPaginateData.totalDocs) || 0
  const perPage = Number(paginationData.recordPerPage) || 100
  const from = total ? (paginationData.currentPage - 1) * perPage + 1 : 0
  const to = Math.min(paginationData.currentPage * perPage, total)

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">OTP Log</h3>
          <div className="text-muted small">{total.toLocaleString('en-IN')} OTP requests{paginationData.search ? ' match the search' : ''}</div>
        </div>
        <Button className="cd-btn cd-btn-outline" onClick={handleOnExport} title="Exports the rows on this page">
          <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
        </Button>
      </div>

      <div className="tx-card mb-3">
        <div className="fw-semibold mb-1">Send OTP</div>
        <div className="small text-muted mb-2">Sends a login OTP to a customer's mobile number.</div>
        {sendStatus ? (
          <Alert variant={sendStatus.type} className="py-2" dismissible onClose={() => setSendStatus(null)}>{sendStatus.text}</Alert>
        ) : null}
        <InputGroup style={{ maxWidth: 420 }}>
          <InputGroup.Text><Phone /></InputGroup.Text>
          <Form.Control
            inputMode="numeric"
            value={mobile}
            onChange={(e) => { setSendStatus(null); setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendOtp() }}
            autoComplete="off"
            placeholder="10 digit mobile number"
            isInvalid={!!mobile && !mobileValid}
          />
          <Button variant="dark" disabled={!mobileValid || isSending} onClick={handleSendOtp}>
            {isSending ? <Spinner animation="border" size="sm" /> : <Send />} Send OTP
          </Button>
        </InputGroup>
        {mobile && !mobileValid ? <div className="small text-danger mt-1">Enter a 10 digit mobile number</div> : null}
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <InputGroup className="tx-search">
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoComplete="off"
              placeholder="Search mobile, firm, contact person…"
            />
            {searchText ? <Button variant="outline-secondary" onClick={() => setSearchText('')} title="Clear search"><X /></Button> : null}
          </InputGroup>
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>Requested</th>
                <th>Mobile</th>
                <th>OTP</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Login</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : otpData.length ? (
                otpData.map((item: any, index: number) => (
                  <tr key={item._id || index}>
                    <td className="text-nowrap">{formatDate(item.createdAt) || '-'}</td>
                    <td className="fw-semibold text-nowrap">{item.mobile || '-'}</td>
                    <td><span className="otp-code">{item.otp || '-'}</span></td>
                    <td>
                      <div className="tx-firm">{item.firmName || <span className="text-muted fw-normal">Not registered</span>}</div>
                      {item.contactPerson ? <div className="tx-sub">{item.contactPerson}</div> : null}
                    </td>
                    <td>{[item.city, item.state].filter(Boolean).join(', ') || '-'}</td>
                    <td className="text-nowrap">
                      {item.loginAt
                        ? <><Badge bg="success" className="rd-status">Logged in</Badge><div className="tx-sub">{formatDate(item.loginAt)}</div></>
                        : <Badge bg="light" text="dark" className="border rd-status">Not used</Badge>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center text-muted py-5">No OTP requests found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <span>Showing {from.toLocaleString('en-IN')}–{to.toLocaleString('en-IN')} of {total.toLocaleString('en-IN')}</span>
            <span className="ms-2">Rows</span>
            <Form.Select
              size="sm"
              style={{ width: 90 }}
              value={paginationData.recordPerPage}
              onChange={(e: any) => setPaginationData({ ...paginationData, currentPage: 1, recordPerPage: e.target.value })}
            >
              {[50, 100, 200, 500, 1000, 2000].map((n) => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </div>
          <PaginationNav
            align="end"
            currentPage={paginationData.currentPage}
            totalPages={resPaginateData.totalPages}
            disabled={isLoading}
            onPageChange={(page) => setPaginationData({ ...paginationData, currentPage: page })}
          />
        </div>
      </div>
    </Layout>
  )
})
export default OtpRequest
