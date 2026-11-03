import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Image, Modal, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { Download, Upload } from 'react-bootstrap-icons'
import { utils, writeFile } from 'xlsx'
import * as XLSX from 'xlsx'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import PaginationNav from '../../components/Common/PaginationNav'
import {
  backendGetCashfreeExportReport,
  backendGetCashfreeStatements,
  backendImportCashfreeStatement,
} from '../../helpers/backend_helper'
import { EXCEL_DEMO_IMAGE, IMAGE_URL } from '../../utils/constant'
import { ACCOUNT_STATEMENT_HEADERS, TRANSFER_STATEMENT_HEADERS, downloadCashfreeReport } from '../../utils/cashfreeReport'

type CashfreeRow = Record<string, any>
type StatementType = 'ACCOUNT' | 'TRANSFER'

const STATEMENTS: Record<StatementType, { label: string; headers: string[]; fileName: string }> = {
  ACCOUNT: { label: 'Account Statement', headers: ACCOUNT_STATEMENT_HEADERS, fileName: 'cashfreeAccountStatement' },
  TRANSFER: { label: 'Transfer Statement', headers: TRANSFER_STATEMENT_HEADERS, fileName: 'cashfreeTransferStatement' },
}

const PAGE_LIMIT = 50
// rows sent per API call while importing
const IMPORT_CHUNK_SIZE = 1000

const initialListState = { docs: [] as CashfreeRow[], totalDocs: 0, totalPages: 0, page: 1 }

function readXlsxFile(file: File): Promise<CashfreeRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // raw: false keeps dates and numbers as shown in Excel
        resolve(XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false }))
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const CashfreeReport = () => {
  const [activeTab, setActiveTab] = useState<StatementType>('ACCOUNT')
  const [lists, setLists] = useState<Record<StatementType, typeof initialListState>>({
    ACCOUNT: initialListState,
    TRANSFER: initialListState,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importType, setImportType] = useState<StatementType>('ACCOUNT')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  // set when the API refuses access (no reports.cashfree permission)
  const [accessDenied, setAccessDenied] = useState(false)

  const fetchStatements = async (statementType: StatementType, page: number) => {
    setIsLoading(true)
    try {
      const res = await backendGetCashfreeStatements({ statementType, page, limit: PAGE_LIMIT })
      if (!res.isError && res.data) {
        setLists((prev) => ({ ...prev, [statementType]: res.data }))
      }
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatements(activeTab, lists[activeTab].page || 1)
  }, [activeTab])

  const downloadTemplate = (statementType: StatementType) => {
    const { headers, fileName } = STATEMENTS[statementType]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.aoa_to_sheet([headers]), 'Data')
    writeFile(wb, `${fileName}Template.xlsx`)
    setShowTemplateModal(false)
  }

  const handleOnExport = async () => {
    setIsExporting(true)
    try {
      const res = await backendGetCashfreeExportReport()
      const { account = [], transfer = [], redemptions = [] } = res?.data || {}
      if (!account.length && !transfer.length) {
        alert('No Cashfree data to export. Please import the statements first.')
        return
      }
      downloadCashfreeReport(account, transfer, redemptions)
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
      alert(error?.response?.data?.message || 'Unable to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const openImportModal = () => {
    setImportType(activeTab)
    setSelectedFile(null)
    setImportProgress('')
    setShowImportModal(true)
  }

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }
    const { label, headers } = STATEMENTS[importType]
    setIsImporting(true)
    try {
      const rows = await readXlsxFile(selectedFile)
      if (!rows.length) {
        alert('File is empty')
        return
      }
      const fileHeaders = Object.keys(rows[0])
      const missingHeaders = headers.filter((header) => !fileHeaders.includes(header))
      if (missingHeaders.length) {
        alert(`This file does not match the ${label} template. Missing columns: ${missingHeaders.join(', ')}`)
        return
      }

      let inserted = 0
      let updated = 0
      let skipped = 0
      for (let start = 0; start < rows.length; start += IMPORT_CHUNK_SIZE) {
        setImportProgress(`Uploading ${Math.min(start + IMPORT_CHUNK_SIZE, rows.length)} / ${rows.length} rows...`)
        const res = await backendImportCashfreeStatement({
          statementType: importType,
          data: rows.slice(start, start + IMPORT_CHUNK_SIZE),
        })
        inserted += res?.data?.insertedCount || 0
        updated += res?.data?.updatedCount || 0
        skipped += res?.data?.skippedCount || 0
      }
      alert(`${label} imported.\nNew: ${inserted}\nUpdated: ${updated}\nSkipped (no id): ${skipped}`)
      setShowImportModal(false)
      if (importType === activeTab) {
        fetchStatements(importType, 1)
      } else {
        // switching tab triggers the fetch from useEffect
        setLists((prev) => ({ ...prev, [importType]: { ...prev[importType], page: 1 } }))
        setActiveTab(importType)
      }
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
      alert(error?.response?.data?.message || 'Unable to import file')
    } finally {
      setIsImporting(false)
      setImportProgress('')
    }
  }

  const renderList = (statementType: StatementType) => {
    const { headers } = STATEMENTS[statementType]
    const list = lists[statementType]
    return (
      <>
        <div className="mb-2">
          <PaginationNav
            align="start"
            currentPage={list.page || 1}
            totalPages={list.totalPages}
            disabled={isLoading}
            onPageChange={(page) => fetchStatements(statementType, page)}
          />
        </div>
        <Card className="flat-card p-0">
          <div className="table-responsive">
            <Table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map((header) => <th key={header} className="text-nowrap">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={headers.length + 1} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
                ) : list.docs.length ? (
                  list.docs.map((row, index) => (
                    <tr key={index}>
                      <td>{((list.page || 1) - 1) * PAGE_LIMIT + index + 1}</td>
                      {headers.map((header) => <td key={header} className="text-nowrap">{String(row?.[header] ?? '')}</td>)}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={headers.length + 1} className="text-center">No data found</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </>
    )
  }

  if (accessDenied) {
    return (
      <Layout>
        <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Cashfree Report' />
        <h3 className="mb-3">Access denied</h3>
        <p>You do not have permission to view the Cashfree report.</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Cashfree Report' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col xs={12} className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <h3 className="mb-0">
                Cashfree Report ({(lists[activeTab].totalDocs ?? 0).toLocaleString('en-IN')})
              </h3>
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                <Button onClick={() => setShowTemplateModal(true)} variant="outline-light">
                  <Download /> Template
                </Button>
                <Button onClick={openImportModal} variant="outline-light">
                  <Upload /> Import
                </Button>
                <Button onClick={handleOnExport} variant="outline-light" disabled={isExporting}>
                  {isExporting ? <Spinner animation="border" size="sm" /> : <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} />} Export
                </Button>
              </div>
            </Col>

            <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Download Template</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-grid gap-2">
                <Button variant="dark" onClick={() => downloadTemplate('ACCOUNT')}>
                  <Download /> Account Statement Template
                </Button>
                <Button variant="outline-dark" onClick={() => downloadTemplate('TRANSFER')}>
                  <Download /> Transfer Statement Template
                </Button>
              </Modal.Body>
            </Modal>

            <Modal show={showImportModal} onHide={() => !isImporting && setShowImportModal(false)} centered>
              <Modal.Header closeButton={!isImporting}>
                <Modal.Title>Import Statement</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label>Statement Type</Form.Label>
                <div className="d-grid gap-2 mb-3">
                  {(Object.keys(STATEMENTS) as StatementType[]).map((type) => (
                    <Button
                      key={type}
                      variant={importType === type ? 'dark' : 'outline-dark'}
                      disabled={isImporting}
                      onClick={() => setImportType(type)}
                    >
                      {STATEMENTS[type].label}
                    </Button>
                  ))}
                </div>
                <Form.Label>File (.xlsx)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".xlsx"
                  disabled={isImporting}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                {importProgress ? <div className="mt-2 small">{importProgress}</div> : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleImport} disabled={isImporting || !selectedFile}>
                  {isImporting ? <Spinner animation="border" size="sm" /> : null} Import {STATEMENTS[importType].label}
                </Button>
              </Modal.Footer>
            </Modal>

            <Col xs={12}>
              <Tabs activeKey={activeTab} onSelect={(key) => key && setActiveTab(key as StatementType)} className="mb-3">
                <Tab eventKey="ACCOUNT" title="Account Statement List">
                  {activeTab === 'ACCOUNT' ? renderList('ACCOUNT') : null}
                </Tab>
                <Tab eventKey="TRANSFER" title="Transfer Statement List">
                  {activeTab === 'TRANSFER' ? renderList('TRANSFER') : null}
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}
export default CashfreeReport
