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

    return (
        <div className="table-border-style">
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>ISO</th>
                            <th>Phone code</th>
                            <th>Currency</th>
                            <th>Timezone</th>
                            <th>Flag</th>
                            <th>Status</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(countryList) && countryList.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.countryName}</td>
                                    <td>{item.iso}</td>
                                    <td>{item.phoneCode}</td>
                                    <td>{item.currency}</td>
                                    <td>{item.timezones}</td>
                                    <td>{item.flag}</td>
                                    <td className="position-relative">
                                        <Dropdown>
                                            <Dropdown.Toggle>
                                                <div className={"dot " + (item.active ? "green " : "yellow ")}></div><span>{(item.active) ? 'Active' : 'Inactive'}</span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Active country?')) { activeInactiveCountry({ countryid: item._id, active: true }) } }}>Active</Dropdown.Item>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to InActive country?')) { activeInactiveCountry({ countryid: item._id, active: false }) } }}>Inactive</Dropdown.Item>
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