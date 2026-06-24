import React, { useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetCategoriesDropdownList } from '../../helpers/backend_helper'
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';
const CategoryCheckbox = ({ handleInputChange, categories, errors }: { handleInputChange: any; categories: any, errors : any }) => {
    const [customerTypeList, setCustomerTypeList] = useState<Array<SelectDropDownInterface>>([])
    const fetchCustomerTypeList = async () => {
        await backendGetCategoriesDropdownList().then((res: any) => {
            if (!res.isError) {
                setCustomerTypeList(res.data)
            }
        })
    }
    useEffect(() => {
        fetchCustomerTypeList()
    }, [])
    return (
        <Row className="pt-4">
            <Form.Group className="form-group">
                <Form.Label htmlFor="Coupon">Category</Form.Label>
                {Array.isArray(customerTypeList) && customerTypeList.map((item, index) => {
                    return (<Col sm={12} key={index}>
                        <Form.Check
                            inline
                            className="form-check"
                            name="categories"
                            type="checkbox"
                            value={item?.value}
                            label={item?.label}
                            onChange={(e: any) => handleInputChange(e)}
                            defaultChecked={Array.isArray(categories) ? categories.find((type) => type == item.value) : false}
                        />
                    </Col>)
                })
                }
            </Form.Group>
            {errors && (
                <div className="text-danger">{errors}</div>
            )}
        </Row>
    )
}

export default CategoryCheckbox