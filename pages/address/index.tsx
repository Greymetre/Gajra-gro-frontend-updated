import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Container,Image, Button, Form, Row, Col, Card, Nav, Table, Spinner } from 'react-bootstrap';
import ConstantsImagePath from '../../assets/svgimages'
import Layout from '../../components/Layout'
import authlogin from '../../assets/images/auth/login.png'

import CountryList from '../../components/AddressMaster/CountryList';
import StateList from '../../components/AddressMaster/StateList';
import CityList from '../../components/AddressMaster/CityList';
import DistrictList from '../../components/AddressMaster/DistrictList';
import AddCity from '../../components/AddressMaster/AddCity';

import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import AddCountry from '../../components/AddressMaster/AddCountry';
import AddState from '../../components/AddressMaster/AddState';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent';
import { backendGetLocationCounts, backendSyncLocationsFromSfa } from '../../helpers/backend_helper';
export default function Login() {
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState('')
    const [componentVisible, setComponentVisible] = useState('CityList')
    const [initialCountyData, setInitialCountyData] = useState({})
    const [initialStateData, setInitialStateData] = useState({})
    const [initialCityData, setInitialCityData] = useState({})
    const handleComponentVisible = (value: string) => {
        setComponentVisible(value)
    }
    const handleEditCountry = (country: object) => {
        var countryAction = (Object.keys(country).length == 0) ? "AddCountry" : "EditCountry";
        var countyData = (Object.keys(country).length == 0) ? {
            countryName: "",
            iso: "",
            phoneCode: "",
            currency: "",
            timezones: "",
            flag: ""
        } : country;
        setInitialCountyData(countyData)
        setComponentVisible(countryAction)
    }

    const handleEditState = (states: object) => {
        var stateAction = (Object.keys(states).length == 0) ? "AddState" : "EditState";
        var stateData = (Object.keys(states).length == 0) ? {
            stateName: "",
            iso: "",
            countryid: ""
        } : states;
        setInitialStateData(stateData)
        setComponentVisible(stateAction)
    }

    const handleEditCity = (city: object) => {
        var cityAction = (Object.keys(city).length == 0) ? "AddCity" : "EditCity";
        var cityData = (Object.keys(city).length == 0) ? {
            cityName: "",
            pincode: [],
                  state: "",
            country: ""
        } : city;

        console.log(cityData , "cityData")
        if (cityData && Object.keys(cityData).length > 0) {
            setInitialCityData(cityData);
        }
        setComponentVisible(cityAction)
    }

    // Manual pull from GG SFA (the backend also syncs every 5 minutes)
    const [syncing, setSyncing] = useState(false)
    const [syncMessage, setSyncMessage] = useState<{ ok: boolean; text: string } | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [counts, setCounts] = useState<any>(null)
    const fetchCounts = () => {
        backendGetLocationCounts().then((res) => {
            if (res?.data) setCounts(res.data)
        }).catch(() => { })
    }
    // Re-count after a sync and whenever a list/form is switched (add, edit, delete)
    useEffect(() => { fetchCounts() }, [refreshKey, componentVisible])
    const handleSyncFromSfa = async () => {
        if (!window.confirm('Pull all countries, states, districts and cities from GG SFA now?')) return
        setSyncing(true)
        setSyncMessage(null)
        try {
            const res = await backendSyncLocationsFromSfa({ full: true })
            const d = res?.data || {}
            if (d.skipped) {
                setSyncMessage({ ok: true, text: 'A sync is already running. Please check again in a minute.' })
            } else if (d.error) {
                setSyncMessage({ ok: false, text: `Sync failed: ${typeof d.error === 'string' ? d.error : JSON.stringify(d.error)}` })
            } else {
                const part = (label: string, v: any) => v ? `${label} ${v.received}${v.failed ? ` (${v.failed} failed)` : ''}` : null
                setSyncMessage({
                    ok: true,
                    text: 'Synced from GG SFA: ' + [part('Countries', d.countries), part('States', d.states), part('Districts', d.districts), part('Cities', d.cities)].filter(Boolean).join(' · '),
                })
            }
            setRefreshKey((k) => k + 1)
        } catch (e: any) {
            setSyncMessage({ ok: false, text: e?.response?.data?.message?.toString?.() || 'Sync failed. Please try again.' })
        } finally {
            setSyncing(false)
        }
    }

    const tabs = [
        { key: 'CityList', label: 'Cities', count: counts?.cities, match: ['CityList', 'AddCity', 'EditCity'] },
        { key: 'DistrictList', label: 'Districts', count: counts?.districts, match: ['DistrictList'] },
        { key: 'StateList', label: 'States', count: counts?.states, match: ['StateList', 'AddState', 'EditState'] },
        { key: 'CountyList', label: 'Countries', count: counts?.countries, match: ['CountyList', 'AddCountry', 'EditCountry'] },
    ]
    const statCards = [
        { key: 'CountyList', label: 'Countries', icon: '🌍', tone: 'cd-stat-blue', value: counts?.countries },
        { key: 'StateList', label: 'States', icon: '🗺️', tone: 'cd-stat-green', value: counts?.states },
        { key: 'DistrictList', label: 'Districts', icon: '📍', tone: 'cd-stat-amber', value: counts?.districts },
        { key: 'CityList', label: 'Cities', icon: '🏙️', tone: 'cd-stat-red', value: counts?.cities },
    ]
    const titles: Record<string, string> = {
        CityList: 'Cities', DistrictList: 'Districts', StateList: 'States', CountyList: 'Countries',
        AddCity: 'Add City', EditCity: 'Edit City', AddState: 'Add State', EditState: 'Edit State',
        AddCountry: 'Add Country', EditCountry: 'Edit Country',
    }

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Dashboard' }} secondItem={{ href: '', label: '' }} itemlabel='Address Master' />
            <div className="am-page">
                <div className="am-header">
                    <div>
                        <h3 className="mb-1">Address Master</h3>
                        <p className="am-subtitle mb-0">Countries, states, districts and cities. Locations from GG SFA sync automatically.</p>
                    </div>
                    <div className="am-header-actions">
                        <Button variant="outline-secondary" className="cd-btn cd-btn-outline" disabled={syncing} onClick={handleSyncFromSfa}>
                            {syncing ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Syncing...</> : '⟳ Sync from GG SFA'}
                        </Button>
                        {componentVisible === "CountyList" ? (<Button className="btn btn-dark cd-btn" onClick={() => { handleEditCountry({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add Country</Button>) : null}
                        {componentVisible === "StateList" ? (<Button className="btn btn-dark cd-btn" onClick={() => { handleEditState({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add State</Button>) : null}
                        {componentVisible === "CityList" ? (<Button className="btn btn-dark cd-btn" onClick={() => { handleEditCity({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add City</Button>) : null}
                    </div>
                </div>

                {syncMessage ? (
                    <div className={`am-alert ${syncMessage.ok ? 'am-alert-ok' : 'am-alert-err'}`}>
                        <span>{syncMessage.text}</span>
                        <button type="button" className="am-alert-close" onClick={() => setSyncMessage(null)}>×</button>
                    </div>
                ) : null}

                <Row className="g-3 mb-4">
                    {statCards.map((c) => (
                        <Col xl={3} sm={6} xs={12} key={c.key}>
                            <button type="button" className={`cd-stat am-stat ${c.tone}`} onClick={() => setComponentVisible(c.key)}>
                                <div className="cd-stat-icon am-stat-emoji">{c.icon}</div>
                                <div className="text-start">
                                    <div className="cd-stat-label">Total {c.label}</div>
                                    <div className="cd-stat-value">{c.value ? c.value.total.toLocaleString('en-IN') : counts ? 0 : '…'}</div>
                                    {c.value ? (
                                        <div className="am-stat-sub">
                                            {c.value.active.toLocaleString('en-IN')} active
                                            {c.value.total - c.value.active > 0 ? ` · ${(c.value.total - c.value.active).toLocaleString('en-IN')} inactive` : ''}
                                        </div>
                                    ) : null}
                                </div>
                            </button>
                        </Col>
                    ))}
                </Row>

                <div className="am-card">
                    <div className="am-tabs">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                className={`am-tab ${t.match.includes(componentVisible) ? 'active' : ''}`}
                                onClick={() => { setComponentVisible(t.key) }}
                            >
                                {t.label}
                                {t.count ? <span className="am-tab-count">{t.count.total.toLocaleString('en-IN')}</span> : null}
                            </button>
                        ))}
                    </div>
                    {!componentVisible.endsWith('List') ? (
                        <h5 className="am-form-title">{titles[componentVisible] || ''}</h5>
                    ) : null}
                    <div className="am-body" key={refreshKey}>
                        {componentVisible === "CountyList" ? (<CountryList key="CountyList2" handleVisible={handleComponentVisible} handleEditCountry={handleEditCountry} />) : null}
                        {(componentVisible === "StateList") ? (<StateList key="StateList2" handleVisible={handleComponentVisible} handleEditState={handleEditState} />) : null}
                        {(componentVisible === "DistrictList") ? (<DistrictList key="DistrictList2" />) : null}
                        {(componentVisible === "CityList") ? (<CityList key="CityList2" handleVisible={handleComponentVisible} handleEditCity={handleEditCity} />) : null}
                        {(componentVisible === "AddCountry" || componentVisible === "EditCountry") ? (<AddCountry handleVisible={handleComponentVisible} initialCountyData={initialCountyData} />) : null}
                        {(componentVisible === "AddState" || componentVisible === "EditState") ? (<AddState handleVisible={handleComponentVisible} initialStateData={initialStateData} />) : null}
                        {(componentVisible === "AddCity" || componentVisible === "EditCity") ? (<AddCity handleVisible={handleComponentVisible} initialCityData={initialCityData} />) : null}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
