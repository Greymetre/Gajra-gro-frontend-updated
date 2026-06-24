import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetCallTypes } from '../../helpers/backend_helper'
import Select from 'react-select';
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';

const SelectCallTypes = ({ handleInputChange, callType }: { handleInputChange: any; callType: string }) => {
    const [options, setOptions] = useState<Array<SelectDropDownInterface>>([])
    const fetchOptionsData = async () => {
        await backendGetCallTypes().then((res) => {
            if (!res.isError) {
                setOptions(res.data)
            }
        })
    }
    useEffect(() => {
        fetchOptionsData()
    }, [])
    const [selectedItem, setSelectedItem] = useState<SelectDropDownInterface>()
    useEffect(() => {
        if(callType){
         const item = options.find((option) => option.value == callType)
         setSelectedItem(item)
        }
    }, [callType])

    return (
        <Form.Group className="mb-1">
            <Form.Label htmlFor="Call Type">Call Type</Form.Label>
            <Select options={options} name='callType' value={selectedItem} onChange={(e: any) => 
            handleInputChange({
                target: {
                    name: 'callType',
                    value: e.value,
                    type: 'select',
                }
            })
            } isSearchable />
        </Form.Group>
    )
}

export default SelectCallTypes