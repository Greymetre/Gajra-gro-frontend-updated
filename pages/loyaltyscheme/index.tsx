import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { Button, Card, Col, Dropdown, Row, Table, Form, Accordion, Image , Spinner } from 'react-bootstrap'
import { PencilSquare, PlusCircleFill, XCircleFill, XSquare } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteLoyaltyScheme, backendGetAllLoyaltySchemes } from '../../helpers/backend_helper'
import Link from 'next/link'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

export default function LoyaltyScheme() {
  const router = useRouter()
  const [showFilterForm, setShowFilterForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const toggleFilterForm = () => {
    setShowFilterForm(!showFilterForm)
  }
  const loyaltyList = useSelector((state: any) => state?.loyaltyscheme?.loyaltyscheme);
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'loyaltyscheme.read':
        return { ...acc, canRead: true };
      case 'loyaltyscheme.update':
        return { ...acc, canUpdate: true };
      case 'loyaltyscheme.delete':
        return { ...acc, canDelete: true };
      case 'loyaltyscheme.create':
        return { ...acc, canCreate: true };
      case 'loyaltyscheme.export':
        return { ...acc, canExport: true };
      case 'loyaltyscheme.import':
        return { ...acc, canImport: true };
      default:
        return acc;
    }
  }, {});
  const dispatch = useDispatch();
  const fetchLoyaltySchemes = async () => {
    await backendGetAllLoyaltySchemes().then((res) => {
      setIsLoading(false)
      dispatch({
        type: 'GET_LOYALTYSCHEMES',
        payload: res.data
      })
    })
  }
  useEffect(() => {
    fetchLoyaltySchemes()
  }, [])

  const handleDeleteItem = (id: string) => {
    backendDeleteLoyaltyScheme(id).then((result) => {
      if (!result.isError) {
        router.push('/loyaltyscheme');
      }
      else {

      }
    }).catch((err) => {

    });
  };

  // Same rule the backend uses when crediting a scan: active and today between start and end
  const STATUS_STYLE: { [status: string]: { label: string; colour: string } } = {
    live: { label: 'Live', colour: '#16a34a' },
    upcoming: { label: 'Upcoming', colour: '#2563eb' },
    expired: { label: 'Expired', colour: '#6b7280' },
    inactive: { label: 'Inactive', colour: '#dc2626' },
  };
  const schemeStatus = (item: any) => {
    const now = Date.now();
    const start = item.startedAt ? new Date(item.startedAt).getTime() : NaN;
    const end = item.endedAt ? new Date(item.endedAt).getTime() : NaN;
    if (!item.active) return 'inactive';
    if (!isNaN(start) && start > now) return 'upcoming';
    if (!isNaN(end) && end < now) return 'expired';
    return 'live';
  };
  const daysLeft = (item: any) => {
    const end = item.endedAt ? new Date(item.endedAt).getTime() : NaN;
    return isNaN(end) ? null : Math.max(0, Math.ceil((end - Date.now()) / 86400000));
  };
  const schemes = Array.isArray(loyaltyList) ? loyaltyList.map((item: any) => ({ ...item, status: schemeStatus(item) })) : [];
  const sections = [
    { key: 'live', title: 'Live Schemes', items: schemes.filter((s: any) => s.status === 'live') },
    { key: 'upcoming', title: 'Upcoming Schemes', items: schemes.filter((s: any) => s.status === 'upcoming') },
    { key: 'ended', title: 'Expired / Inactive Schemes', items: schemes.filter((s: any) => s.status === 'expired' || s.status === 'inactive') },
  ];

  const renderScheme = (item: any, index: number) => {
    const style = STATUS_STYLE[item.status];
    const live = item.status === 'live';
    const left = live ? daysLeft(item) : null;
    return (
      <Col xl={4} md={6} sm={6} xs={12} key={item._id || index} className='mb-4'>
        <Card
          className='border-30 prod-p-card bg-white h-100'
          style={live
            ? { border: '2px solid ' + style.colour, boxShadow: '0 6px 18px ' + style.colour + '26' }
            : item.status === 'upcoming' ? { border: '1px dashed ' + style.colour } : { opacity: 0.6, filter: 'grayscale(0.6)' }}
        >
          <Card.Body>
            <Row className='align-items-center'>
              <Col xs={12} className='mb-2'>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: style.colour + '1f', color: style.colour }}>
                  {live ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: style.colour }} /> : null}
                  {style.label}
                </span>
                {left !== null ? (
                  <span className='ms-2 f-12' style={{ color: left <= 7 ? '#dc2626' : '#6b7280' }}>
                    {left === 0 ? 'Ends today' : left + ' day' + (left === 1 ? '' : 's') + ' left'}
                  </span>
                ) : null}
              </Col>
              <Col md={10}>
                <Link className="mb-3"
                  href={{
                    pathname: '/loyaltyscheme/' + item._id,
                  }}
                >
                  <div className="media user-about-block align-items-center mt-0 mb-3">
                    <div className="position-relative d-inline-block">
                      <Image
                        src={(item.schemeImage) ? IMAGE_URL + item.schemeImage : IMAGE_URL + PROFILE_DEMO_IMAGE}
                        alt="User image"
                        className="img-fluid wid-56"
                        width={56}
                        height={56}
                      />
                    </div>

                    <div className="media-body ms-3">
                      <h6 className="mb-1 f-16">{item.schemeName}</h6>
                    </div></div>
                </Link>
              </Col>
              <Col md={2} className='text-end'>
              {moduleAccess?.canUpdate ?(<Link className="mb-0"
                  href={{
                    pathname: '/loyaltyscheme/create',
                    query: { id: item._id },
                  }}><Button className="p-0" variant="outline-light"><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></Button></Link>) : null }
              </Col>
              <Col md={7} className='mb-3'>
                <h6 className="mb-1 mr-0 f-12 f-w-300">Scheme Type</h6>
                <span className="text-muted">{item.schemeType}</span>
              </Col>
              <Col md={5} className='mb-3'>
                <h6 className="mb-1 f-12 f-w-400">Point Value</h6>
                <span className="text-muted">{item.pointValue}</span>
              </Col>
              <Col md={7} className='mb-3'>
                <h6 className="mb-1 f-12 f-w-400">Start Date</h6>
                <span className="text-muted">{new Date(item.startedAt).toLocaleDateString()}</span>
              </Col>
              <Col md={5} className='mb-3'>
                <h6 className="mb-1 f-12 f-w-400">End Date</h6>
                <span className={item.status === 'expired' ? 'text-danger' : 'text-muted'}>{new Date(item.endedAt).toLocaleDateString()}</span>
              </Col>
              <Col md={12} className='mb-3'>
                <h6 className="mb-1 f-12 f-w-400">Description</h6>
                <span className="text-muted">{item.schemeDescription}</span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    )
  };

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='LoyaltyScheme List' />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className='align-items-center mb-4'>
            <Col md={6}>
              <h3 className="card-body">LoyaltyScheme List({Array.isArray(loyaltyList) ? loyaltyList.length : '0'})</h3>
            </Col>
            <Col md={6} className='text-end'>
              <div className="card-body">
              {moduleAccess?.canCreate ?(<Link
                  href={{
                    pathname: '/loyaltyscheme/create',
                  }}
                >
                  <Button variant="dark"><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add LoyaltyScheme</Button>
                </Link>) : null }
              </div>
            </Col>
          </Row>
        </Col>

        {sections.map((section) => section.items.length ? (
          <React.Fragment key={section.key}>
            <Col xs={12} className='mb-3'>
              <h5 className='mb-0'>{section.title} ({section.items.length})</h5>
            </Col>
            {section.items.map(renderScheme)}
          </React.Fragment>
        ) : null)}
        {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
      </Row>
    </Layout>
  )
}

