import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetProductsDropdownList } from '../../helpers/backend_helper'
import Select from 'react-select';
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';

const SelectProductList = ({ handleInputChange, fieldname, fieldvalue }: { handleInputChange: any; fieldname: string; fieldvalue: string }) => {
    const [productData, setProductData] = useState<Array<SelectDropDownInterface>>([])
    const [isLoading, setIsLoading] = useState(false)
    const fetchCustomerData = async () => {
        setIsLoading(true)
        await backendGetProductsDropdownList({}).then((res) => {
            if (!res.isError) {
                setProductData(res.data)
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
         const item = productData.find((type) => type.value == fieldvalue)
         setSelectedItem(item)
        }
    }, [fieldvalue])

    return (
        <Form.Group className="mb-1">
            <Form.Label>Product</Form.Label>
            {isLoading === false ? (<Select id='productid' options={productData} name={fieldname} value={selectedItem} onChange={(e: any) => handleInputChange({
                target: {
                    name: fieldname,
                    value: e.value,
                    type: 'select',
                }
            })} required={true} isSearchable />) : null}
        </Form.Group>
    )
}

export default SelectProductList