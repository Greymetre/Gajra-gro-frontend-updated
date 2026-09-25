import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";

import Link from 'next/link'
import {Image, Container, Button, Form, Row, Col, Card, Nav, Table, Dropdown } from 'react-bootstrap';

import { backendGetAllStates, backendDeleteState, backendPostStateStatus } from "../../helpers/backend_helper"
import { EyeFill, EyeSlashFill, PencilSquare, XSquare } from 'react-bootstrap-icons';

import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

export default function StateList(props: any) {
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState('')
    const stateList = useSelector((state: any) => state?.states?.states);
    const { handleVisible, handleEditState } = props;
    const fetchStates = async () => {
        await backendGetAllStates().then((res) => {
            dispatch({
                type: 'GET_STATES',
                payload: res.data
            })
        })
    }
    useEffect(() => {
        fetchStates()
    }, [])

    const handleEditItem = (state: object) => {
        handleVisible('AddState')
        handleEditState(state)
    };

    const handleDeleteItem = (id: string) => {
        backendDeleteState(id).then((result) => {
            if (!result.isError) {
           
                fetchStates()
            }
            else {

            }
        }).catch((err) => {

        });
    };

    const activeInactiveState = (iData: any) => {
        backendPostStateStatus(iData).then((result) => {
            if (!result.isError) {
                fetchStates()
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
    const rows = Array.isArray(stateList)
        ? stateList.filter((item: any) => !q || `${item.stateName} ${item.countryName} ${item.iso}`.toLowerCase().includes(q))
        : []
    return (
        <div>
            <div className="am-toolbar">
                <div className="am-count">{rows.length} {rows.length === 1 ? 'state' : 'states'}</div>
                <div className="am-filters">
                    <Form.Control type="text" className="am-search" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete='off' placeholder='Search state, country...' />
                </div>
            </div>
            <div className="table-responsive cd-table-wrap">
                <Table className="cd-table mb-0" hover>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>State</th>
                            <th>ISO</th>
                            <th>Country</th>
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
                                        {item.stateName}
                                        {item.sfaId ? <span className="am-source ms-2">GG SFA</span> : null}
                                    </td>
                                    <td>{item.iso || '-'}</td>
                                    <td>{item.countryName || '-'}</td>
                                    <td>{renderStatus(item, 'state', (active) => activeInactiveState({ stateid: item._id, active }))}</td>
                                    <td className="text-end text-nowrap">
                                        <a className="am-icon-btn" title="Edit" onClick={() => { handleEditItem(item) }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></a>
                                        <a className="am-icon-btn am-icon-danger" title="Delete" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan={6} className="cd-empty">No states found</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
