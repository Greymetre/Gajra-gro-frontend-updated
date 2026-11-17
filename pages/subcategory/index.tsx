import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Image, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Grid3x3GapFill, ListUl, PencilSquare, PlusCircle, Search, X } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import { backendGetAllSubCategories } from '../../helpers/backend_helper'
import Link from 'next/link'
import { IMAGE_URL, PROFILE_DEMO_IMAGE } from '../../utils/constant'

type ActiveFilter = 'all' | 'active' | 'inactive'

export default function SubCategoryList() {
  const subcategoryList = useSelector((state: any) => state?.subcategory?.subcategory)
  const permissionData = useSelector((state: any) => state?.permission?.permission)
  const canCreate = Array.isArray(permissionData) && permissionData.includes('subcategory.create')
  const canUpdate = Array.isArray(permissionData) && permissionData.includes('subcategory.update')
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const fetchSubCategories = async () => {
    setIsLoading(true)
    try {
      const res = await backendGetAllSubCategories()
      dispatch({ type: 'GET_SUBCATEGORYS', payload: res.data })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchSubCategories()
  }, [])

  // ranked first (lowest rank on top), unranked (1000) after, then by name
  const all: any[] = (Array.isArray(subcategoryList) ? [...subcategoryList] : []).sort((a, b) =>
    (Number(a.ranking ?? 1000) - Number(b.ranking ?? 1000)) ||
    String(a.subcategoryName || '').localeCompare(String(b.subcategoryName || '')))
  const categories = Array.from(new Set(all.map((item) => item.categoryName).filter(Boolean))).sort()
  const activeCount = all.filter((item) => item.active === true).length
  const term = search.trim().toLowerCase()
  const shown = all.filter((item) => {
    if (category && item.categoryName !== category) return false
    if (activeFilter === 'active' && item.active !== true) return false
    if (activeFilter === 'inactive' && item.active === true) return false
    if (!term) return true
    return `${item.subcategoryName || ''} ${item.subcategoryDescription || ''} ${item.categoryName || ''}`.toLowerCase().includes(term)
  })

  const imageOf = (item: any) => (item.subcategoryImage ? IMAGE_URL + item.subcategoryImage : IMAGE_URL + PROFILE_DEMO_IMAGE)
  const hasRank = (item: any) => item.ranking !== undefined && item.ranking !== null && Number(item.ranking) !== 1000
  const statusBadge = (item: any) =>
    item.active === true
      ? <Badge bg="success" className="rd-status">Active</Badge>
      : <Badge bg="secondary" className="rd-status">Inactive</Badge>
  const editButton = (item: any) =>
    canUpdate ? (
      <Link href={{ pathname: '/subcategory/create', query: { id: item._id } }}>
        <Button size="sm" variant="light" className="tx-icon-btn" title="Edit sub category"><PencilSquare /></Button>
      </Link>
    ) : null

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Sub Categories</h3>
          <div className="text-muted small">
            {all.length} sub categories in {categories.length} categories · {activeCount} active · {all.length - activeCount} inactive
          </div>
        </div>
        {canCreate ? (
          <Link href={{ pathname: '/subcategory/create' }}>
            <Button variant="dark" className="cd-btn"><PlusCircle /> Add Sub Category</Button>
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
                placeholder="Search sub category"
              />
              {search ? <Button variant="outline-secondary" onClick={() => setSearch('')} title="Clear search"><X /></Button> : null}
            </InputGroup>
            <Form.Select style={{ width: 220 }} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
              <option value="">All categories</option>
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </Form.Select>
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
          <div className="text-center text-muted py-5">No sub categories found</div>
        ) : view === 'grid' ? (
          <Row className="g-3">
            {shown.map((item) => (
              <Col xxl={3} xl={4} md={6} xs={12} key={item._id}>
                <div className="cat-card">
                  <Link href={{ pathname: '/subcategory/' + item._id }} className="cat-card-img">
                    <Image src={imageOf(item)} alt={item.subcategoryName} />
                  </Link>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div className="min-w-0">
                        <Link href={{ pathname: '/subcategory/' + item._id }} className="cat-card-name">
                          {item.subcategoryName || '-'}
                        </Link>
                        {item.categoryName ? <div className="small text-muted">{item.categoryName}</div> : null}
                      </div>
                      {editButton(item)}
                    </div>
                    <div className="cat-card-desc" title={item.subcategoryDescription}>
                      {item.subcategoryDescription || <span className="text-muted">No description</span>}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      {statusBadge(item)}
                      {hasRank(item) ? <span className="small text-muted">Rank {item.ranking}</span> : null}
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
                  <th>Sub Category</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  {canUpdate ? <th className="text-end">Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => (
                  <tr key={item._id}>
                    <td className="text-muted">{hasRank(item) ? item.ranking : '-'}</td>
                    <td>
                      <Link href={{ pathname: '/subcategory/' + item._id }} className="d-inline-flex align-items-center gap-2 tx-firm">
                        <Image src={imageOf(item)} alt="" className="cat-list-img" /> {item.subcategoryName || '-'}
                      </Link>
                    </td>
                    <td>{item.categoryName || '-'}</td>
                    <td className="tx-ellipsis" style={{ maxWidth: 380 }} title={item.subcategoryDescription}>{item.subcategoryDescription || '-'}</td>
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
