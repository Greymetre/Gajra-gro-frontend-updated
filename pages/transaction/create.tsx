import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, Image, FormLabel, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendQRCodeScaned } from '../../helpers/backend_helper'
import Link from 'next/link'
import { BLACK_PLUS_CIRCLE_IMAGE, BLUE_PLUS_CIRCLE_IMAGE, CUSTOMER_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RECTANGLE_DEMO_IMAGE, WHITE_CHECKED_IMAGE } from '../../utils/constant';
import plusicon from '../../assets/images/auth/icon.png'
import SelectCustomerList from '../../components/InputFields/SelectCustomerList';
import SelectLoyaltySchemeList from '../../components/InputFields/SelectLoyaltySchemeList';
import { Formik, FormikHelpers, useFormik, useFormikContext } from 'formik';
import * as yup from "yup";

const couponSchema = yup.object().shape({
    coupons: yup.array().of(
        yup.object().shape({
            coupon: yup.string().min(6).required(`Required QR Code`),
        })
    ),
    customerid: yup.string().min(3).required("Select Customer"),
});

export default function TransactionSave() {
    const router = useRouter()
    const { id } = router.query
    const initialCouponScan = {
        customerid: "",
        coupons: [{ coupon: '' }],
    }
    const [errorData, setErrorData] = useState([])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
        formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    }
    const handleFormSubmit = async () => {
        try {
            setErrorData([])
            var iData = await JSON.parse(JSON.stringify(formik.values));
            await backendQRCodeScaned(iData).then(async (result) => {
                const errorObject = await result.data && result.data.length > 0 && result.data.filter((obj: any) => obj.isError);
                setErrorData(result.data)
                if (errorObject.length === 0) {
                    setTimeout(() => {
                    router.push('/transaction');
                        
                    }, 5000);
                }
            }).catch((err) => {
            });
        }
        catch (e) {
            console.log(e, "Error in the Login");
        }
    };
    const formik = useFormik({
        initialValues: initialCouponScan,
        validationSchema: couponSchema,
        onSubmit: handleFormSubmit,
        enableReinitialize: true
    });
 
    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/transaction', label: 'TransactionList' }} itemlabel='Transaction List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6} className="mb-3">
                            <h3 className="card-body mb-0">{(id) ? 'Edit' : 'Add'}  Transaction</h3>
                        </Col>

                        <Card className="flat-card">
                            <Row>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-center card-body'>
                                        <Col xl={6} md={6} >

                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-end card-body'>
                                        <Col xl={12} md={12} className="text-end">
                                            <Button className="btn btn-dark" disabled={!formik.isValid}
                                                onClick={() => {
                                                    if (formik.isValid) {
                                                        formik.handleSubmit();
                                                    }
                                                    else {
                                                        console.log("is invalid", !formik.isValid)
                                                    }
                                                }}>  <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />Save  </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Row className='p-4'>
                                    <SelectCustomerList handleInputChange={handleInputChange} customerid={formik.values.customerid} />
                                    <Col md={7} sm={7} xs={11}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="Coupon">Coupon</Form.Label>
                                            {
                                                formik.values.coupons.map((qrcode, index: number) => (
                                                    <div className="mb-3" key={index}>
                                                    <InputGroup>
                                                        <Form.Control className="mb-1"
                                                            name={`coupons[${index}].coupon`}
                                                            value={qrcode.coupon}
                                                            onChange={handleInputChange}
                                                            required={true}
                                                            autoComplete='off'
                                                        />
                                                        <InputGroup.Text className="bg-danger text-white" onClick={() => {
                                                            const couponrows = Array.isArray(formik.values.coupons) && formik.values.coupons.filter(function (copun: any, couponind: number) { return couponind !== index })
                                                            formik.setFieldValue("coupons", couponrows);
                                                        }}>
                                                            x
                                                        </InputGroup.Text>
                                                    </InputGroup>
                                                    {errorData.filter((coupon: any) => coupon.coupon === qrcode.coupon).map((coupon : any, index) => (
                                                        <>
                                                        <div className="text-danger">{coupon.isError && coupon.errorMessage}</div>
                                                        {(coupon.points) ? <div className="text-success">{coupon.points + " points received successfully"}</div> : null}
                                                        </>
                                                    ))}
                                                    </div>
                                                ))
                                            }
                                        </Form.Group>
                                    </Col>
                                    <Col md={1} sm={1} xs={1}>
                                        <div onClick={() => {
                                            const newCoupons = [...formik.values.coupons,
                                            { coupon: '' }
                                            ];
                                            formik.setFieldValue("coupons", newCoupons);
                                        }}
                                        ><Image src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE} /> </div>
                                    </Col>
                                </Row>
                            </Row>
                        </Card>
                    </Row >
                </Col >
            </Row >
        </Layout >
    )
}

