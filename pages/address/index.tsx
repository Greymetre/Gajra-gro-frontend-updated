import React, { useState } from 'react'
import Router from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Container,Image, Button, Form, Row, Col, Card, Nav, Table } from 'react-bootstrap';
import ConstantsImagePath from '../../assets/svgimages'
import Layout from '../../components/Layout'
import authlogin from '../../assets/images/auth/login.png'

import CountryList from '../../components/AddressMaster/CountryList';
import StateList from '../../components/AddressMaster/StateList';
import CityList from '../../components/AddressMaster/CityList';
import AddCity from '../../components/AddressMaster/AddCity';

import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import AddCountry from '../../components/AddressMaster/AddCountry';
import AddState from '../../components/AddressMaster/AddState';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent';
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

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Dashboard' }} secondItem={{ href: '', label: '' }} itemlabel='Address Master' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-3">
                        <Col md={3}>
                            <h3 className="card-body">{componentVisible.replace(/([A-Z])/g, ' $1').trim()}</h3> 
                        </Col>
                        <Col md={6}>
                            <Nav className='nav-pills card-body'>
                                <Nav.Item className='m-r-10' onClick={() => { setComponentVisible('CityList') }}>
                                    <Nav.Link className={"btn btn-dark " + (componentVisible === "CityList" || componentVisible === "AddCity" ? 'active' : '')} onClick={() => { setComponentVisible('CityList') }}>City List</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className='m-r-10' onClick={() => { setComponentVisible('CountyList') }}>
                                    <Nav.Link className={"btn btn-dark " + (componentVisible === "CountyList" || componentVisible === "AddCountry" ? 'active' : '')} onClick={() => { setComponentVisible('CountyList') }}>Country List</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className='m-r-10' onClick={() => { setComponentVisible('StateList') }}>
                                    <Nav.Link className={"btn btn-dark " + (componentVisible === "StateList" || componentVisible === "AddState" ? 'active' : '')} onClick={() => { setComponentVisible('StateList') }}>State List</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col md={3} className="text-end  mb-3">
                            {componentVisible === "CountyList" ? (<Button className="btn btn-dark" onClick={() => { handleEditCountry({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add County</Button>) : null}
                            {componentVisible === "StateList" ? (<Button className="btn btn-dark" onClick={() => { handleEditState({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add State</Button>) : null}
                            {componentVisible === "CityList" ? (<Button className="btn btn-dark" onClick={() => { handleEditCity({}) }}><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Add City</Button>) : null}
                        </Col>
                        <Card className="flat-card p-0">
                            <div className="row-table">
                                <Col sm={12} md={12}>
                                    <div className="card1">
                                        {componentVisible === "CountyList" ? (<CountryList key="CountyList2" handleVisible={handleComponentVisible} handleEditCountry={handleEditCountry} />) : null}
                                        {(componentVisible === "StateList") ? (<StateList key="StateList2" handleVisible={handleComponentVisible} handleEditState={handleEditState} />) : null}
                                        {(componentVisible === "CityList") ? (<CityList key="CityList2" handleVisible={handleComponentVisible} handleEditCity={handleEditCity} />) : null}
                                        {(componentVisible === "AddCountry" || componentVisible === "EditCountry") ? (<AddCountry handleVisible={handleComponentVisible} initialCountyData={initialCountyData} />) : null}
                                        {(componentVisible === "AddState" || componentVisible === "EditState") ? (<AddState handleVisible={handleComponentVisible} initialStateData={initialStateData} />) : null}
                                        {(componentVisible === "AddCity" || componentVisible === "EditCity") ? (<AddCity handleVisible={handleComponentVisible} initialCityData={initialCityData} />) : null}
                                    </div>
                                </Col>
                            </div>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}