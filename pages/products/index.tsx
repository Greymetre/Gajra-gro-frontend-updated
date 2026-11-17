import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Image, InputGroup, Row, Spinner, Table } from 'react-bootstrap'
import { Grid3x3GapFill, ListUl, PencilSquare, PlusCircle, Search, X } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import PaginationNav from '../../components/Common/PaginationNav'
import { backendGetAllProducts } from '../../helpers/backend_helper'
import Link from 'next/link'
import { EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE } from '../../utils/constant'
import { ProductViewInterface } from '../../interfaces/product.interface'
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface'
import * as XLSX from 'xlsx'

const money = (value: any) => {
  const number = Number(value)
  return value === undefined || value === null || value === '' || Number.isNaN(number)
    ? '-'
    : `₹ ${number.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export default function Product() {
  const [isLoading, setIsLoading] = useState(true)
  const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
  const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
  const [productData, setProductData] = useState<Array<ProductViewInterface>>([])
  const [view, setView] = useState<'list' | 'grid'>('list')
  // search box text; the list reloads 400 ms after typing stops
  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationData((prev) => (prev.search === searchText ? prev : { ...prev, currentPage: 1, search: searchText }))
    }, 400)
    return () => clearTimeout(timer)
  }, [searchText])

  const permissionData = useSelector((state: any) => state?.permission?.permission)
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'products.read':
        return { ...acc, canRead: true }
      case 'products.update':
        return { ...acc, canUpdate: true }
      case 'products.delete':
        return { ...acc, canDelete: true }
      case 'products.create':
        return { ...acc, canCreate: true }
      case 'products.export':
        return { ...acc, canExport: true }
      case 'products.import':
        return { ...acc, canImport: true }
      default:
        return acc
    }
  }, {})

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await backendGetAllProducts(paginationData)
      const { docs, paginate } = res.data
      const totalData = (Array.isArray(paginate) && paginate.length && paginate[0].totalDocs) || 0
      setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: Math.ceil(totalData / paginationData.recordPerPage) })
      setProductData(Array.isArray(docs) ? docs : [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [paginationData])

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(productData)
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, 'products.xlsx')
  }

  const total = Number(resPaginateData.totalDocs) || 0
  const perPage = Number(paginationData.recordPerPage) || 100
  const from = total ? (paginationData.currentPage - 1) * perPage + 1 : 0
  const to = Math.min(paginationData.currentPage * perPage, total)
  const imageOf = (item: any) => (Array.isArray(item.images) && item.images[0] ? IMAGE_URL + item.images[0] : IMAGE_URL + PROFILE_DEMO_IMAGE)
  const statusBadge = (item: any) =>
    item.active === true
      ? <Badge bg="success" className="rd-status">Active</Badge>
      : <Badge bg="secondary" className="rd-status">Inactive</Badge>
  const editButton = (item: any) =>
    moduleAccess?.canUpdate ? (
      <Link href={{ pathname: '/products/create', query: { id: item._id } }}>
        <Button size="sm" variant="light" className="tx-icon-btn" title="Edit product"><PencilSquare /></Button>
      </Link>
    ) : null

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Products</h3>
          <div className="text-muted small">{total.toLocaleString('en-IN')} products{paginationData.search ? ' match the search' : ''}</div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {moduleAccess?.canExport ? (
            <Button className="cd-btn cd-btn-outline" onClick={handleOnExport} title="Exports the rows on this page">
              <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
            </Button>
          ) : null}
          {moduleAccess?.canCreate ? (
            <Link href={{ pathname: '/products/create' }}>
              <Button variant="dark" className="cd-btn"><PlusCircle /> Add Product</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <InputGroup className="tx-search">
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoComplete="off"
              placeholder="Search name, GG no, category, sub category"
            />
            {searchText ? <Button variant="outline-secondary" onClick={() => setSearchText('')} title="Clear search"><X /></Button> : null}
          </InputGroup>
          <div className="btn-group" role="group" aria-label="View">
            <Button size="sm" variant={view === 'list' ? 'dark' : 'outline-secondary'} onClick={() => setView('list')} title="List view">
              <ListUl />
            </Button>
            <Button size="sm" variant={view === 'grid' ? 'dark' : 'outline-secondary'} onClick={() => setView('grid')} title="Card view">
              <Grid3x3GapFill />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" size="sm" /></div>
        ) : !productData.length ? (
          <div className="text-center text-muted py-5">No products found</div>
        ) : view === 'list' ? (
          <div className="tx-table-wrap">
            <Table hover className="mb-0 tx-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>GG No</th>
                  <th>Part No</th>
                  <th>Category</th>
                  <th className="text-end">MRP</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Points</th>
                  <th>Status</th>
                  {moduleAccess?.canUpdate ? <th className="text-end">Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {productData.map((item: any) => (
                  <tr key={item._id}>
                    <td>
                      <Link href={{ pathname: '/products/' + item._id }} className="d-inline-flex align-items-center gap-2">
                        <Image src={imageOf(item)} alt="" className="cat-list-img" />
                        <span>
                          <span className="tx-firm d-block">{item.name || '-'}</span>
                          {item.isNewLaunch ? <Badge bg="warning" text="dark" className="rd-status">New launch</Badge> : null}
                        </span>
                      </Link>
                    </td>
                    <td className="fw-semibold">{item.productNo || '-'}</td>
                    <td className="tx-mono">{item.partNo || '-'}</td>
                    <td>
                      <div>{item.categoryName || '-'}</div>
                      {item.subcategoryName ? <div className="tx-sub">{item.subcategoryName}</div> : null}
                    </td>
                    <td className="text-end text-muted">{money(item.mrp)}</td>
                    <td className="text-end fw-semibold">{money(item.price)}</td>
                    <td className="text-end"><span className="rd-points">{Number(item.points || 0).toLocaleString('en-IN')}</span></td>
                    <td>{statusBadge(item)}</td>
                    {moduleAccess?.canUpdate ? <td className="text-end">{editButton(item)}</td> : null}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Row className="g-3">
            {productData.map((item: any) => (
              <Col xxl={3} xl={4} md={6} xs={12} key={item._id}>
                <div className="cat-card">
                  <Link href={{ pathname: '/products/' + item._id }} className="cat-card-img">
                    <Image src={imageOf(item)} alt={item.name} />
                  </Link>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div className="min-w-0">
                        <Link href={{ pathname: '/products/' + item._id }} className="cat-card-name">{item.name || '-'}</Link>
                        <div className="small text-muted">GG {item.productNo || '-'}{item.partNo ? ` · ${item.partNo}` : ''}</div>
                      </div>
                      {editButton(item)}
                    </div>
                    <div className="small text-muted mt-1">
                      {[item.categoryName, item.subcategoryName].filter(Boolean).join(' › ') || '-'}
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                      <span className="fw-semibold">{money(item.price)}</span>
                      {item.mrp && Number(item.mrp) !== Number(item.price) ? <del className="small text-muted">{money(item.mrp)}</del> : null}
                      <span className="small text-success fw-semibold">{Number(item.points || 0)} pts</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      {statusBadge(item)}
                      {item.isNewLaunch ? <Badge bg="warning" text="dark" className="rd-status">New launch</Badge> : null}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

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
}
