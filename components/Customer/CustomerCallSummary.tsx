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
import { EmptyRow, StatusBadge, formatTabDate } from './customerTabHelpers';

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
    <div className="cd-tab-pane">
      <div className="cd-tab-toolbar">
        <div>
          <h5 className="mb-0">Activities</h5>
          <p className="cd-muted-note mb-0">
            {Array.isArray(callSummaryData) ? callSummaryData.length : 0} records
          </p>
        </div>
        {/* <Link className="pt-2"
          href={{
            pathname: '/callsummary/create',
          }}><Button className="m-r-5" variant="dark">Add</Button></Link> */}
        <Button className="cd-btn" variant="dark" onClick={() => { setIsCreateSummary(true) }}>+ Add Activity</Button>
      </div>
      {
        isCreateSummary && (<div className="cd-form-card">
          <h6 className="cd-section-title">New Activity</h6>
          <Row className="g-3">
            <Col md={6} sm={6} xs={12}>
              <SelectCallTypes handleInputChange={handleInputChange} callType={formik.values.callType} />
              {formik.errors.callType && (
                <div className="text-danger small">{formik.errors.callType}</div>
              )}
            </Col>
            <Col md={6} sm={6} xs={12}>
              <SelectCallStatus handleInputChange={handleInputChange} callStatus={formik.values.callStatus} />
              {formik.errors.callStatus && (
                <div className="text-danger small">{formik.errors.callStatus}</div>
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
                <div className="text-danger small">{formik.errors.summary}</div>
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
                <div className="text-danger small">{formik.errors.notes}</div>
              )}
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button className="btn btn-dark cd-btn" disabled={!formik.isValid}
              onClick={() => {
                if (formik.isValid) {
                  formik.handleSubmit();
                }
                else {
                  console.log("is invalid", !formik.isValid)
                }
              }}>  <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Save  </Button>
          </div>
        </div>)
      }

      <div className="table-responsive cd-table-wrap">
        <Table className="cd-table mb-0" hover>
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
            {Array.isArray(callSummaryData) && callSummaryData.length ? (
              callSummaryData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-nowrap">{formatTabDate(item.createdAt)}</td>
                    <td>{item.userName || "-"}</td>
                    <td>{item.callType || "-"}</td>
                    <td><StatusBadge value={item.callStatus} /></td>
                    <td className="cd-cell-wrap">{item.summary || "-"}</td>
                  </tr>
                )
              })
            ) : (
              <EmptyRow colSpan={5} text="No activities found" />
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default CustomerCallSummary