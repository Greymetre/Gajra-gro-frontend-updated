import { number } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Badge, Button, Form, Image, InputGroup, Spinner, Table } from 'react-bootstrap'
import { PencilSquare, PersonPlus, Search, Trash, X } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import { backendGetAllUsers, backendDeleteUser, backendPostUserStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import { ActiveUserInterface } from '../../interfaces/user.interface'
import * as XLSX from 'xlsx';

export default function Users() {
  const router = useRouter()
  const userList = useSelector((state: any) => state?.users?.userList);
  const [isLoading, setIsLoading] = useState(true)
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'users.read':
        return { ...acc, canRead: true };
      case 'users.update':
        return { ...acc, canUpdate: true };
      case 'users.delete':
        return { ...acc, canDelete: true };
      case 'users.create':
        return { ...acc, canCreate: true };
      case 'users.export':
        return { ...acc, canExport: true };
      case 'users.import':
        return { ...acc, canImport: true };
      default:
        return acc;
    }
  }, {});
  const [activeRequestData, setActiveRequestData] = useState<ActiveUserInterface>({})
  // active employees first (the API already sorts this way; kept here so the order holds after a status change)
  const sortedUsers = Array.isArray(userList)
    ? [...userList].sort((a: any, b: any) => (b.active === true ? 1 : 0) - (a.active === true ? 1 : 0))
    : []
  const activeCount = sortedUsers.filter((item: any) => item.active === true).length
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    await backendGetAllUsers().then((res) => {
      dispatch({
        type: 'GET_USERS',
        payload: res.data
      })
      setIsLoading(false)
    })
  }
  useEffect(() => {
    
    fetchCustomers()
  }, [activeRequestData])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [roleFilter, setRoleFilter] = useState('')
  const [busyId, setBusyId] = useState('')

  const handleDeleteItem = (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    backendDeleteUser(id).then((result) => {
      if (!result.isError) {
        fetchCustomers()
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const handleActiveItem = async (data: any) => {
    setBusyId(data.userid)
    backendPostUserStatus(data).finally(() => setBusyId('')).then((result) => {
      if (!result.isError) {
        setActiveRequestData(data)
        fetchCustomers()

      }
    }).catch((err) => {

    });
  };

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(userList.map(async (customer: any) => {
      customer.createdAt = (customer.createdAt) ? new Date(customer.createdAt).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
      }) : ''
      return customer
    }))
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "users.xlsx");
  }

  const roleOf = (item: any) => String(item.userType || '').trim()
  const roles = Array.from(new Set(sortedUsers.map(roleOf).filter(Boolean))).sort()
  const noRoleCount = sortedUsers.filter((item: any) => !roleOf(item)).length
  const term = search.trim().toLowerCase()
  const shown = sortedUsers.filter((item: any) => {
    if (statusFilter === 'active' && item.active !== true) return false
    if (statusFilter === 'inactive' && item.active === true) return false
    if (roleFilter === '__none__' && roleOf(item)) return false
    if (roleFilter && roleFilter !== '__none__' && roleOf(item) !== roleFilter) return false
    if (!term) return true
    return `${item.firstName || ''} ${item.lastName || ''} ${item.mobile || ''} ${item.email || ''} ${roleOf(item)}`.toLowerCase().includes(term)
  })
  const initials = (item: any) =>
    `${String(item.firstName || '').trim().charAt(0)}${String(item.lastName || '').trim().charAt(0)}`.toUpperCase() || '?'

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Users</h3>
          <div className="text-muted small">
            {sortedUsers.length} users · {activeCount} active · {sortedUsers.length - activeCount} inactive
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {moduleAccess?.canExport ? (
            <Button className="cd-btn cd-btn-outline" onClick={handleOnExport}>
              <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
            </Button>
          ) : null}
          {moduleAccess?.canCreate ? (
            <Link href={{ pathname: '/users/create' }}>
              <Button variant="dark" className="cd-btn"><PersonPlus /> Add User</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <InputGroup className="tx-search">
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              placeholder="Search name, mobile, email"
            />
            {search ? <Button variant="outline-secondary" onClick={() => setSearch('')} title="Clear search"><X /></Button> : null}
          </InputGroup>
          <Form.Select style={{ width: 200 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Role">
            <option value="">All roles</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            {noRoleCount ? <option value="__none__">No role ({noRoleCount})</option> : null}
          </Form.Select>
          <div className="rd-status-tabs">
            {([
              ['all', `All (${sortedUsers.length})`],
              ['active', `Active (${activeCount})`],
              ['inactive', `Inactive (${sortedUsers.length - activeCount})`],
            ] as Array<['all' | 'active' | 'inactive', string]>).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`rd-status-tab ${statusFilter === value ? 'active' : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {value !== 'all' ? <span className={`rd-dot ${value === 'active' ? 'bg-success' : 'bg-secondary'}`} /> : null} {label}
              </button>
            ))}
          </div>
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>Status</th>
                {moduleAccess?.canUpdate || moduleAccess?.canDelete ? <th className="text-end">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {isLoading && !sortedUsers.length ? (
                <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : shown.length ? (
                shown.map((item: any) => {
                  const name = `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-'
                  return (
                    <tr key={item._id} className={item.active === true ? '' : 'us-inactive'}>
                      <td>
                        <Link href={{ pathname: '/users/' + item._id }} className="d-inline-flex align-items-center gap-2">
                          <span className={`us-avatar ${item.active === true ? 'on' : ''}`}>{initials(item)}</span>
                          <span className="min-w-0">
                            <span className="tx-firm d-block">{name}</span>
                            {item.email ? <span className="tx-sub d-block">{item.email}</span> : null}
                          </span>
                        </Link>
                      </td>
                      <td>
                        {roleOf(item)
                          ? <Badge bg="light" text="dark" className="border rd-status">{roleOf(item)}</Badge>
                          : <span className="text-muted small">No role</span>}
                      </td>
                      <td className="text-nowrap">{item.mobile ? `${item.phoneCode || ''}${item.mobile}` : '-'}</td>
                      <td>{item.gender || '-'}</td>
                      <td className="text-nowrap">
                        {moduleAccess?.canUpdate ? (
                          <Form.Check
                            type="switch"
                            id={`user-status-${item._id}`}
                            className="d-inline-flex align-items-center gap-2"
                            checked={item.active === true}
                            disabled={busyId === item._id}
                            label={item.active === true ? 'Active' : 'Inactive'}
                            onChange={(e) => {
                              const active = e.target.checked
                              if (window.confirm(`${active ? 'Activate' : 'Deactivate'} ${name}?${active ? '' : ' They will be logged out of the CRM.'}`)) {
                                handleActiveItem({ userid: item._id, active })
                              }
                            }}
                          />
                        ) : (
                          <Badge bg={item.active === true ? 'success' : 'secondary'} className="rd-status">{item.active === true ? 'Active' : 'Inactive'}</Badge>
                        )}
                      </td>
                      {moduleAccess?.canUpdate || moduleAccess?.canDelete ? (
                        <td className="text-end text-nowrap">
                          {moduleAccess?.canUpdate ? (
                            <Link href={{ pathname: '/users/create', query: { id: item._id } }}>
                              <Button size="sm" variant="light" className="tx-icon-btn" title="Edit"><PencilSquare /></Button>
                            </Link>
                          ) : null}
                          {moduleAccess?.canDelete ? (
                            <Button size="sm" variant="light" className="tx-icon-btn text-danger ms-1" title="Delete" onClick={() => handleDeleteItem(item._id, name)}>
                              <Trash />
                            </Button>
                          ) : null}
                        </td>
                      ) : null}
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan={6} className="text-center text-muted py-5">No users found</td></tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="small text-muted mt-3">Showing {shown.length} of {sortedUsers.length} users</div>
      </div>
    </Layout>
  )
}
