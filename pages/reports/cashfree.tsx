import React, { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Col, Form, Image, Modal, ProgressBar, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { ArrowClockwise, ArrowDownLeft, ArrowRepeat, ArrowUpRight, Database, Download, Upload, Wallet2 } from 'react-bootstrap-icons'
import { utils, writeFile } from 'xlsx'
import * as XLSX from 'xlsx'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import PaginationNav from '../../components/Common/PaginationNav'
import {
  backendGetCashfreeExportReport,
  backendGetCashfreeStatements,
  backendImportCashfreeStatement,
  backendSyncCashfreeAccountStatement,
  backendGetCashfreeSyncStatus,
  backendGetCashfreeSummary,
} from '../../helpers/backend_helper'
import { EXCEL_DEMO_IMAGE, IMAGE_URL } from '../../utils/constant'
import { ACCOUNT_STATEMENT_HEADERS, TRANSFER_STATEMENT_HEADERS, downloadCashfreeReport } from '../../utils/cashfreeReport'

type CashfreeRow = Record<string, any>

interface SyncStatus {
  status: 'idle' | 'running' | 'success' | 'failed'
  startedBy: 'manual' | 'auto' | ''
  days: number
  daysDone: number
  fetched: number
  inserted: number
  updated: number
  error: string
  startedAt: string | null
  finishedAt: string | null
  lastApiRowAt: string | null
  phase: 'account' | 'transfers' | ''
  transfersTotal: number
  transfersChecked: number
  transfersSaved: number
}

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'
type StatementType = 'ACCOUNT' | 'TRANSFER'

interface CashfreeSummary {
  live: { balance: number; availableBalance: number; at: string } | null
  liveError: string
  statementBalance: number | null
  statementBalanceAt: string | null
  today: { date: string; payouts: number; payoutAmount: number; topups: number; topupAmount: number }
  accountRows: number
  transferRows: number
}

const AMOUNT_COLUMNS = [
  'Charged Amount (INR)', 'Amount (INR)', 'Service Charge (INR)', 'Service Tax (INR)', 'Closing Balance (INR)',
  'Amount', 'Service Charge', 'Service Tax',
]

const formatAmount = (value: any) => {
  const number = Number(String(value ?? '').replace(/,/g, ''))
  return Number.isFinite(number)
    ? number.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : String(value ?? '')
}

// Statement times are IST text like "2026-11-17T11:07:56"; show them as "17 Nov 2026, 11:07:56"
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatStatementTime = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/.exec(value || '')
  return match ? `${match[3]} ${MONTHS[Number(match[2]) - 1] || match[2]} ${match[1]}, ${match[4]}` : value
}

const statusTone = (status: string) => {
  const upper = status.toUpperCase()
  if (upper === 'SUCCESS') return 'success'
  if (['FAILED', 'REJECTED', 'ERROR'].includes(upper)) return 'danger'
  if (upper === 'REVERSED') return 'warning'
  return 'secondary'
}

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [isStartingSync, setIsStartingSync] = useState(false)
  // result panel is shown only for a sync started from this page
  const [showSyncResult, setShowSyncResult] = useState(false)
  const syncPollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSyncRunning = syncStatus?.status === 'running'
  // set when the API refuses access (no reports.cashfree permission)
  const [accessDenied, setAccessDenied] = useState(false)
  const [summary, setSummary] = useState<CashfreeSummary | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)

  const loadSummary = async (refresh = false) => {
    setIsSummaryLoading(true)
    try {
      const res = await backendGetCashfreeSummary(refresh)
      if (!res?.isError && res?.data) setSummary(res.data)
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => { loadSummary() }, [])

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

  // Account statement sync runs on the server; the page polls its progress every 2 seconds while it runs
  const activeTabRef = useRef(activeTab)
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  const lastSyncStateRef = useRef<SyncStatus['status'] | null>(null)

  const loadSyncStatus = async () => {
    if (syncPollRef.current) clearTimeout(syncPollRef.current)
    try {
      const res = await backendGetCashfreeSyncStatus()
      const status: SyncStatus = res?.data
      if (!status) return
      // a run just finished: show the new rows
      if (lastSyncStateRef.current === 'running' && status.status !== 'running') {
        loadSummary()
        if (activeTabRef.current === 'ACCOUNT') {
          fetchStatements('ACCOUNT', 1)
        } else {
          setLists((prev) => ({ ...prev, ACCOUNT: { ...prev.ACCOUNT, page: 1 } }))
        }
      }
      lastSyncStateRef.current = status.status
      setSyncStatus(status)
      if (status.status === 'running') {
        syncPollRef.current = setTimeout(loadSyncStatus, 2000)
      }
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
    }
  }

  useEffect(() => {
    loadSyncStatus()
    return () => { if (syncPollRef.current) clearTimeout(syncPollRef.current) }
  }, [])

  const handleSyncAccount = async () => {
    setIsStartingSync(true)
    setShowSyncResult(true)
    try {
      const res = await backendSyncCashfreeAccountStatement({ days: 31 })
      if (res?.data) {
        lastSyncStateRef.current = res.data.status
        setSyncStatus(res.data)
      }
      if (activeTab !== 'ACCOUNT') setActiveTab('ACCOUNT')
      loadSyncStatus()
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
      setSyncStatus((previous) => ({
        ...(previous || { startedBy: '', days: 0, daysDone: 0, fetched: 0, inserted: 0, updated: 0, startedAt: null, finishedAt: null, lastApiRowAt: null }),
        status: 'failed',
        error: error?.response?.data?.message || 'Could not reach the server. Please try again.',
      } as SyncStatus))
    } finally {
      setIsStartingSync(false)
    }
  }

  const renderSyncPanel = () => {
    if (!syncStatus) return null
    const { status, days, daysDone, fetched, inserted, updated, error, finishedAt, startedBy, phase } = syncStatus
    const transfersTotal = syncStatus.transfersTotal || 0
    const transfersChecked = syncStatus.transfersChecked || 0
    const transfersSaved = syncStatus.transfersSaved || 0
    const counts = `${fetched.toLocaleString('en-IN')} rows read · ${inserted.toLocaleString('en-IN')} new · ${updated.toLocaleString('en-IN')} updated`
    const transferCounts = transfersTotal ? ` Transfers: ${transfersSaved.toLocaleString('en-IN')} of ${transfersTotal.toLocaleString('en-IN')} payouts found in Cashfree.` : ''
    if (status === 'running') {
      const inTransfers = phase === 'transfers'
      const percent = inTransfers
        ? (transfersTotal ? Math.round((transfersChecked / transfersTotal) * 100) : 100)
        : (days ? Math.round((daysDone / days) * 100) : 0)
      return (
        <Alert variant="info" className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Spinner animation="border" size="sm" />
            <strong>
              {inTransfers ? 'Step 2 of 2: fetching transfer details of CRM payouts' : 'Step 1 of 2: syncing account statement'}
              {startedBy === 'auto' ? ' (automatic sync)' : ''}…
            </strong>
          </div>
          <ProgressBar now={percent} label={`${percent}%`} className="mb-2" />
          <div className="small">
            {inTransfers
              ? `${transfersChecked.toLocaleString('en-IN')} of ${transfersTotal.toLocaleString('en-IN')} payouts checked · ${transfersSaved.toLocaleString('en-IN')} saved.`
              : `Day ${Math.min(daysDone + 1, days)} of ${days} · ${counts}.`}{' '}
            You can keep working, this page updates on its own.
          </div>
        </Alert>
      )
    }
    if (!showSyncResult) return null
    if (status === 'success') {
      return (
        <Alert variant="success" className="mb-3" dismissible onClose={() => setShowSyncResult(false)}>
          <strong>Sync complete.</strong> Last {days} days synced at {formatDateTime(finishedAt)}. Account statement: {counts}.{transferCounts}
        </Alert>
      )
    }
    if (status === 'failed') {
      return (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setShowSyncResult(false)}>
          <strong>Sync failed.</strong> {error || 'Unknown error'}
          {fetched ? <div className="small mt-1">Saved before it stopped: {counts}. Running the sync again continues safely (no duplicates).</div> : null}
        </Alert>
      )
    }
    return null
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
      loadSummary()
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

  const renderCell = (statementType: StatementType, header: string, value: any) => {
    const text = String(value ?? '')
    if (header === 'Added On' || header === 'Last checked at') {
      return <td key={header} className="text-nowrap">{formatStatementTime(text)}</td>
    }
    if (header === 'Debit/Credit') {
      const upper = text.toUpperCase()
      return (
        <td key={header}>
          {upper ? <Badge bg={upper === 'CREDIT' ? 'success' : 'danger'} className="cf-badge">{upper}</Badge> : null}
        </td>
      )
    }
    if (statementType === 'TRANSFER' && header === 'Status') {
      return <td key={header}>{text ? <Badge bg={statusTone(text)} className="cf-badge">{text}</Badge> : null}</td>
    }
    if (AMOUNT_COLUMNS.includes(header)) {
      return <td key={header} className="text-end text-nowrap cf-amount">{text === '' ? '' : formatAmount(text)}</td>
    }
    return <td key={header} className="text-nowrap">{text}</td>
  }

  const renderList = (statementType: StatementType) => {
    const { headers } = STATEMENTS[statementType]
    const list = lists[statementType]
    const page = list.page || 1
    const from = list.totalDocs ? (page - 1) * PAGE_LIMIT + 1 : 0
    const to = Math.min(page * PAGE_LIMIT, list.totalDocs || 0)
    return (
      <>
        <div className="cf-table-wrap">
          <Table hover className="mb-0 cf-table">
            <thead>
              <tr>
                <th>#</th>
                {headers.map((header) => (
                  <th key={header} className={`text-nowrap ${AMOUNT_COLUMNS.includes(header) ? 'text-end' : ''}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={headers.length + 1} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : list.docs.length ? (
                list.docs.map((row, index) => (
                  <tr key={index}>
                    <td className="text-muted">{from + index}</td>
                    {headers.map((header) => renderCell(statementType, header, row?.[header]))}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={headers.length + 1} className="text-center py-5 text-muted">No data found. Use Sync from Cashfree or Import.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <small className="text-muted">
            Showing {from.toLocaleString('en-IN')}–{to.toLocaleString('en-IN')} of {(list.totalDocs || 0).toLocaleString('en-IN')}
          </small>
          <PaginationNav
            align="end"
            currentPage={page}
            totalPages={list.totalPages}
            disabled={isLoading}
            onPageChange={(nextPage) => fetchStatements(statementType, nextPage)}
          />
        </div>
      </>
    )
  }

  const renderBalanceCards = () => {
    const live = summary?.live
    const balance = live ? live.availableBalance : summary?.statementBalance
    const today = summary?.today
    return (
      <Row className="g-3 mb-4">
        <Col xl={4} md={6} xs={12}>
          <div className="cd-stat cd-stat-green cf-wallet">
            <div className="cd-stat-icon"><Wallet2 size={22} color="#22a55b" /></div>
            <div className="flex-grow-1 min-w-0">
              <div className="cd-stat-label d-flex align-items-center justify-content-between">
                <span>Cashfree Wallet Balance</span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-muted"
                  title="Refresh balance"
                  disabled={isSummaryLoading}
                  onClick={() => loadSummary(true)}
                >
                  {isSummaryLoading ? <Spinner animation="border" size="sm" /> : <ArrowClockwise />}
                </Button>
              </div>
              <div className="cd-stat-value">
                {balance === null || balance === undefined ? (isSummaryLoading ? '…' : '-') : `₹ ${formatAmount(balance)}`}
              </div>
              <div className="cf-stat-note">
                {live
                  ? <>Live from Cashfree · {formatDateTime(live.at)}{live.balance !== live.availableBalance ? ` · Ledger ₹ ${formatAmount(live.balance)}` : ''}</>
                  : summary
                    ? <span className="text-warning-emphasis">{summary.liveError || 'Live balance not available'}{summary.statementBalanceAt ? ` · showing last statement balance (${formatStatementTime(summary.statementBalanceAt)})` : ''}</span>
                    : 'Loading…'}
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} md={6} xs={12}>
          <div className="cd-stat cd-stat-red">
            <div className="cd-stat-icon"><ArrowUpRight size={22} color="#d92d20" /></div>
            <div>
              <div className="cd-stat-label">Today's Payouts</div>
              <div className="cd-stat-value">₹ {formatAmount(today?.payoutAmount || 0)}</div>
              <div className="cf-stat-note">{(today?.payouts || 0).toLocaleString('en-IN')} payouts (as of last sync)</div>
            </div>
          </div>
        </Col>
        <Col xl={2} md={6} xs={12}>
          <div className="cd-stat cd-stat-amber">
            <div className="cd-stat-icon"><ArrowDownLeft size={22} color="#b98900" /></div>
            <div>
              <div className="cd-stat-label">Today's Top-ups</div>
              <div className="cd-stat-value">₹ {formatAmount(today?.topupAmount || 0)}</div>
              <div className="cf-stat-note">{(today?.topups || 0).toLocaleString('en-IN')} credits</div>
            </div>
          </div>
        </Col>
        <Col xl={3} md={6} xs={12}>
          <div className="cd-stat cd-stat-blue">
            <div className="cd-stat-icon"><Database size={20} color="#2e6be6" /></div>
            <div>
              <div className="cd-stat-label">Records in CRM</div>
              <div className="cd-stat-value">{(summary?.accountRows ?? 0).toLocaleString('en-IN')}</div>
              <div className="cf-stat-note">Account rows · {(summary?.transferRows ?? 0).toLocaleString('en-IN')} transfer rows</div>
            </div>
          </div>
        </Col>
      </Row>
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

      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h3 className="mb-1">Cashfree Report</h3>
          <div className="text-muted small">
            Payouts account statement and transfers · Last synced {formatDateTime(syncStatus?.status === 'success' ? syncStatus.finishedAt : syncStatus?.lastApiRowAt)} · auto every 30 min
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <Button onClick={handleSyncAccount} variant="dark" className="cd-btn" disabled={isSyncRunning || isStartingSync}>
            {isSyncRunning || isStartingSync ? <Spinner animation="border" size="sm" /> : <ArrowRepeat />}{' '}
            {isSyncRunning ? 'Syncing…' : 'Sync from Cashfree'}
          </Button>
          <Button onClick={() => setShowTemplateModal(true)} className="cd-btn cd-btn-outline">
            <Download /> Template
          </Button>
          <Button onClick={openImportModal} className="cd-btn cd-btn-outline">
            <Upload /> Import
          </Button>
          <Button onClick={handleOnExport} className="cd-btn cd-btn-outline" disabled={isExporting}>
            {isExporting ? <Spinner animation="border" size="sm" /> : <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} />} Export
          </Button>
        </div>
      </div>

      {renderBalanceCards()}
      {renderSyncPanel()}

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

      <div className="cd-tabs-card">
        <Tabs activeKey={activeTab} onSelect={(key) => key && setActiveTab(key as StatementType)} className="cd-tabs">
          <Tab eventKey="ACCOUNT" title={`Account Statement (${(summary?.accountRows ?? lists.ACCOUNT.totalDocs ?? 0).toLocaleString('en-IN')})`}>
            {activeTab === 'ACCOUNT' ? renderList('ACCOUNT') : null}
          </Tab>
          <Tab eventKey="TRANSFER" title={`Transfer Statement (${(summary?.transferRows ?? lists.TRANSFER.totalDocs ?? 0).toLocaleString('en-IN')})`}>
            {activeTab === 'TRANSFER' ? renderList('TRANSFER') : null}
          </Tab>
        </Tabs>
      </div>
    </Layout>
  )
}
export default CashfreeReport
