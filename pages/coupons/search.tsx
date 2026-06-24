import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Spinner, Form, Accordion } from 'react-bootstrap'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendSearchCoupons } from '../../helpers/backend_helper'
import { EDIT_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE } from '../../utils/constant';
import { CouponSearchFilterInterface, CouponSearchInterface, initialFilterCouponSearch } from '../../interfaces/coupon.interface';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import SelectProductList from '../../components/InputFields/SelectProductList';
function CustomToggle(props: any) {
    const { eventKey } = props
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <Button className="pr-2" variant="dark" onClick={decoratedOnClick}><Image src={IMAGE_URL + WHITE_FILTER_IMAGE} /> Filters</Button>
    );
}
export default function Coupons() {
    const router = useRouter()
    const [couponData, setCouponData] = useState<Array<CouponSearchInterface>>([])
    const [filterData, setFilterData] = useState<CouponSearchFilterInterface>(initialFilterCouponSearch)
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const fetchSearchCoupons = async () => {
        await backendSearchCoupons({ ...filterData,  search: search }).then((res) => {
            if (!res.isError) {
                setCouponData(res.data)
                setIsLoading(false)
            }
        })
    }
    useEffect(() => {
        if (search.length >= 3) {
            setIsLoading(true)
            fetchSearchCoupons()
        }
    }, [search, filterData])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            name,
            value,
            type
        } = event.target
        setFilterData({ ...filterData, productid : value })
    }
    console.log(filterData);
    
    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='QRcode List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={4}>
                            <h3 className="card-body">Search QRcode List({Array.isArray(couponData) ? couponData.length : '0'})</h3>
                        </Col>
                        <Col xl={3} sm={3} xs={3} className="text-end">
                            <Form.Group className="form-group">
                                <Form.Label></Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => { setSearch(e.target.value) }}
                                    value={search}
                                    autoComplete='off'
                                    placeholder='Search'
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={5} sm={5} xs={12} className="text-end">

                            <Accordion defaultActiveKey="0" className="mb-3">
                                <CustomToggle eventKey="1" ></CustomToggle>
                                <Accordion.Collapse eventKey="1">
                                    <Row>
                                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                            <Col sm={6}>
                                                <Form.Label> From</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="startDate"
                                                    onChange={(e) => { setFilterData({ ...filterData, startDate: e.target.value }) }}
                                                    value={filterData.startDate}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='Start Date'
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Label> To</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="endDate"
                                                    onChange={(e) => { setFilterData({ ...filterData, endDate: e.target.value }) }}
                                                    value={filterData.endDate}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='End Date'
                                                />
                                            </Col>
                                            <Col sm={12} className="text-start">
                                            <SelectProductList handleInputChange={handleInputChange} fieldname="productid" fieldvalue={filterData.productid} />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Accordion.Collapse>
                            </Accordion>
                        </Col>
                        <Card className="flat-card p-0">
                            <div className="row-table">
                                <Col sm={12} md={12}>
                                    <div className="card1">
                                        <div className="table-border-style">
                                            <div className="table-responsive">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Coupons</th>
                                                            <th>Date</th>
                                                            <th>GG NO</th>
                                                            <th>Product Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(couponData) && couponData.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.coupon}</td>
                                                                    <td>{new Date(item.createdAt).toDateString()}</td>
                                                                    <td>{item?.productsData?.productNo}</td>
                                                                    <td>{item?.productsData?.name}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
                            </div>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}
