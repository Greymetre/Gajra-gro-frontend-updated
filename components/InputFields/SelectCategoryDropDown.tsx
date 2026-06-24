import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetCategoriesDropdownList } from '../../helpers/backend_helper'
import Select from 'react-select';
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';
const SelectCategoryDropDown = ({ handleInputChange, fieldname, fieldvalue }: { handleInputChange: any; fieldname: string; fieldvalue: string }) => {
    const [categoryData, setCategoryData] = useState<Array<SelectDropDownInterface>>([])
    const [isLoading, setIsLoading] = useState(false)
    const fetchCustomerData = async () => {
        setIsLoading(true)
        await backendGetCategoriesDropdownList().then((res) => {
            if (!res.isError) {
                setCategoryData(res.data)
                setIsLoading(false)
            }
        })
    }
    useEffect(() => {
        fetchCustomerData()
    }, [])

    const [selectedItem, setSelectedItem] = useState<SelectDropDownInterface>()
    useEffect(() => {
        if(fieldvalue){
         const item = categoryData.find((type) => type.value == fieldvalue)
         setSelectedItem(item)
        }
    }, [fieldvalue])

    return (
        <Form.Group className="mb-1">
            <Form.Label>Category</Form.Label>
            {isLoading === false ? (<Select options={categoryData} name={fieldname} value={selectedItem} onChange={(e: any) => handleInputChange({
                target: {
                    name: fieldname,
                    value: e.value,
                    type: 'select',
                }
            })} required={true} isSearchable />) : null}
        </Form.Group>
    )
}

export default SelectCategoryDropDown