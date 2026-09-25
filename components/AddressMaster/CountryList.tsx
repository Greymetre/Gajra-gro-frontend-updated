import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { backendGetAllCountries, backendDeleteCountry, backendPostCountryStatus } from "../../helpers/backend_helper"
import Link from 'next/link'
import { Container, Button, Form, Row, Col, Image, Card, Nav, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, PencilSquare, XSquare } from 'react-bootstrap-icons';
import AddCountry from './AddCountry'

import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

export default function CountryList(props: any) {
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState('')
    const countryList = useSelector((state: any) => state?.country?.country);
    const { handleVisible, handleEditCountry } = props;
    const fetchCountry = async () => {
        await backendGetAllCountries().then((res) => {
            dispatch({
                type: 'GET_COUNTRIES',
                payload: res.data
            })
        })
    }
    useEffect(() => {
        fetchCountry()
    }, [])
    const handleEditItem = (country: object) => {
        handleVisible('AddCountry')
        handleEditCountry(country)
    };

    const handleDeleteItem = (id: string) => {
        backendDeleteCountry(id).then((result) => {
            if (!result.isError) {
          
                fetchCountry()
            }
        }).catch((err) => {

        });
    };

    const activeInactiveCountry = (iData: any) => {
        backendPostCountryStatus(iData).then((result) => {
            if (!result.isError) {
                fetchCountry()
            }
        }).catch((err) => {

        });
    }

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
    const [search, setSearch] = useState('')
    const q = search.trim().toLowerCase()
    const rows = Array.isArray(countryList)
        ? countryList.filter((item: any) => !q || `${item.countryName} ${item.iso} ${item.currency}`.toLowerCase().includes(q))
        : []
    return (
        <div>
            <div className="am-toolbar">
                <div className="am-count">{rows.length} {rows.length === 1 ? 'country' : 'countries'}</div>
                <div className="am-filters">
                    <Form.Control type="text" className="am-search" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete='off' placeholder='Search country...' />
                </div>
            </div>
            <div className="table-responsive cd-table-wrap">
                <Table className="cd-table mb-0" hover>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>Country</th>
                            <th>ISO</th>
                            <th>Phone Code</th>
                            <th>Currency</th>
                            <th>Timezone</th>
                            <th>Flag</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length ? rows.map((item: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td className="cd-cell-ref">{index + 1}</td>
                                    <td className="am-name">
                                        {item.countryName}
                                        {item.sfaId ? <span className="am-source ms-2">GG SFA</span> : null}
                                    </td>
                                    <td>{item.iso || '-'}</td>
                                    <td>{item.phoneCode || '-'}</td>
                                    <td>{item.currency || '-'}</td>
                                    <td className="cd-cell-wrap">{item.timezones || '-'}</td>
                                    <td>{item.flag || '-'}</td>
                                    <td>{renderStatus(item, 'country', (active) => activeInactiveCountry({ countryid: item._id, active }))}</td>
                                    <td className="text-end text-nowrap">
                                        <a className="am-icon-btn" title="Edit" onClick={() => { handleEditItem(item) }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></a>
                                        <a className="am-icon-btn am-icon-danger" title="Delete" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan={9} className="cd-empty">No countries found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
