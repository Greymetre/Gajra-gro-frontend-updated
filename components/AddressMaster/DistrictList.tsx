import React, { useEffect, useMemo, useState } from 'react'
import { Form, Table, Spinner, Button, Image } from 'react-bootstrap';
import { backendDeleteDistrict, backendGetAllDistricts } from "../../helpers/backend_helper"
import { IMAGE_URL, RED_TRASH_IMAGE } from '../../utils/constant'
import { AddressDistrictViewInterface } from '../../interfaces/address.interface';

const PAGE_SIZE = 50;

// Districts come from GG SFA (synced automatically); here they can only be deleted
export default function DistrictList(props: any) {
    const [isLoading, setIsLoading] = useState(true)
    const [districts, setDistricts] = useState<Array<AddressDistrictViewInterface>>([])
    const [search, setSearch] = useState('')
    const [stateFilter, setStateFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)

    const fetchDistricts = () => {
        backendGetAllDistricts({}).then((res) => {
            setDistricts(Array.isArray(res?.data) ? res.data : [])
        }).catch(() => {
            setDistricts([])
        }).finally(() => setIsLoading(false))
    }
    useEffect(() => { fetchDistricts() }, [])

    const handleDeleteItem = (item: AddressDistrictViewInterface) => {
        const note = item.sfaId ? '\n\nThis district came from GG SFA. If it still exists in SFA it will be added back by the next sync, so delete it in SFA too.' : ''
        if (!window.confirm(`Delete district "${item.districtName}"? Its cities are kept.${note}`)) return
        backendDeleteDistrict(item._id).then((result) => {
            if (!result?.isError) {
                fetchDistricts()
                props.onChanged?.()
            }
        }).catch(() => {
            window.alert('Unable to delete district. Please try again.')
        })
    }

    const states = useMemo(
        () => Array.from(new Set(districts.map((d) => d.state).filter(Boolean) as string[])).sort(),
        [districts]
    )

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return districts.filter((d) =>
            (!q || `${d.districtName} ${d.state} ${d.country}`.toLowerCase().includes(q)) &&
            (!stateFilter || d.state === stateFilter) &&
            (!statusFilter || (statusFilter === 'active' ? d.active : !d.active))
        )
    }, [districts, search, stateFilter, statusFilter])

    useEffect(() => { setPage(1) }, [search, stateFilter, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div>
            <div className="am-toolbar">
                <div className="am-count">
                    {filtered.length} {filtered.length === 1 ? 'district' : 'districts'}
                    {filtered.length !== districts.length ? <span> of {districts.length}</span> : null}
                </div>
                <div className="am-filters">
                    <Form.Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="am-select">
                        <option value="">All States</option>
                        {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Form.Select>
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="am-select am-select-sm">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                    <Form.Control
                        type="text"
                        className="am-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoComplete='off'
                        placeholder='Search district, state...'
                    />
                </div>
            </div>
            <p className="am-note">Districts are synced automatically from GG SFA. Add or edit them in SFA; a district deleted only here comes back if it still exists in SFA.</p>

            <div className="table-responsive cd-table-wrap">
                <Table className="cd-table mb-0" hover>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Status</th>
                            <th>Source</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="cd-empty"><Spinner animation="border" size="sm" /></td></tr>
                        ) : rows.length ? rows.map((item, index) => (
                            <tr key={item._id}>
                                <td className="cd-cell-ref">{(page - 1) * PAGE_SIZE + index + 1}</td>
                                <td className="am-name">{item.districtName}</td>
                                <td>{item.state || '-'}</td>
                                <td>{item.country || '-'}</td>
                                <td>
                                    <span className={`cd-badge ${item.active ? 'cd-badge-success' : 'cd-badge-muted'}`}>
                                        {item.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>{item.sfaId ? <span className="am-source">GG SFA</span> : <span className="am-source am-source-gro">GRO</span>}</td>
                                <td className="text-end">
                                    <a className="am-icon-btn am-icon-danger" title="Delete" onClick={() => { handleDeleteItem(item) }}><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="cd-empty">
                                {districts.length ? 'No districts match the filters' : 'No districts yet. Use "Sync from GG SFA" to import them.'}
                            </td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 ? (
                <div className="am-pager">
                    <span>Page {page} of {totalPages}</span>
                    <Button size="sm" variant="outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button size="sm" variant="outline-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            ) : null}
        </div>
    )
}
