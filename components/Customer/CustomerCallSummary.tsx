import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { backendAddNewCallSummary, backendCustomerCallSummary } from '../../helpers/backend_helper'
import { CallSummaryInterface } from '../../interfaces/callsummary.interface'
import { Button, Col, Row, Table, Image, Form } from 'react-bootstrap'
import Link from 'next/link'
import * as yup from "yup";
import { useFormik } from 'formik';
import SelectCallTypes from '../InputFields/SelectCallTypes';
import SelectCallStatus from '../InputFields/SelectCallStatus';
import { IMAGE_URL, WHITE_CHECKED_IMAGE } from '../../utils/constant';

const schema = yup.object().shape({
  customerid: yup.string().min(3).required("Select Customer"),
  callType: yup.string().min(3).max(100).required("CallType is required"),
  summary: yup.string().min(3).max(100).required("Summary is required"),
  callStatus: yup.string().min(3).max(100).required("Status is required"),
});
const CustomerCallSummary = ({ customerid }: { customerid: any }) => {
  const router = useRouter()
  const [isCreateSummary, setIsCreateSummary] = useState(false)
  const [callSummaryData, setCallSummaryData] = useState<Array<CallSummaryInterface>>([])
  const fetchCustomerCallSummary = async () => {
    await backendCustomerCallSummary({ customerid: customerid }).then((res) => {
      if (res.isError == false) {
        setCallSummaryData(res.data)
      }
    })
  }
  useEffect(() => {
    if (customerid)
      fetchCustomerCallSummary()
  }, [customerid])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  }

  const handleFormSubmit = async () => {
    try {
      var iData = await JSON.parse(JSON.stringify(formik.values));
      await backendAddNewCallSummary(iData).then((result) => {
        if (!result.isError) {
          router.push('/callsummary');
        }
      }).catch((err) => {
      });
    }
    catch (e) {
      console.log(e, "Error in the Login");
    }
  };
  const formik = useFormik({
    initialValues: {
      customerid: customerid,
      callType: '',
      summary: '',
      callStatus: '',
      notes : ''
    },
    validationSchema: schema,
    onSubmit: handleFormSubmit,
    enableReinitialize: true
  });

  return (
    <Row>
      <Col xl={12} sm={12} xs={12} className="text-end">
        {/* <Link className="pt-2"
          href={{
            pathname: '/callsummary/create',
          }}><Button className="m-r-5" variant="dark">Add</Button></Link> */}
        <Button className="m-r-5" variant="dark" onClick={() => { setIsCreateSummary(true) }}>Add</Button>
      </Col>
      {
        isCreateSummary && (<Row className='p-4'>
          <Col md={6} sm={6} xs={12}>
            <SelectCallTypes handleInputChange={handleInputChange} callType={formik.values.callType} />
            {formik.errors.callType && (
              <div className="text-danger">{formik.errors.callType}</div>
            )}
          </Col>
          <Col md={6} sm={6} xs={12}>
            <SelectCallStatus handleInputChange={handleInputChange} callStatus={formik.values.callStatus} />
            {formik.errors.callStatus && (
              <div className="text-danger">{formik.errors.callStatus}</div>
            )}
          </Col>
          <Col md={6} sm={6} xs={12}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="Summary">Summary</Form.Label>
              <Form.Control
                type="text"
                name="summary"
                onChange={handleInputChange}
                value={formik.values.summary}
                required={true}
                autoComplete='off'
                as="textarea" rows={3}
                placeholder='Enter Summary'
              />
            </Form.Group>
            {formik.errors.summary && (
              <div className="text-danger">{formik.errors.summary}</div>
            )}
          </Col>
          <Col md={6} sm={6} xs={12}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="Summary">Notes</Form.Label>
              <Form.Control
                type="text"
                name="notes"
                onChange={handleInputChange}
                value={formik.values.notes}
                required={true}
                autoComplete='off'
                as="textarea" rows={3}
                placeholder='Enter Notes'
              />
            </Form.Group>
            {formik.errors.notes && (
              <div className="text-danger">{formik.errors.notes}</div>
            )}
          </Col>
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
        </Row>)
      }

      <div className="row-table">
        <Col sm={12} md={12}>
          <div className="card1">
            <div className="table-border-style">
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User Name</th>
                      <th>Call Type</th>
                      <th>Call Status</th>
                      <th>Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(callSummaryData) && callSummaryData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.createdAt}</td>
                          <td>{item.userName}</td>
                          <td>{item.callType}</td>
                          <td>{item.callStatus}</td>
                          <td>{item.summary}</td>
                          <td></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </Row>
  )
}

export default CustomerCallSummary