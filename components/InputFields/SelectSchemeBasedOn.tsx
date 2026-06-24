import React, { useState, useEffect } from 'react'
import { Col, Form } from 'react-bootstrap';
import { backendGetSchemeBasedOn } from '../../helpers/backend_helper'
import Select from 'react-select';

const SelectSchemeBasedOn = ({ handleInputChange, basedOn }: { handleInputChange: any; basedOn: string }) => {
    const [basedOnData, setBasedOnData] = useState([])
    const fetchLoyaltySchemeTypeData = async () => {
        await backendGetSchemeBasedOn().then((res) => {
            if (!res.isError) {
                setBasedOnData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchLoyaltySchemeTypeData()
    }, [])

    return (
        <Form.Group className="mb-1">
            <Form.Label>Scheme BasedOn</Form.Label>
            <Select options={basedOnData} name='basedOn' value={{ value: basedOn, label: basedOn }} onChange={(e: any) => handleInputChange({
                target: {
                    name: 'basedOn',
                    value: e.value,
                    type: 'select',
                }
            })} isSearchable />
        </Form.Group>
    )
}

export default SelectSchemeBasedOn