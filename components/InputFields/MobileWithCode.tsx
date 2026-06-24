import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { backendGetAllCountryCodes } from '../../helpers/backend_helper'
export default function MobileWithCode({ handleInputChange, mobile }: { handleInputChange: any; mobile: any}) {
    const [countryData, setCountryData] = useState([])
    const fetchCountryData = async () => {
        await backendGetAllCountryCodes().then((res) => {
            if (!res.isError) {
                setCountryData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchCountryData()
    }, [])

    return (
        <>
            <Form.Group className="mb-1">
                <Form.Label htmlFor="Code">Mobile</Form.Label>
                <InputGroup >
                    {/* <div style={{width: '80px'}}>
                    <Form.Select className="pr-0 pl-0 mr-0 ml-0" name='phoneCode' value={phoneCode} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                        {countryData.map((item: any, index) => (
                            <option key={index} value={item.value}>{item.value}</option>
                        ))}
                    </Form.Select>
                    </div> */}
                    <Form.Control
                        type="number"
                        name="mobile"
                        onChange={handleInputChange}
                        value={mobile}
                        required={true}
                        autoComplete='off'
                    />
                </InputGroup>
            </Form.Group>
        </>
    )
}
