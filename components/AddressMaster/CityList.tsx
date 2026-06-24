import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Container, Button, Form, Row, Col, Card, Nav, Table, Dropdown, Image, Spinner } from 'react-bootstrap';
import { backendGetAllCities, backendDeleteCity, backendPostCityStatus } from "../../helpers/backend_helper"
import { PencilSquare, XSquare } from 'react-bootstrap-icons';
import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'
import { PaginationInterface, ResPaginateInterface, initialPagination, initialResPaginate } from '../../interfaces/pagination.interface';
import { AddressCityViewInterface } from '../../interfaces/address.interface';

export default function CityList(props: any) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [cityData, setCityData] = useState<Array<AddressCityViewInterface>>([])
    const [paginationData, setPaginationData] = useState<PaginationInterface>(initialPagination)
    const [resPaginateData, setResPaginateData] = useState<ResPaginateInterface>(initialResPaginate)
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState('')
    const cityList = useSelector((state: any) => state?.city?.city);
    const { handleVisible, handleEditCity } = props;
    const fetchCity = async () => {
        await backendGetAllCities(paginationData).then((res) => {
            const { docs, paginate } = res.data
            let totalData = Array.isArray(paginate) && paginate.length && paginate[0].totalDocs
            setResPaginateData({ ...resPaginateData, totalDocs: totalData, totalPages: Math.ceil(totalData / paginationData.recordPerPage) })
            setCityData(docs)   
            setIsLoading(false)   
            // dispatch({
            //     type: 'GET_CITIES',
            //     payload: res.data
            // })
        })
    }
    useEffect(() => {
        fetchCity()
    }, [paginationData])

    const handleEditItem = (city: object) => {
        handleVisible('AddCity')
        handleEditCity(city)
    };

    const handleDeleteItem = (id: string) => {
        backendDeleteCity(id).then((result) => {
            if (!result.isError) {
                //handleVisible('CityList')
                fetchCity()
            }
            else {

            }
        }).catch((err) => {

        });
    };

    const activeInactiveCity = (iData: any) => {
        backendPostCityStatus(iData).then((result) => {
            if (!result.isError) {
                fetchCity()
            }
        }).catch((err) => {

        });
    }
    return (
        <div className="table-border-style">
            <div className="table-responsive">
                <Row className="align-items-center mb-4">
                <Col md={9}></Col>
                <Col md={3} className='text-end'>
                    <Form.Group className="form-group">
                        <Form.Label></Form.Label>
                        <Form.Control
                        type="text"
                        onChange={(e) => { setPaginationData({ ...paginationData, search: e.target.value }) } }
                        value={paginationData.search}
                        autoComplete='off'
                        placeholder='Search'
                        />
                    </Form.Group>
                    </Col>
                    <Col sm={12} md={12}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Pincode</th>
                                    <th>State</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(cityData) && cityData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td >{item.cityName}</td>
                                            <td>{item.pincode}</td>
                                            <td>{item.state}</td>
                                            <td>{item.country}</td>
                                            <td className="position-relative">
                                                <Dropdown>
                                                    <Dropdown.Toggle>
                                                        <div className={"dot " + (item.active ? "green " : "yellow ")}></div><span>{(item.active) ? 'Active' : 'Inactive'}</span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Active city?')) { activeInactiveCity({ cityid: item._id, active: true }) } }}>Active</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Inactive city?')) { activeInactiveCity({ cityid: item._id, active: false }) } }}>Inactive</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td><a className="btn p-0 btn-icon" onClick={() => { handleEditItem(item) }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></a>
                                                <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    {(isLoading) ?
                        <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
                    <Col xl={12} sm={12} xs={12} className='mb-3 text-end'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                <li className={`page-item ${paginationData.currentPage === 1 ? 'disabled' : ''}`}>
                                    <a className="page-link" onClick={() => {
                                        setPaginationData({ ...paginationData, currentPage: paginationData.currentPage - 1 })
                                        router.push(`/address/?page=${paginationData.currentPage - 1}`);
                                    }
                                    }>Previous</a>
                                </li>

                                <li className={`page-item ${paginationData.currentPage === resPaginateData.totalPages ? 'disabled' : ''}`}>
                                    <a className="page-link"
                                        onClick={() => {
                                            setPaginationData({ ...paginationData, currentPage: paginationData.currentPage + 1 })
                                            router.push(`/address/?page=${paginationData.currentPage + 1}`);
                                        }
                                        }>Next</a>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            </div>
        </div>
    )
}