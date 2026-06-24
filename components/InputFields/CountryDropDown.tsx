import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetAllCountryCodes } from '../../helpers/backend_helper'
export default function CountryDropDown({ handleInputChange, countryid }: { handleInputChange: any; countryid: any }) {
    const [countryData, setCountryData] = useState([])
    const fetchCountryData = async () => {
        await backendGetAllCountryCodes().then((res) => {
            if(!res.isError)
            {
                setCountryData(res.data)
            }
        })
      }
      useEffect(() => {
        fetchCountryData()
      }, [])
    return (
        <>
            <Row>
                <Col>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="Code">Code</Form.Label>
                        <Form.Select aria-label="Select Country"  name='countryid' value={countryid} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                            <option>Select Country</option>
                            { countryData.map((item :any, index) => (
                                <option key={index} value={item._id}>{item.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}
