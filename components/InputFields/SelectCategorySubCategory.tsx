import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetCategoriesDropdownList, backendGetSubCategoriesDropdownList } from '../../helpers/backend_helper'
export default function SelectCategorySubCategory({ handleInputChange, categoryid, subcategoryid }: { handleInputChange: any; categoryid: string; subcategoryid: string }) {
    const [categoryidData, setCategoryData] = useState([])
    const [subcategoryData, setSubcategoryData] = useState([])
    const fetchCategoryData = async () => {
        await backendGetCategoriesDropdownList().then((res) => {
            if (!res.isError) {
                setCategoryData(res.data)
            }
        })
    }
    const fetchSubcategoryData = async () => {
        await backendGetSubCategoriesDropdownList().then((res) => {
            if (!res.isError) {
                setSubcategoryData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchCategoryData()
    }, [])

    useEffect(() => {
        fetchSubcategoryData()
    }, [categoryid])
    return (
        <>
            <Col md={4} sm={6} xs={12}>
                <Form.Group className="mb-1">
                    <Form.Label htmlFor="Category">Category</Form.Label>
                    <Form.Select aria-label="Select Category" name='categoryid' value={categoryid} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                        <option>Select Category</option>
                        {categoryidData.map((item: any, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={4} sm={6} xs={12}>
                <Form.Group className="mb-1">
                    <Form.Label htmlFor="Subcategory">Subcategory</Form.Label>
                    <Form.Select aria-label="Select Subcategory" name='subcategoryid' value={subcategoryid} onChange={(e: any) => handleInputChange(e)} required={true} autoComplete='off' >
                        <option>Select Subcategory</option>
                        {subcategoryData.map((item: any, index) => (
                            <option key={index} value={item._id}>{item.subcategoryName}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
        </>
    )
}
