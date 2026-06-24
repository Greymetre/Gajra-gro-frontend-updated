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

    return (
        <div className="table-border-style">
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>ISO</th>
                            <th>Country</th>
                            <th>Status</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(stateList) && stateList.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.stateName}</td>
                                    <td>{item.iso}</td>
                                    <td>{item.countryName}</td>
                                    <td className="position-relative">
                                        <Dropdown>
                                            <Dropdown.Toggle>
                                                <div className={"dot " + (item.active ? "green " : "yellow ")}></div><span>{(item.active) ? 'Active' : 'Inactive'}</span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Active state?')) { activeInactiveState({ stateid: item._id, active: true }) } }}>Active</Dropdown.Item>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Inactive state?')) { activeInactiveState({ stateid: item._id, active: false}) } }}>Inactive</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td><a className="btn p-0 btn-icon" onClick={() => { handleEditItem(item) }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></a>
                                        <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}