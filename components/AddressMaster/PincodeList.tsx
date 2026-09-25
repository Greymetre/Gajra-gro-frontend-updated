import React, { useEffect, useState } from 'react'
import { Form, Table, Spinner, Button } from 'react-bootstrap';
import { backendGetAllPincodes } from "../../helpers/backend_helper"

const PAGE_SIZE = 100;

// Pincodes are stored on their city; add / remove them from the city (or in GG SFA)
export default function PincodeList() {
    const [isLoading, setIsLoading] = useState(true)
    const [rows, setRows] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    useEffect(() => {
        setIsLoading(true)
        // Small delay so typing in the search box does not fire a request per key
        const t = setTimeout(() => {
            backendGetAllPincodes({ currentPage: page, recordPerPage: PAGE_SIZE, search }).then((res) => {
                setRows(Array.isArray(res?.data?.docs) ? res.data.docs : [])
                setTotal(res?.data?.totalDocs || 0)
            }).catch(() => {
                setRows([])
                setTotal(0)
            }).finally(() => setIsLoading(false))
        }, 300)
        return () => clearTimeout(t)
    }, [page, search])

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const from = total ? (page - 1) * PAGE_SIZE + 1 : 0
    const to = Math.min(total, page * PAGE_SIZE)

    return (
        <div>
            <div className="am-toolbar">
                <div className="am-count">{total.toLocaleString('en-IN')} {total === 1 ? 'pincode' : 'pincodes'}</div>
                <div className="am-filters">
                    <Form.Control
                        type="text"
                        className="am-search"
                        value={search}
                        onChange={(e) => { setPage(1); setSearch(e.target.value) }}
                        autoComplete='off'
                        placeholder='Search pincode, city, district...'
                    />
                </div>
            </div>
            <p className="am-note">Pincodes from GG SFA sync automatically. Other pincodes can be added from the city&apos;s Edit form.</p>

            <div className="table-responsive cd-table-wrap">
                <Table className="cd-table mb-0" hover>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>Pincode</th>
                            <th>City</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="cd-empty"><Spinner animation="border" size="sm" /></td></tr>
                        ) : rows.length ? rows.map((item, index) => (
                            <tr key={`${item.cityid}-${item.pincode}`}>
                                <td className="cd-cell-ref">{from + index}</td>
                                <td className="am-name">{item.pincode}</td>
                                <td>
                                    {item.cityName || '-'}
                                    {!item.active ? <span className="cd-badge cd-badge-muted ms-2">City inactive</span> : null}
                                </td>
                                <td>{item.district || '-'}</td>
                                <td>{item.state || '-'}</td>
                                <td>{item.country || '-'}</td>
                                <td>{item.fromSfa ? <span className="am-source">GG SFA</span> : <span className="am-source am-source-gro">GRO</span>}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="cd-empty">
                                {search ? 'No pincodes match the search' : 'No pincodes yet. Use "Sync from GG SFA" to import them.'}
                            </td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="am-pager">
                <span>{total ? `Showing ${from}-${to} of ${total.toLocaleString('en-IN')}` : ''}</span>
                <Button size="sm" variant="outline-secondary" disabled={page === 1 || isLoading} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline-secondary" disabled={page >= totalPages || isLoading} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
        </div>
    )
}
