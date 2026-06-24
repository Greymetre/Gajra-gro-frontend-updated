import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Form, Button, Row, Col } from 'react-bootstrap';
import { backendGetCountryFromIP, backendGetCountryStates, backendGetStateCities } from '../../helpers/backend_helper'
export default function AddressForm({ handleInputChange, requestData, errors }: { handleInputChange: any; requestData: any, errors:any }) {
    const [statesList, setStatesList] = useState([])
    const [cityList, setCityList] = useState([])
    const fetchStatesData = async () => {
        await backendGetCountryStates({}).then((res) => {
            if (!res.isError) {
                setStatesList(res.data)
              }
            
        })
    }
    const fetchCitiesData = async () => {
        await backendGetStateCities({ state: requestData?.address?.state }).then((res) => {
            setCityList(res.data)
        })
    }
    useEffect(() => {
        fetchStatesData()
    }, [requestData?.address?.country])

    useEffect(() => {
        fetchCitiesData()
    }, [requestData?.address?.state])
    return (
        <>
            <Col md={4} sm={6} xs={12}>
                <Form.Group className="form-group">
                    <Form.Label>State</Form.Label>
                    <Form.Select name='address.state' value={requestData?.address?.state} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                        <option>Select State</option>
                        {statesList.map((item: any, index) => (
                             <option key={"state" + index} value={item.value}>{item.label}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {errors?.state && (
                    <div className="text-danger">{errors?.state}</div>
                )}
            </Col>
            <Col md={4} sm={6} xs={12}>
                <Form.Group className="form-group">
                    <Form.Label>City</Form.Label>
                    <Form.Select name='address.city' value={requestData?.address?.city} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                        <option>Select City</option>
                        {cityList.map((item: any, index) => (
                            <option key={'city' + index} value={item.cityName}>{item.cityName}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {errors?.city && (
                    <div className="text-danger">{errors?.city}</div>
                )}
            </Col>
            <Col md={4} sm={6} xs={12}>
                <Form.Group className="form-group">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type="number" name="address.postalCode" onChange={handleInputChange} value={requestData?.address?.postalCode} required={true} autoComplete='off' />
                </Form.Group>
                {errors?.postalCode && (
                    <div className="text-danger">{errors?.postalCode}</div>
                )}
            </Col>
            <Col md={6} sm={6} xs={12}>
                <Form.Group className="form-group">
                    <Form.Label htmlFor="Customertype">Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address.address"
                        onChange={handleInputChange}
                        value={requestData?.address?.address}
                        required={true}
                        autoComplete='off'
                        as="textarea" rows={2}
                        placeholder='Sy No.111 &123, 2, ITPL Main Rd, Brookefield, Bengaluru, Karnataka 560037'
                    />
                </Form.Group>
                {errors?.address && (
                    <div className="text-danger">{errors?.address}</div>
                )}
            </Col>
        </>
    )
}
