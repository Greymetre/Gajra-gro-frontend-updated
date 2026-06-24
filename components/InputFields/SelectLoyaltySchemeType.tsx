import React, { useState, useEffect } from 'react'
import { Col, Form } from 'react-bootstrap';
import { backendGetSchemeTypes } from '../../helpers/backend_helper'
import Select from 'react-select';

const SelectLoyaltySchemeType = ({ handleInputChange, schemeType }: { handleInputChange: any; schemeType: string }) => {
    const [schemeTypeData, setSchemeTypeData] = useState([])
    const fetchLoyaltySchemeTypeData = async () => {
        await backendGetSchemeTypes().then((res) => {
            if (!res.isError) {
                setSchemeTypeData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchLoyaltySchemeTypeData()
    }, [])

    return (
        <Form.Group className="mb-1">
            <Form.Label>Scheme Type</Form.Label>
            <Select options={schemeTypeData} name='schemeType' value={{ value: schemeType, label: schemeType }} onChange={(e: any) => handleInputChange({
                target: {
                    name: 'schemeType',
                    value: e.value,
                    type: 'select',
                }
            })} isSearchable />
        </Form.Group>
    )
}

export default SelectLoyaltySchemeType