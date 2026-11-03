import { utils, writeFile, WorkSheet } from 'xlsx'

type Row = Record<string, any>

export const ACCOUNT_STATEMENT_HEADERS = [
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

export const TRANSFER_STATEMENT_HEADERS = [
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

// State -> sales zone, as used in the manual Cashfree report
const STATE_ZONE: Record<string, string> = {
  'maharashtra': 'West-2',
  'goa': 'West-2',
  'gujarat': 'West-1',
  'madhya pradesh': 'West-1',
  'chhattisgarh': 'West-1',
  'tamil nadu': 'South-1',
  'karnataka': 'South-1',
  'kerala': 'South-1',
  'telangana': 'South-2',
  'andhra pradesh': 'South-2',
  'west bengal': 'East-1',
  'jharkhand': 'East-1',
  'odisha': 'East-1',
  'orissa': 'East-1',
  'assam': 'East-2',
  'uttar pradesh': 'East-2',
  'bihar': 'East-2',
  'tripura': 'East-2',
  'meghalaya': 'East-2',
  'andaman and nicobar islands': 'East-2',
  'manipur': 'East-2',
  'nagaland': 'East-2',
  'mizoram': 'East-2',
  'arunachal pradesh': 'East-2',
  'rajasthan': 'North',
  'delhi': 'North',
  'uttarakhand': 'North',
  'punjab': 'North',
  'haryana': 'North',
  'jammu and kashmir': 'North',
  'chandigarh': 'North',
  'himachal pradesh': 'North',
}

const MODES = ['UPI', 'IMPS', 'NEFT']
const CRM_STATUSES = ['Success', 'Pending', 'Rejected', 'UNDER PROCESS']
const TRANSFER_STATUSES = ['SUCCESS', 'REJECTED', 'FAILED', 'QUEUED']

const str = (value: any) => String(value ?? '').trim()
const same = (a: any, b: any) => str(a).toLowerCase() === str(b).toLowerCase()
const num = (value: any) => {
  const parsed = parseFloat(str(value).replace(/,/g, ''))
  return Number.isNaN(parsed) ? 0 : parsed
}

// "2026-10-19T11:28:46" or "19/10/2026 11:28" -> [year, month, day]
const dateParts = (value: any): [number, number, number] | null => {
  const text = str(value)
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return [+iso[1], +iso[2], +iso[3]]
  const dmy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (dmy) return [+dmy[3], +dmy[2], +dmy[1]]
  return null
}

// Excel date serial, so the cells sort and filter as real dates
const excelDate = (year: number, month: number, day: number) => Date.UTC(year, month - 1, day) / 86400000 + 25569
const dateSerial = (value: any) => {
  const parts = dateParts(value)
  return parts ? excelDate(...parts) : ''
}
const monthSerial = (value: any) => {
  const parts = dateParts(value)
  return parts ? excelDate(parts[0], parts[1], 1) : ''
}
const weekLabel = (value: any) => {
  const parts = dateParts(value)
  return parts ? `Week ${Math.floor((parts[2] - 1) / 7) + 1}` : ''
}

const byAddedOnDesc = (a: Row, b: Row) => str(b['Added On']).localeCompare(str(a['Added On']))

// A transfer is counted on the day Cashfree processed it ("Last checked at"), as in the manual report
const processedOn = (row: Row) => (dateParts(row['Last checked at']) ? row['Last checked at'] : row['Added On'])

const setColumnFormat = (ws: WorkSheet, column: number, fromRow: number, format: string) => {
  const range = utils.decode_range(ws['!ref'] || 'A1')
  for (let row = fromRow; row <= range.e.r; row++) {
    const cell = ws[utils.encode_cell({ r: row, c: column })]
    if (cell && cell.t === 'n') cell.z = format
  }
}

const setColumnWidths = (ws: WorkSheet, count: number, width = 18) => {
  ws['!cols'] = Array.from({ length: count }, () => ({ wch: width }))
}

const firstBy = (rows: Row[], key: (row: Row) => string) => {
  const map = new Map<string, Row>()
  rows.forEach((row) => {
    const value = key(row)
    if (value && !map.has(value)) map.set(value, row)
  })
  return map
}

export function downloadCashfreeReport(account: Row[], transfer: Row[], redemptions: Row[]) {
  const transfers = [...transfer].sort(byAddedOnDesc)
  const accounts = [...account].sort(byAddedOnDesc)

  const crmByUtr = firstBy(redemptions, (row) => str(row.UTR_No))
  // Cashfree Transfer Id is the CRM redemption _id
  const crmById = firstBy(redemptions, (row) => str(row._id))
  const crmForTransfer = (row?: Row) => (row
    ? crmByUtr.get(str(row['Bank Reference No'])) || crmById.get(str(row['Transfer Id']))
    : undefined)
  const transferByUtr = firstBy(transfers, (row) => str(row['Bank Reference No']))
  const transferByReference = firstBy(transfers, (row) => str(row['Reference Id']))
  const zoneByMobile = new Map<string, string>()
  redemptions.forEach((row) => {
    const mobile = str(row.mobile)
    const zone = STATE_ZONE[str(row.state).toLowerCase()]
    if (mobile && zone && !zoneByMobile.has(mobile)) zoneByMobile.set(mobile, zone)
  })
  const mobileForTransfer = (row?: Row) => str(crmForTransfer(row)?.mobile)
  const nameForTransfer = (row?: Row) => {
    const name = row ? str(row['Beneficiary Name']) : ''
    return name && !same(name, 'default name') ? name : str(crmForTransfer(row)?.firmName) || name
  }

  /* ---------- Cashfree Details (transfer statement) ---------- */
  const statuses = [...TRANSFER_STATUSES]
  transfers.forEach((row) => {
    const status = str(row.Status).toUpperCase()
    if (status && !statuses.includes(status)) statuses.push(status)
  })
  const transferAoa: any[][] = statuses.map((status) => [
    '', '', status,
    transfers.filter((row) => same(row.Status, status)).reduce((sum, row) => sum + num(row.Amount), 0),
  ])
  const transferHeaderRow = transferAoa.length
  transferAoa.push([...TRANSFER_STATEMENT_HEADERS, 'Date', 'Month', 'Week', 'Mobile', 'In CRM'])
  transfers.forEach((row) => {
    transferAoa.push([
      ...TRANSFER_STATEMENT_HEADERS.map((header) => (header === 'Amount' ? num(row[header]) : row[header] ?? '')),
      dateSerial(processedOn(row)),
      monthSerial(processedOn(row)),
      weekLabel(processedOn(row)),
      mobileForTransfer(row),
      crmForTransfer(row) ? 'Yes' : 'No',
    ])
  })
  const transferSheet = utils.aoa_to_sheet(transferAoa)
  const transferDateCol = TRANSFER_STATEMENT_HEADERS.length
  setColumnFormat(transferSheet, transferDateCol, transferHeaderRow + 1, 'dd-mm-yyyy')
  setColumnFormat(transferSheet, transferDateCol + 1, transferHeaderRow + 1, 'mmm-yy')
  setColumnWidths(transferSheet, TRANSFER_STATEMENT_HEADERS.length + 5)
  transferSheet['!autofilter'] = {
    ref: utils.encode_range({ s: { r: transferHeaderRow, c: 0 }, e: { r: transferAoa.length - 1, c: TRANSFER_STATEMENT_HEADERS.length + 4 } }),
  }

  /* ---------- Cashfree Account Details (account statement) ---------- */
  const totalFor = (type: string) => accounts
    .filter((row) => same(row['Debit/Credit'], type))
    .reduce((sum, row) => sum + num(row['Charged Amount (INR)']), 0)
  const debit = totalFor('DEBIT')
  const credit = totalFor('CREDIT')
  const accountHeaders = ['Date', 'Added On', 'Mechanic Name', 'Mechanic Mobile Number', 'Debit/Credit', 'Particulars',
    'Charged Amount (INR)', 'Closing Balance (INR)', 'Event Id', 'Month', 'ZONE']
  const accountAoa: any[][] = [
    ['', '', '', '', '', 'Balance', credit - debit],
    ['', '', '', '', '', 'DEBIT', debit],
    ['', '', '', '', '', 'CREDIT', credit],
    accountHeaders,
  ]
  accounts.forEach((row) => {
    // credits are fund top-ups by Gajra, not mechanic payouts
    const isCredit = same(row['Debit/Credit'], 'CREDIT')
    const transferRow = transferByReference.get(str(row['Event Id']))
    const mobile = mobileForTransfer(transferRow)
    accountAoa.push([
      dateSerial(row['Added On']),
      row['Added On'] ?? '',
      isCredit ? 'Gajra Gears Pvt LTD (Payment Rec)' : nameForTransfer(transferRow),
      isCredit ? '-' : mobile,
      row['Debit/Credit'] ?? '',
      row['Particulars'] ?? '',
      num(row['Charged Amount (INR)']),
      num(row['Closing Balance (INR)']),
      row['Event Id'] ?? '',
      monthSerial(row['Added On']),
      isCredit ? 'HO' : zoneByMobile.get(mobile) || '',
    ])
  })
  const accountSheet = utils.aoa_to_sheet(accountAoa)
  setColumnFormat(accountSheet, 0, 4, 'dd-mm-yyyy')
  setColumnFormat(accountSheet, 9, 4, 'mmm-yy')
  setColumnWidths(accountSheet, accountHeaders.length)
  accountSheet['!autofilter'] = {
    ref: utils.encode_range({ s: { r: 3, c: 0 }, e: { r: accountAoa.length - 1, c: accountHeaders.length - 1 } }),
  }

  /* ---------- Mechanic Wise Details CRM (redemptions) ---------- */
  const modeTotal = (mode: string, status: string) => redemptions
    .filter((row) => same(row.type, mode) && same(row.status, status))
    .reduce((sum, row) => sum + num(row.points), 0)
  const paidByCrm = modeTotal('UPI', 'Success') + modeTotal('IMPS', 'Success')
  const crmAoa: any[][] = [
    ['MODE', ...CRM_STATUSES, 'TOTAL', 'ACTUAL PAYMENT by Gro+ CRM Portal', 'ACTUAL PAYMENT by Cashfree', 'Difference'],
    ...MODES.map((mode, index) => {
      const totals = CRM_STATUSES.map((status) => modeTotal(mode, status))
      const row: any[] = [mode, ...totals, totals.reduce((a, b) => a + b, 0)]
      if (index === 0) row.push(paidByCrm, debit, debit - paidByCrm)
      return row
    }),
    [],
  ]
  const crmColumns = ['_id', 'customerid', 'firmName', 'contactPerson', 'customerType', 'mobile', 'state', 'city', 'refno',
    'type', 'points', 'status', 'paymentDate', 'UTR_No', 'holderName', 'fundSource', 'accountNo', 'bankName', 'ifsc',
    'upiNumber', 'createdAt', 'dateFilter']
  const crmHeaderRow = crmAoa.length
  crmAoa.push([...crmColumns, 'Cashfree UTR', 'Cashfree Amount', 'Difference', 'Zone'])
  redemptions.forEach((row) => {
    const transferRow = transferByUtr.get(str(row.UTR_No))
    const cashfreeAmount = transferRow ? num(transferRow.Amount) : 0
    crmAoa.push([
      ...crmColumns.map((column) => {
        if (column === 'createdAt') return dateSerial(row.createdAt)
        if (column === 'points') return num(row.points)
        return str(row[column])
      }),
      transferRow ? str(transferRow['Bank Reference No']) : 'Not Found',
      cashfreeAmount,
      cashfreeAmount - num(row.points),
      STATE_ZONE[str(row.state).toLowerCase()] || '',
    ])
  })
  const crmSheet = utils.aoa_to_sheet(crmAoa)
  setColumnFormat(crmSheet, crmColumns.indexOf('createdAt'), crmHeaderRow + 1, 'dd-mm-yyyy')
  setColumnWidths(crmSheet, crmColumns.length + 4)
  crmSheet['!autofilter'] = {
    ref: utils.encode_range({ s: { r: crmHeaderRow, c: 0 }, e: { r: crmAoa.length - 1, c: crmColumns.length + 3 } }),
  }

  /* ---------- Weekly Summary (successful transfers per month / week) ---------- */
  const weekly = new Map<string, number[]>()
  transfers.filter((row) => same(row.Status, 'SUCCESS')).forEach((row) => {
    const parts = dateParts(processedOn(row))
    if (!parts) return
    const key = `${parts[0]}-${String(parts[1]).padStart(2, '0')}`
    const weeks = weekly.get(key) || [0, 0, 0, 0, 0]
    weeks[Math.min(Math.floor((parts[2] - 1) / 7), 4)] += num(row.Amount)
    weekly.set(key, weeks)
  })
  const weeklyAoa: any[][] = [['Weekly Payment'], ['Month', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Total']]
  const months = Array.from(weekly.keys()).sort()
  if (months.length) {
    let [year, month] = months[0].split('-').map(Number)
    const [lastYear, lastMonth] = months[months.length - 1].split('-').map(Number)
    while (year < lastYear || (year === lastYear && month <= lastMonth)) {
      const weeks = weekly.get(`${year}-${String(month).padStart(2, '0')}`) || [0, 0, 0, 0, 0]
      weeklyAoa.push([excelDate(year, month, 1), ...weeks, weeks.reduce((a, b) => a + b, 0)])
      month += 1
      if (month > 12) { month = 1; year += 1 }
    }
  }
  const weeklySheet = utils.aoa_to_sheet(weeklyAoa)
  weeklySheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]
  setColumnFormat(weeklySheet, 0, 2, 'mmm-yy')
  setColumnWidths(weeklySheet, 7, 14)

  const wb = utils.book_new()
  utils.book_append_sheet(wb, weeklySheet, 'Weekly Summary')
  utils.book_append_sheet(wb, accountSheet, 'Cashfree Account Details')
  utils.book_append_sheet(wb, crmSheet, 'Mechanic Wise Details CRM')
  utils.book_append_sheet(wb, transferSheet, 'Cashfree Details')

  const today = new Date()
  const stamp = [today.getDate(), today.getMonth() + 1, today.getFullYear()].map((n) => String(n).padStart(2, '0')).join('-')
  writeFile(wb, `Cashfree Report ${stamp}.xlsx`, { compression: true })
}
