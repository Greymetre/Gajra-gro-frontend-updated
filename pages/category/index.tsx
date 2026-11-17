import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Image, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Grid3x3GapFill, ListUl, PencilSquare, PlusCircle, Search, X } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import { backendGetAllCategories } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, PROFILE_DEMO_IMAGE } from '../../utils/constant'

type ActiveFilter = 'all' | 'active' | 'inactive'

export default function CategoryList() {
  const categoryList = useSelector((state: any) => state?.categorys?.categorys)
  const permissionData = useSelector((state: any) => state?.permission?.permission)
  const canCreate = Array.isArray(permissionData) && permissionData.includes('category.create')
  const canUpdate = Array.isArray(permissionData) && permissionData.includes('category.update')
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await backendGetAllCategories()
      dispatch({ type: 'GET_CATEGORY', payload: res.data })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])

  const all: any[] = Array.isArray(categoryList) ? categoryList : []
  const activeCount = all.filter((item) => item.active === true).length
  const term = search.trim().toLowerCase()
  const shown = all.filter((item) => {
    if (activeFilter === 'active' && item.active !== true) return false
    if (activeFilter === 'inactive' && item.active === true) return false
    if (!term) return true
    return `${item.categoryName || ''} ${item.categoryDescription || ''}`.toLowerCase().includes(term)
  })

  const imageOf = (item: any) => (item.categoryImage ? IMAGE_URL + item.categoryImage : IMAGE_URL + PROFILE_DEMO_IMAGE)
  const statusBadge = (item: any) =>
    item.active === true
      ? <Badge bg="success" className="rd-status">Active</Badge>
      : <Badge bg="secondary" className="rd-status">Inactive</Badge>
  const editButton = (item: any) =>
    canUpdate ? (
      <Link href={{ pathname: '/category/create', query: { id: item._id } }}>
        <Button size="sm" variant="light" className="tx-icon-btn" title="Edit category"><PencilSquare /></Button>
      </Link>
    ) : null

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Categories</h3>
          <div className="text-muted small">
            {all.length} categories · {activeCount} active · {all.length - activeCount} inactive
          </div>
        </div>
        {canCreate ? (
          <Link href={{ pathname: '/category/create' }}>
            <Button variant="dark" className="cd-btn"><PlusCircle /> Add Category</Button>
          </Link>
        ) : null}
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <InputGroup className="tx-search">
              <InputGroup.Text><Search /></InputGroup.Text>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                placeholder="Search category"
              />
              {search ? <Button variant="outline-secondary" onClick={() => setSearch('')} title="Clear search"><X /></Button> : null}
            </InputGroup>
            <div className="rd-status-tabs">
              {([
                ['all', `All (${all.length})`],
                ['active', `Active (${activeCount})`],
                ['inactive', `Inactive (${all.length - activeCount})`],
              ] as Array<[ActiveFilter, string]>).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`rd-status-tab ${activeFilter === value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="btn-group" role="group" aria-label="View">
            <Button size="sm" variant={view === 'grid' ? 'dark' : 'outline-secondary'} onClick={() => setView('grid')} title="Card view">
              <Grid3x3GapFill />
            </Button>
            <Button size="sm" variant={view === 'list' ? 'dark' : 'outline-secondary'} onClick={() => setView('list')} title="List view">
              <ListUl />
            </Button>
          </div>
        </div>

        {isLoading && !all.length ? (
          <div className="text-center py-5"><Spinner animation="border" size="sm" /></div>
        ) : !shown.length ? (
          <div className="text-center text-muted py-5">No categories found</div>
        ) : view === 'grid' ? (
          <Row className="g-3">
            {shown.map((item) => (
              <Col xxl={3} xl={4} md={6} xs={12} key={item._id}>
                <div className="cat-card">
                  <Link href={{ pathname: '/category/' + item._id }} className="cat-card-img">
                    <Image src={imageOf(item)} alt={item.categoryName} />
                  </Link>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <Link href={{ pathname: '/category/' + item._id }} className="cat-card-name">
                        {item.categoryName || '-'}
                      </Link>
                      {editButton(item)}
                    </div>
                    <div className="cat-card-desc" title={item.categoryDescription}>
                      {item.categoryDescription || <span className="text-muted">No description</span>}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      {statusBadge(item)}
                      {item.ranking !== undefined && item.ranking !== 1000 ? (
                        <span className="small text-muted">Rank {item.ranking}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="tx-table-wrap">
            <table className="table table-hover mb-0 tx-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  {canUpdate ? <th className="text-end">Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => (
                  <tr key={item._id}>
                    <td className="text-muted">{item.ranking !== undefined && item.ranking !== 1000 ? item.ranking : '-'}</td>
                    <td>
                      <Link href={{ pathname: '/category/' + item._id }} className="d-inline-flex align-items-center gap-2 tx-firm">
                        <Image src={imageOf(item)} alt="" className="cat-list-img" /> {item.categoryName || '-'}
                      </Link>
                    </td>
                    <td className="tx-ellipsis" style={{ maxWidth: 420 }} title={item.categoryDescription}>{item.categoryDescription || '-'}</td>
                    <td>{statusBadge(item)}</td>
                    {canUpdate ? <td className="text-end">{editButton(item)}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
