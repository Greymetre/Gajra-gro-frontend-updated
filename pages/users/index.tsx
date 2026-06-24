import { number } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Dropdown, Row, Table, Image, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllUsers, backendDeleteUser, backendPostUserStatus } from '../../helpers/backend_helper'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import { ActiveUserInterface } from '../../interfaces/user.interface'
import * as XLSX from 'xlsx';

export default function Users() {
  const router = useRouter()
  const userList = useSelector((state: any) => state?.users?.userList);
  const [isLoading, setIsLoading] = useState(true)
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'users.read':
        return { ...acc, canRead: true };
      case 'users.update':
        return { ...acc, canUpdate: true };
      case 'users.delete':
        return { ...acc, canDelete: true };
      case 'users.create':
        return { ...acc, canCreate: true };
      case 'users.export':
        return { ...acc, canExport: true };
      case 'users.import':
        return { ...acc, canImport: true };
      default:
        return acc;
    }
  }, {});
  const [activeRequestData, setActiveRequestData] = useState<ActiveUserInterface>({})
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    await backendGetAllUsers().then((res) => {
      dispatch({
        type: 'GET_USERS',
        payload: res.data
      })
      setIsLoading(false)
    })
  }
  useEffect(() => {
    
    fetchCustomers()
  }, [activeRequestData])

  const handleDeleteItem = (id: string) => {
    backendDeleteUser(id).then((result) => {
      if (!result.isError) {
        fetchCustomers()
      }
      else {

      }
    }).catch((err) => {

    });
  };

  const handleActiveItem = async (data: any) => {
    backendPostUserStatus(data).then((result) => {
      if (!result.isError) {
        setActiveRequestData(data)
        fetchCustomers()

      }
    }).catch((err) => {

    });
  };

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(userList.map(async (customer: any) => {
      customer.createdAt = (customer.createdAt) ? new Date(customer.createdAt).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
      }) : ''
      return customer
    }))
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "users.xlsx");
  }

  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='User List' />
      <Row>
        <Col xl={12} md={12} >
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h3 className="card-body">User List({Array.isArray(userList) ? userList.length : '0'})</h3>
            </Col>
            <Col md={6} className="text-end mb-3">
            {moduleAccess?.canExport ?
                  (<Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel</Button>) : null}
              <Link href={{ pathname: '/users/create', }}>
              {moduleAccess?.canCreate && <Button variant="dark"><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add User</Button>}
              </Link>
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
                              <th>Full Name</th>
                              <th>Mobile</th>
                              <th>Email</th>
                              <th>Gender</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(userList) && userList.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td><Link className="mb-3"
                                    href={{
                                      pathname: '/users/' + item._id,
                                    }}
                                  >{item.firstName + ' ' + item.lastName}</Link></td>
                                  <td>{item.phoneCode + item.mobile}</td>
                                  <td>{item.email}</td>
                                  <td>{item.gender}</td>
                                  <td className="position-relative">
                                        <Dropdown>
                                            <Dropdown.Toggle>
                                                <div className={"dot " + (item.active ? "green " : "yellow ")}></div><span>{(item.active) ? 'Active' : 'Inactive'}</span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to Active user?')) { handleActiveItem({ userid: item._id, active: true }) } }}>Active</Dropdown.Item>
                                                <Dropdown.Item onClick={() => { if (window.confirm('Are you sure to InActive user?')) { handleActiveItem({ userid: item._id, active: false }) } }}>Inactive</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                  {/* <td className="position-relative">
                                    <div className={"dot " + (item.active ? "green " : "yellow ")}></div><span>{(item.active) ? 'Active' : 'Inactive'}</span>
                                  </td> */}
                                  <td> {moduleAccess?.canUpdate && <Link className="mb-3"
                                    href={{
                                      pathname: '/users/create',
                                      query: { id: item._id },
                                    }}
                                  >
                                    <Button className="p-0" variant="outline-light"><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></Button>
                                  </Link> }
                                  {moduleAccess?.canDelete &&  <a className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></a>}</td>
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
