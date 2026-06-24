import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { getUserRoleList } from '../../helpers/backend_helper'
import Select from 'react-select';
const SelectUserType = ({ handleInputChange, fieldname, fieldvalue }: { handleInputChange: any; fieldname: string ; fieldvalue: string }) => {
    const [roleData, setRoleData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const fetchRoleData = async () => {
        setIsLoading(true)
        await getUserRoleList().then(async(res) => {
            if (!res.isError) {
                setRoleData(res.data)
                setIsLoading(false)
            }
        })
    }
    useEffect(() => {
        fetchRoleData()
    }, [])
    return (
        
            <Form.Group className="mb-1">
                <Form.Label>Role</Form.Label>
               {isLoading === false ? (<Select options={roleData} name={fieldname} value={{ value: fieldvalue, label: fieldvalue }} onChange={(e: any) => handleInputChange({
                    target: {
                        name: fieldname,
                        value: e.value,
                        type: 'select',
                    }
                })} required={true} isSearchable />) : null} 
            </Form.Group>
    )
}

export default SelectUserType