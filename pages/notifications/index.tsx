import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Image, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { SendFill } from 'react-bootstrap-icons'
import Select from 'react-select'
import debounce from 'lodash.debounce'
import moment from 'moment'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import PaginationNav from '../../components/Common/PaginationNav'
import { backendGetNewsFilters, backendGetNewsHistory, backendSendNews } from '../../helpers/backend_helper'
import { IMAGE_URL } from '../../utils/constant'

// Same flow as Duke's News Management: filter State -> District -> City -> Customers,
// then send a title, message and optional image as a push + in-app notification.

type Option = { value: string; label: string }
type Filters = { stateId: string; districtId: string; cityId: string }

const TITLE_MAX = 150
const MESSAGE_MAX = 1000
const IMAGE_MAX_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const HISTORY_LIMIT = 20

const emptyFilters: Filters = { stateId: '', districtId: '', cityId: '' }
const allOption = (label: string): Option => ({ value: '', label })

const errorMessage = (error: any, fallback: string) => {
  const message = error?.response?.data?.message
  if (typeof message === 'string') return message
  if (Array.isArray(message)) return message.join(', ')
  return fallback
}

export default function NewsManagement() {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send')
  const [accessDenied, setAccessDenied] = useState(false)

  // ---- filters ----
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [states, setStates] = useState<Option[]>([])
  const [districts, setDistricts] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [customerOptions, setCustomerOptions] = useState<Option[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<Option[]>([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const requestId = useRef(0)

  // ---- form ----
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const [sending, setSending] = useState(false)
  const [alert, setAlert] = useState<{ variant: 'success' | 'danger'; text: string } | null>(null)

  // ---- history ----
  const [history, setHistory] = useState({ docs: [] as any[], totalDocs: 0, totalPages: 0, page: 1 })
  const [loadingHistory, setLoadingHistory] = useState(false)

  const loadFilters = useCallback(async (next: Filters, search = '') => {
    const id = ++requestId.current
    setLoadingFilters(true)
    try {
      const params: Record<string, string> = {}
      Object.entries(next).forEach(([key, value]) => { if (value) params[key] = value })
      if (search) params.search = search
      const res = await backendGetNewsFilters(params)
      if (id !== requestId.current || res?.isError) return
      const data = res.data || {}
      setStates(data.states || [])
      setDistricts(data.districts || [])
      setCities(data.cities || [])
      setCustomerOptions(data.customers || [])
      setTotalCustomers(data.totalCustomers || 0)
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
    } finally {
      if (id === requestId.current) setLoadingFilters(false)
    }
  }, [])

  useEffect(() => { loadFilters(emptyFilters) }, [loadFilters])

  // Customer search is done on the server (customers list can be large).
  const searchCustomers = useMemo(
    () => debounce((search: string, current: Filters) => loadFilters(current, search), 400),
    [loadFilters],
  )
  useEffect(() => () => searchCustomers.cancel(), [searchCustomers])

  const changeFilter = (key: keyof Filters, value: string) => {
    // Like Duke: changing State resets District/City, changing District resets City; customers are cleared.
    const next: Filters =
      key === 'stateId' ? { stateId: value, districtId: '', cityId: '' }
        : key === 'districtId' ? { ...filters, districtId: value, cityId: '' }
          : { ...filters, cityId: value }
    setFilters(next)
    setSelectedCustomers([])
    loadFilters(next)
  }

  const selectedOption = (options: Option[], value: string, placeholder: string) =>
    options.find((o) => o.value === value) || allOption(placeholder)

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    if (file && !IMAGE_TYPES.includes(file.type)) {
      setAlert({ variant: 'danger', text: 'Image must be JPG, PNG or WebP.' })
      setImage(null); setImagePreview(''); setFileInputKey((k) => k + 1)
      return
    }
    if (file && file.size > IMAGE_MAX_BYTES) {
      setAlert({ variant: 'danger', text: 'Image can be at most 5 MB.' })
      setImage(null); setImagePreview(''); setFileInputKey((k) => k + 1)
      return
    }
    setImage(file)
    setImagePreview(file ? URL.createObjectURL(file) : '')
  }

  const resetForm = () => {
    setTitle(''); setMessage(''); setImage(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(''); setFileInputKey((k) => k + 1)
    setSelectedCustomers([])
  }

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()
    setAlert(null)
    if (!title.trim() || !message.trim()) {
      setAlert({ variant: 'danger', text: 'Notification title and message are required.' })
      return
    }
    const audience = selectedCustomers.length || totalCustomers
    if (!audience) {
      setAlert({ variant: 'danger', text: 'No active customers matched the selected filters.' })
      return
    }
    if (!window.confirm(`Send this news to ${audience.toLocaleString('en-IN')} customer(s)?`)) return

    const formData = new FormData()
    Object.entries(filters).forEach(([key, value]) => { if (value) formData.append(key, value) })
    if (selectedCustomers.length) formData.append('customerIds', JSON.stringify(selectedCustomers.map((c) => c.value)))
    formData.append('title', title.trim())
    formData.append('message', message.trim())
    if (image) formData.append('image', image)

    setSending(true)
    try {
      const res = await backendSendNews(formData)
      const sent = res?.data?.recipientCount > 0
      setAlert({ variant: sent ? 'success' : 'danger', text: res?.message || 'News sent.' })
      if (sent) resetForm()
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
      setAlert({ variant: 'danger', text: errorMessage(error, 'Unable to send news. Please try again.') })
    } finally {
      setSending(false)
    }
  }

  const loadHistory = async (page: number) => {
    setLoadingHistory(true)
    try {
      const res = await backendGetNewsHistory({ page, limit: HISTORY_LIMIT })
      if (!res?.isError && res.data) setHistory(res.data)
    } catch (error: any) {
      if (error?.response?.status === 403) setAccessDenied(true)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => { if (activeTab === 'history') loadHistory(1) }, [activeTab])

  const locationText = (f: any) =>
    [f?.city, f?.district, f?.state].filter(Boolean).join(', ') || 'All locations'

  if (accessDenied) {
    return (
      <Layout>
        <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='News Management' />
        <h3 className="mb-3">Access denied</h3>
        <p>You do not have permission to use News Management.</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='News Management' />
      <Row>
        <Col xs={12} className="mb-3">
          <h3 className="mb-0">News Management</h3>
        </Col>
        <Col xs={12}>
          <Tabs activeKey={activeTab} onSelect={(key) => key && setActiveTab(key as 'send' | 'history')} className="mb-3">
            <Tab eventKey="send" title="Send News">
              <Card className="flat-card">
                <Card.Body>
                  {alert ? <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>{alert.text}</Alert> : null}
                  <Form onSubmit={handleSend}>
                    <Row className="g-3">
                      <Col md={3} sm={6} xs={12}>
                        <Form.Label>State</Form.Label>
                        <Select
                          instanceId="news-state"
                          options={[allOption('All States'), ...states]}
                          value={selectedOption(states, filters.stateId, 'All States')}
                          onChange={(o: any) => changeFilter('stateId', o?.value || '')}
                          isSearchable
                        />
                      </Col>
                      <Col md={3} sm={6} xs={12}>
                        <Form.Label>District</Form.Label>
                        <Select
                          instanceId="news-district"
                          options={[allOption('All Districts'), ...districts]}
                          value={selectedOption(districts, filters.districtId, 'All Districts')}
                          onChange={(o: any) => changeFilter('districtId', o?.value || '')}
                          isSearchable
                        />
                      </Col>
                      <Col md={3} sm={6} xs={12}>
                        <Form.Label>City</Form.Label>
                        <Select
                          instanceId="news-city"
                          options={[allOption('All Cities'), ...cities]}
                          value={selectedOption(cities, filters.cityId, 'All Cities')}
                          onChange={(o: any) => changeFilter('cityId', o?.value || '')}
                          isSearchable
                        />
                      </Col>
                      <Col md={3} sm={6} xs={12}>
                        <Form.Label>Customers</Form.Label>
                        <Select
                          instanceId="news-customers"
                          isMulti
                          closeMenuOnSelect={false}
                          placeholder="All Customers"
                          options={customerOptions}
                          value={selectedCustomers}
                          onChange={(value: any) => setSelectedCustomers(Array.isArray(value) ? value : [])}
                          onInputChange={(input: string, meta: any) => {
                            if (meta.action === 'input-change') searchCustomers(input, filters)
                          }}
                          filterOption={() => true}
                          isLoading={loadingFilters}
                          noOptionsMessage={() => 'No customers found'}
                        />
                        <Form.Text muted>
                          {selectedCustomers.length
                            ? `${selectedCustomers.length} selected customer(s)`
                            : `All ${totalCustomers.toLocaleString('en-IN')} matching customer(s)`}
                        </Form.Text>
                      </Col>

                      <Col xs={12}>
                        <Form.Label htmlFor="newsTitle">Notification Title</Form.Label>
                        <Form.Control
                          id="newsTitle"
                          type="text"
                          maxLength={TITLE_MAX}
                          placeholder="Enter the notification title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                        <Form.Text muted>Maximum {TITLE_MAX} characters. ({title.length}/{TITLE_MAX})</Form.Text>
                      </Col>

                      <Col xs={12}>
                        <Form.Label htmlFor="newsMessage">Notification Message</Form.Label>
                        <Form.Control
                          id="newsMessage"
                          as="textarea"
                          rows={5}
                          maxLength={MESSAGE_MAX}
                          placeholder="Enter the message to send..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                        <Form.Text muted>Maximum {MESSAGE_MAX} characters. ({message.length}/{MESSAGE_MAX})</Form.Text>
                      </Col>

                      <Col md={6} xs={12}>
                        <Form.Label htmlFor="newsImage">Notification Image <span className="text-muted">(optional)</span></Form.Label>
                        <Form.Control
                          key={fileInputKey}
                          id="newsImage"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={onImageChange}
                        />
                        <Form.Text muted>JPG, PNG or WebP, maximum 5 MB.</Form.Text>
                      </Col>
                      <Col md={6} xs={12}>
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Notification image preview" rounded fluid style={{ maxHeight: 180 }} />
                        ) : null}
                      </Col>

                      <Col xs={12}>
                        <Button type="submit" variant="dark" disabled={sending}>
                          {sending ? <Spinner animation="border" size="sm" /> : <SendFill />} {sending ? 'Sending...' : 'Send News'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="history" title="News History">
              <div className="mb-2">
                <PaginationNav
                  align="start"
                  currentPage={history.page || 1}
                  totalPages={history.totalPages}
                  disabled={loadingHistory}
                  onPageChange={(page) => loadHistory(page)}
                />
              </div>
              <Card className="flat-card p-0">
                <div className="table-responsive">
                  <Table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="text-nowrap">Sent At</th>
                        <th>Title / Message</th>
                        <th>Image</th>
                        <th>Location</th>
                        <th className="text-nowrap">Customers</th>
                        <th className="text-nowrap">Push Sent</th>
                        <th className="text-nowrap">Push Failed</th>
                        <th className="text-nowrap">No App Token</th>
                        <th className="text-nowrap">Seen</th>
                        <th className="text-nowrap">Sent By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingHistory ? (
                        <tr><td colSpan={11} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
                      ) : history.docs.length ? (
                        history.docs.map((row: any, index: number) => (
                          <tr key={row._id}>
                            <td>{((history.page || 1) - 1) * HISTORY_LIMIT + index + 1}</td>
                            <td className="text-nowrap">{row.createdAt ? moment(row.createdAt).format('DD-MM-YYYY hh:mm A') : ''}</td>
                            <td style={{ minWidth: 260, whiteSpace: 'pre-wrap' }}>
                              <strong>{row.title}</strong>
                              <div className="small">{row.message}</div>
                            </td>
                            <td>
                              {row.image ? (
                                <a href={IMAGE_URL + row.image} target="_blank" rel="noreferrer">
                                  <Image src={IMAGE_URL + row.image} alt="" rounded style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                </a>
                              ) : '-'}
                            </td>
                            <td>
                              {locationText(row.filters)}
                              {row.filters?.customerIds?.length ? <div className="small text-muted">{row.filters.customerIds.length} selected customer(s)</div> : null}
                            </td>
                            <td>{row.recipientCount ?? 0}</td>
                            <td>{row.pushSentCount ?? 0}</td>
                            <td>{row.pushFailedCount ?? 0}</td>
                            <td>{row.withoutTokenCount ?? 0}</td>
                            <td>{row.seenCount ?? 0}</td>
                            <td className="text-nowrap">{row.createdByName || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={11} className="text-center">No news sent yet</td></tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Layout>
  )
}
