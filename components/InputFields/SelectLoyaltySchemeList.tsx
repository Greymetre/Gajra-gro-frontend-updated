import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendLoyaltySchemeDropDownList } from '../../helpers/backend_helper'

const SelectLoyaltySchemeList = ({ handleInputChange, schemeid }: { handleInputChange: any; schemeid: string}) => {
    const [loyaltySchemeData, setLoyaltySchemeData] = useState([])
    const fetchLoyaltySchemeData = async () => {
        await backendLoyaltySchemeDropDownList().then((res) => {
            if(!res.isError)
            {
                setLoyaltySchemeData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchLoyaltySchemeData()
    }, [])
  return (
    <Col md={4} sm={6} xs={12}>
        <Form.Group className="mb-1">
            <Form.Label htmlFor="LoyaltyScheme">LoyaltyScheme</Form.Label>
            <Form.Select aria-label="Select LoyaltyScheme"  name='schemeid' value={schemeid} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                <option>Select LoyaltyScheme</option>
                { loyaltySchemeData.map((item :any, index) => (
                    <option key={index} value={item._id}>{item.schemeName }</option>
                ))}
            </Form.Select>
        </Form.Group>
    </Col>
  )
}

export default SelectLoyaltySchemeList