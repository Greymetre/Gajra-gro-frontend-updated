import React, { useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { getCustomerTypeList } from '../../helpers/backend_helper'
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';
const CustomerTypeCheckbox = ({ handleInputChange, customerType }: { handleInputChange: any; customerType: any }) => {
    const [customerTypeList, setCustomerTypeList] = useState<Array<SelectDropDownInterface>>([])
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
        <Row className="pt-4">
            <Form.Group className="form-group">
                <Form.Label htmlFor="Coupon">Customer Type</Form.Label>
                {Array.isArray(customerTypeList) && customerTypeList.map((item, index) => {
                    return (<Col sm={12} key={index}>
                        <Form.Check
                            inline
                            className="form-check"
                            name="customerType"
                            type="checkbox"
                            value={item.value}
                            label={item.label}
                            onChange={(e: any) => handleInputChange(e)}
                            defaultChecked={Array.isArray(customerType) ? customerType.some((type) => type == item.value) : false}
                        />
                    </Col>)
                })
                }
            </Form.Group>
        </Row>
    )
}

export default CustomerTypeCheckbox