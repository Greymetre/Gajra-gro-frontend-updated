import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Button, Col, Row, Image, Spinner, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendDeleteLoyaltyScheme, backendGetAllLoyaltySchemes } from '../../helpers/backend_helper'
import Link from 'next/link'
import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import { MECHANIC_CATEGORY_COLOURS } from '../../components/Customer/MechanicCategoryBadge'

// Same rule the backend uses when crediting a scan: active and today between start and end
const STATUS: { [status: string]: { label: string; colour: string } } = {
  live: { label: 'Live', colour: '#16a34a' },
  upcoming: { label: 'Upcoming', colour: '#2563eb' },
  expired: { label: 'Expired', colour: '#6b7280' },
  inactive: { label: 'Inactive', colour: '#dc2626' },
};
const DAY = 86400000;
const time = (value: any) => (value ? new Date(value).getTime() : NaN);
const schemeStatus = (item: any) => {
  const now = Date.now();
  if (!item.active) return 'inactive';
  if (time(item.startedAt) > now) return 'upcoming';
  if (time(item.endedAt) < now) return 'expired';
  return 'live';
};
const formatDate = (value: any) =>
  isNaN(time(value)) ? '-' : new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// "12 days left", "Ends 31 Mar 2050" (far away), "Starts in 3 days", "Ended 5 days ago"
const timeNote = (item: any) => {
  const now = Date.now();
  if (item.status === 'live') {
    const left = Math.ceil((time(item.endedAt) - now) / DAY);
    if (isNaN(left)) return { text: 'No end date', urgent: false };
    if (left > 90) return { text: 'Runs till ' + formatDate(item.endedAt), urgent: false };
    return { text: left <= 0 ? 'Ends today' : left + ' day' + (left === 1 ? '' : 's') + ' left', urgent: left <= 7 };
  }
  if (item.status === 'upcoming') {
    const days = Math.ceil((time(item.startedAt) - now) / DAY);
    return { text: 'Starts in ' + days + ' day' + (days === 1 ? '' : 's'), urgent: false };
  }
  const ago = Math.floor((now - time(item.endedAt)) / DAY);
  return { text: isNaN(ago) || ago < 0 ? '' : ago === 0 ? 'Ended today' : 'Ended ' + ago + ' day' + (ago === 1 ? '' : 's') + ' ago', urgent: false };
};

// Share of the scheme period already gone, for the live progress bar
const progress = (item: any) => {
  const start = time(item.startedAt);
  const end = time(item.endedAt);
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ended', label: 'Expired / Inactive' },
];

const css = `
.ls-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
.ls-stat { background: #fff; border: 1px solid #eceef2; border-radius: 14px; padding: 14px 16px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.ls-stat:hover { box-shadow: 0 4px 14px rgba(15,23,42,.06); }
.ls-stat.on { border-color: #111827; box-shadow: 0 0 0 1px #111827; }
.ls-stat-label { font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: #6b7280; display: flex; align-items: center; gap: 6px; }
.ls-stat-value { font-size: 28px; font-weight: 700; color: #111827; line-height: 1.2; margin-top: 4px; }
.ls-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.ls-toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.ls-tabs { display: inline-flex; background: #eef0f3; border-radius: 10px; padding: 3px; flex-wrap: wrap; }
.ls-tab { border: 0; background: transparent; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #4b5563; }
.ls-tab.on { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.ls-tab span { color: #9ca3af; font-weight: 500; margin-left: 4px; }
.ls-search { max-width: 280px; border-radius: 10px; }
.ls-section { font-size: 15px; font-weight: 700; color: #111827; margin: 6px 0 12px; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.ls-section small { font-weight: 500; color: #9ca3af; font-size: 13px; }
.ls-card { position: relative; background: #fff; border: 1px solid #eceef2; border-radius: 16px; padding: 18px 18px 18px 22px; height: 100%; display: flex; flex-direction: column; gap: 14px; transition: box-shadow .15s, transform .15s; overflow: hidden; }
.ls-card:hover { box-shadow: 0 8px 24px rgba(15,23,42,.08); transform: translateY(-1px); }
.ls-card.live { border-color: #bbf7d0; }
.ls-card.live::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #16a34a; }
.ls-card.upcoming { border-style: dashed; border-color: #93c5fd; }
.ls-card.ended { background: #fafafa; }
.ls-card.ended .ls-name, .ls-card.ended .ls-img, .ls-card.ended .ls-chips { opacity: .65; }
.ls-head { display: flex; gap: 12px; align-items: flex-start; }
.ls-img { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; flex: none; background: #f3f4f6; }
.ls-name { font-size: 16px; font-weight: 700; color: #111827; line-height: 1.3; margin: 0; word-break: break-word; }
.ls-name:hover { text-decoration: underline; }
.ls-pill { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.ls-pulse { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: ls-pulse 1.6s infinite; }
@keyframes ls-pulse { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,.5); } 70% { box-shadow: 0 0 0 6px rgba(22,163,74,0); } 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); } }
@media (prefers-reduced-motion: reduce) { .ls-pulse { animation: none; } }
.ls-note { font-size: 12px; color: #6b7280; margin-top: 4px; }
.ls-note.urgent { color: #dc2626; font-weight: 600; }
.ls-edit { border: 1px solid #eceef2 !important; border-radius: 10px; padding: 6px 8px !important; background: #fff !important; }
.ls-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ls-chip { font-size: 12px; padding: 3px 10px; border-radius: 8px; background: #f3f4f6; color: #374151; font-weight: 500; }
.ls-dates { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; font-size: 13px; color: #374151; }
.ls-dates label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #9ca3af; margin: 0; }
.ls-bar { height: 6px; border-radius: 999px; background: #eef0f3; overflow: hidden; }
.ls-bar > div { height: 100%; border-radius: 999px; background: #16a34a; }
.ls-cats { display: flex; flex-wrap: wrap; gap: 6px; }
.ls-cat { font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 8px; }
.ls-desc { font-size: 13px; color: #6b7280; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ls-empty { background: #fff; border: 1px dashed #d1d5db; border-radius: 16px; padding: 40px 16px; text-align: center; color: #6b7280; }
`;

export default function LoyaltyScheme() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
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
    }).catch(() => { });
  };

  const schemes = (Array.isArray(loyaltyList) ? loyaltyList : []).map((item: any) => ({ ...item, status: schemeStatus(item) }));
  const counts = {
    all: schemes.length,
    live: schemes.filter((s: any) => s.status === 'live').length,
    upcoming: schemes.filter((s: any) => s.status === 'upcoming').length,
    ended: schemes.filter((s: any) => s.status === 'expired' || s.status === 'inactive').length,
  };
  const query = search.trim().toLowerCase();
  const visible = schemes.filter((s: any) =>
    !query || [s.schemeName, s.schemeDescription, s.schemeType].some((v) => String(v || '').toLowerCase().includes(query))
  );
  const sections = [
    { key: 'live', title: 'Live Schemes', hint: 'points credited on every scan', items: visible.filter((s: any) => s.status === 'live') },
    { key: 'upcoming', title: 'Upcoming Schemes', hint: 'start date not reached yet', items: visible.filter((s: any) => s.status === 'upcoming') },
    { key: 'ended', title: 'Expired / Inactive Schemes', hint: 'no points on scans', items: visible.filter((s: any) => s.status === 'expired' || s.status === 'inactive') },
  ].filter((section) => tab === 'all' || tab === section.key);

  const renderScheme = (item: any) => {
    const status = STATUS[item.status];
    const ended = item.status === 'expired' || item.status === 'inactive';
    const note = timeNote(item);
    const customerTypes = Array.isArray(item.customerType) ? item.customerType : item.customerType ? [item.customerType] : [];
    const categories = item.basedOn === 'Percentage' && Array.isArray(item.categoryPercentages) ? item.categoryPercentages : [];
    return (
      <Col xl={4} md={6} xs={12} key={item._id} className='mb-4'>
        <div className={'ls-card ' + (ended ? 'ended' : item.status)}>
          <div className='ls-head'>
            <Image
              src={item.schemeImage ? IMAGE_URL + item.schemeImage : IMAGE_URL + PROFILE_DEMO_IMAGE}
              alt=''
              className='ls-img'
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <span className='ls-pill' style={{ background: status.colour + '1a', color: status.colour }}>
                {item.status === 'live' ? <span className='ls-pulse' /> : null}
                {status.label}
              </span>
              <Link href={{ pathname: '/loyaltyscheme/' + item._id }}>
                <h6 className='ls-name mt-1'>{item.schemeName}</h6>
              </Link>
              {note.text ? <div className={'ls-note' + (note.urgent ? ' urgent' : '')}>{note.text}</div> : null}
            </div>
            {moduleAccess?.canUpdate ? (
              <Link href={{ pathname: '/loyaltyscheme/create', query: { id: item._id } }}>
                <Button className='ls-edit' variant='outline-light' title='Edit scheme'>
                  <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                </Button>
              </Link>
            ) : null}
          </div>

          <div className='ls-chips'>
            {item.schemeType ? <span className='ls-chip'>{item.schemeType}</span> : null}
            {item.basedOn ? <span className='ls-chip'>{categories.length ? 'Mechanic Category %' : 'Based on ' + item.basedOn}</span> : null}
            {customerTypes.map((type: string) => <span className='ls-chip' key={type}>{type}</span>)}
            {item.productCount ? <span className='ls-chip'>{item.productCount} products</span> : null}
          </div>

          {categories.length ? (
            <div className='ls-cats'>
              {categories.map((row: any) => {
                const colour = MECHANIC_CATEGORY_COLOURS[row.category] || '#64748b';
                return (
                  <span key={row.category} className='ls-cat' style={{ background: colour + '1a', color: colour }} title={`${row.category}: ${row.percentage}% total (100% normal scheme + ${Math.max(0, row.percentage - 100)}% this scheme)`}>
                    {row.category} {row.percentage}%
                  </span>
                );
              })}
            </div>
          ) : null}

          {item.schemeDescription && item.schemeDescription !== item.schemeName ? (
            <p className='ls-desc'>{item.schemeDescription}</p>
          ) : null}

          <div style={{ marginTop: 'auto' }}>
            <div className='ls-dates'>
              <div><label>Start</label>{formatDate(item.startedAt)}</div>
              <div className='text-end'><label>End</label><span className={item.status === 'expired' ? 'text-danger' : ''}>{formatDate(item.endedAt)}</span></div>
            </div>
            {item.status === 'live' ? (
              <div className='ls-bar mt-2' title={Math.round(progress(item)) + '% of the scheme period done'}>
                <div style={{ width: progress(item) + '%' }} />
              </div>
            ) : null}
          </div>
        </div>
      </Col>
    )
  };

  return (
    <Layout>
      <style>{css}</style>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='LoyaltyScheme List' />
      <Row className='align-items-center mb-3'>
        <Col md={6}>
          <h3 className='mb-0'>Loyalty Schemes</h3>
        </Col>
        <Col md={6} className='text-md-end mt-2 mt-md-0'>
          {moduleAccess?.canCreate ? (
            <Link href={{ pathname: '/loyaltyscheme/create' }}>
              <Button variant='dark'><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add LoyaltyScheme</Button>
            </Link>
          ) : null}
        </Col>
      </Row>

      <div className='ls-stats'>
        {[
          { key: 'all', label: 'Total', colour: '#111827' },
          { key: 'live', label: 'Live', colour: STATUS.live.colour },
          { key: 'upcoming', label: 'Upcoming', colour: STATUS.upcoming.colour },
          { key: 'ended', label: 'Expired / Inactive', colour: STATUS.expired.colour },
        ].map((stat) => (
          <div key={stat.key} className={'ls-stat' + (tab === stat.key ? ' on' : '')} onClick={() => setTab(stat.key)}>
            <div className='ls-stat-label'><span className='ls-dot' style={{ background: stat.colour }} />{stat.label}</div>
            <div className='ls-stat-value'>{counts[stat.key as keyof typeof counts]}</div>
          </div>
        ))}
      </div>

      <div className='ls-toolbar'>
        <div className='ls-tabs'>
          {TABS.map((t) => (
            <button key={t.key} type='button' className={'ls-tab' + (tab === t.key ? ' on' : '')} onClick={() => setTab(t.key)}>
              {t.label}<span>{counts[t.key as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
        <Form.Control
          className='ls-search'
          placeholder='Search scheme'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {sections.map((section) => section.items.length ? (
        <React.Fragment key={section.key}>
          <div className='ls-section'>{section.title} <small>{section.items.length} · {section.hint}</small></div>
          <Row>{section.items.map(renderScheme)}</Row>
        </React.Fragment>
      ) : null)}

      {!isLoading && sections.every((section) => !section.items.length) ? (
        <div className='ls-empty'>{query ? 'No scheme matches "' + search + '"' : 'No schemes here'}</div>
      ) : null}
      {isLoading ? <div className='text-center my-4'><Spinner animation='border' /></div> : null}
    </Layout>
  )
}
