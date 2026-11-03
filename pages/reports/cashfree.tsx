import React, { useState } from 'react'
import { Button, Card, Col, Form, Image, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import { Download } from 'react-bootstrap-icons'
import { utils, writeFile } from 'xlsx'
import * as XLSX from 'xlsx'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { EXCEL_DEMO_IMAGE, IMAGE_URL } from '../../utils/constant'

type CashfreeRow = Record<string, any>

const ACCOUNT_STATEMENT_HEADERS = [
  'Added On',
  'Debit/Credit',
  'Particulars',
  'Charged Amount (INR)',
  'Amount (INR)',
  'Service Charge (INR)',
  'Service Tax (INR)',
  'Closing Balance (INR)',
  'Event Id',
  'Remarks',
]

const TRANSFER_STATEMENT_HEADERS = [
  'Added On',
  'Amount',
  'Transfer Id',
  'Reference Id',
  'Status',
  'Beneficiary Name',
  'Beneficiary Id',
  'Bank Account',
  'IFSC',
  'VPA',
  'Remarks',
  'Bank Reference No',
  'Service Charge',
  'Service Tax',
  'Acknowledged',
  'Mode',
  'Status Code',
  'Payment Instrument ID',
  'Last checked at',
  'Added by',
  'Status Description',
  'Extended UTR',
]

function readXlsxFile(file: File): Promise<CashfreeRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        resolve(XLSX.utils.sheet_to_json(worksheet, { defval: '' }))
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const CashfreeReport = () => {
  const [cashfreeData, setCashfreeData] = useState<CashfreeRow[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const columns = cashfreeData.length ? Object.keys(cashfreeData[0]) : []

  const downloadTemplate = (headers: string[], fileName: string) => {
    if (!headers.length) {
      alert('This template is not available yet')
      return
    }
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.aoa_to_sheet([headers]), 'Data')
    writeFile(wb, fileName)
    setShowTemplateModal(false)
  }

  const handleOnExport = () => {
    if (!cashfreeData.length) {
      alert('No data to export')
      return
    }
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(cashfreeData), 'Data')
    writeFile(wb, 'cashfreeReport.xlsx')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null)
  }

  const handleFileUploadSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }
    try {
      setCashfreeData(await readXlsxFile(selectedFile))
    } catch (error) {
      console.error(error)
      alert('Unable to read file')
    }
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Cashfree Report' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col xs={12} className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <h3 className="mb-0">Cashfree Report ({cashfreeData.length.toLocaleString('en-IN')})</h3>
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                <Button onClick={() => setShowTemplateModal(true)} variant="outline-light">
                  <Download /> Template
                </Button>
                <Button onClick={handleOnExport} variant="outline-light">
                  <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
                </Button>
              </div>
            </Col>
            <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Download Template</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-grid gap-2">
                <Button variant="dark" onClick={() => downloadTemplate(ACCOUNT_STATEMENT_HEADERS, 'cashfreeAccountStatementTemplate.xlsx')}>
                  <Download /> Account Statement Template
                </Button>
                <Button variant="outline-dark" onClick={() => downloadTemplate(TRANSFER_STATEMENT_HEADERS, 'cashfreeTransferStatementTemplate.xlsx')}>
                  <Download /> Transfer Statement Template
                </Button>
              </Modal.Body>
            </Modal>
            <Col md={6}>
              <InputGroup className="mb-3">
                <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} />
                <Button className="btn btn-dark" onClick={handleFileUploadSubmit}>
                  Import
                </Button>
              </InputGroup>
            </Col>
            {cashfreeData.length ? (
              <Card className="flat-card p-0">
                <div className="table-responsive">
                  <Table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        {columns.map((column) => <th key={column}>{column}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {cashfreeData.map((row, index) => (
                        <tr key={index}>
                          {columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            ) : null}
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}
export default CashfreeReport
