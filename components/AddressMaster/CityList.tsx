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
    const total = resPaginateData.totalDocs || 0
    const from = total ? (paginationData.currentPage - 1) * paginationData.recordPerPage + 1 : 0
    const to = Math.min(total, paginationData.currentPage * paginationData.recordPerPage)
    const renderStatus = (item: any, label: string, onPick: (active: boolean) => void) => (
        <Dropdown className="am-status">
            <Dropdown.Toggle variant="light" className={item.active ? 'am-status-on' : 'am-status-off'}>
                <span className="am-dot"></span>{(item.active) ? 'Active' : 'Inactive'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => { if (window.confirm(`Are you sure to Active ${label}?`)) { onPick(true) } }}>Active</Dropdown.Item>
                <Dropdown.Item onClick={() => { if (window.confirm(`Are you sure to Inactive ${label}?`)) { onPick(false) } }}>Inactive</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
    return (
        <div>
            <div className="am-toolbar">
                <div className="am-count">{total} {total === 1 ? 'city' : 'cities'}</div>
                <div className="am-filters">
                    <Form.Control
                        type="text"
                        className="am-search"
                        onChange={(e) => { setPaginationData({ ...paginationData, currentPage: 1, search: e.target.value }) }}
                        value={paginationData.search}
                        autoComplete='off'
                        placeholder='Search city, district, state...'
                    />
                </div>
            </div>

            <div className="table-responsive cd-table-wrap">
                <Table className="cd-table mb-0" hover>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>City</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Pincode</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={8} className="cd-empty"><Spinner animation="border" size="sm" /></td></tr>
                        ) : Array.isArray(cityData) && cityData.length ? cityData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="cd-cell-ref">{from + index}</td>
                                    <td className="am-name">
                                        {item.cityName}
                                        {item.sfaId ? <span className="am-source ms-2">GG SFA</span> : null}
                                    </td>
                                    <td>{item.district || '-'}</td>
                                    <td>{item.state || '-'}</td>
                                    <td>{item.country || '-'}</td>
                                    <td>
                                        {Array.isArray(item.pincode) && item.pincode.length ? (
                                            <div className="am-chips">
                                                {item.pincode.slice(0, 3).map((p) => <span key={p} className="am-chip">{p}</span>)}
                                                {item.pincode.length > 3 ? <span className="am-chip am-chip-more" title={item.pincode.join(', ')}>+{item.pincode.length - 3}</span> : null}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td>{renderStatus(item, 'city', (active) => activeInactiveCity({ cityid: item._id, active }))}</td>
                                    <td className="text-end text-nowrap">
                                        <a className="am-icon-btn" title="Edit" onClick={() => { handleEditItem(item) }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></a>
                                        <a className="am-icon-btn am-icon-danger" title="Delete" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan={8} className="cd-empty">No cities found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="am-pager">
                <span>{total ? `Showing ${from}-${to} of ${total}` : ''}</span>
                <nav aria-label="Page navigation">
                    <ul className="pagination mb-0">
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
            </div>
        </div>
    )
}
