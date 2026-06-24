import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { getCustomerTypeList } from '../../helpers/backend_helper'
import Select from 'react-select';
const SelectCustomerType = ({ handleInputChange, customerType }: { handleInputChange: any; customerType: any }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [customerTypeList, setCustomerTypeList] = useState([])
    const fetchCustomerTypeList = async () => {
        await getCustomerTypeList().then((res: any) => {
            if (!res.isError) {
                setCustomerTypeList(res.data)
            }
        })
    }
    useEffect(() => {
        fetchCustomerTypeList()
    }, [])
    return (
        <Form.Group className="mb-1">
            <Form.Label>Customer Type</Form.Label>
            {isLoading === false ? (<Select options={customerTypeList} name="customerType" 
            value={{ value: customerType, label: customerType }} 
            onChange={(e: any) => handleInputChange({
                target: {
                    name: "customerType",
                    value: e.value,
                    type: 'select',
                }
            })} required={true} isSearchable />) : null}
        </Form.Group>
    )
}

export default SelectCustomerType