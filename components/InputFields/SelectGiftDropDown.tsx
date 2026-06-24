import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGiftDropDownList } from '../../helpers/backend_helper'

const SelectGiftDropDown = ({ handleInputChange, giftid }: { handleInputChange: any; giftid: string}) => {
    const [giftData, setGiftData] = useState([])
    const fetchGiftData = async () => {
        await backendGiftDropDownList().then((res) => {
            if(!res.isError)
            {
                setGiftData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchGiftData()
    }, [])

  return (
    <Col md={4} sm={6} xs={12}>
        <Form.Group className="mb-1">
            <Form.Label htmlFor="Gift">Gift</Form.Label>
            <Form.Select aria-label="Select Gift" name='giftid' value={giftid} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                <option>Select Gift</option>
                { giftData.map((item :any, index) => (
                    <option key={index} value={item._id}>{item.giftName }</option>
                ))}
            </Form.Select>
        </Form.Group>
    </Col>
  )
}

export default SelectGiftDropDown