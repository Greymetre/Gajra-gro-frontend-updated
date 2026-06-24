import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, Image, FormLabel, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendAddNewCallSummary, backendUpdateCallSummary, backendGetCallSummary, backendImportCallSummary } from '../../helpers/backend_helper'
import Link from 'next/link'
import { BLACK_PLUS_CIRCLE_IMAGE, IMAGE_URL, WHITE_CHECKED_IMAGE } from '../../utils/constant';
import SelectCustomerList from '../../components/InputFields/SelectCustomerList';
import { Formik, FormikHelpers, useFormik, useFormikContext } from 'formik';
import * as yup from "yup";
import { CreateCallSummaryInterface, initialCreateCallSummary } from '../../interfaces/callsummary.interface';
import Select from 'react-select';
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';
import SelectCallTypes from '../../components/InputFields/SelectCallTypes';
import SelectCallStatus from '../../components/InputFields/SelectCallStatus';
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
import { Download } from 'react-bootstrap-icons';

interface KeyValue {
    [key: string]: any;
}
const schema = yup.object().shape({
    customerid: yup.string().min(3).required("Select Customer"),
    callType: yup.string().min(3).max(100).required("CallType is required"),
    summary: yup.string().min(3).max(100).required("Summary is required"),
    callStatus: yup.string().min(3).max(100).required("Status is required"),
});

export default function CreateCallSummarySave() {
    const router = useRouter()
    const { id } = router.query
    const [requestFileData, setRequestFileData] = useState<KeyValue[]>([]);
    const fetchCustomerDetail = async () => {
        await backendGetCallSummary(id).then((res) => {
            if (!res.isError) {
                const { data } = res
                Object.keys(data).forEach(async (key) => {
                    if (key in initialCreateCallSummary) {
                        formik.setFieldValue(key, data[key]);
                    }
                });
            }
        })
    }
    useEffect(() => {
        if (id) {
            fetchCustomerDetail()
        }
    }, [id])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
        formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    }
    const handleFormSubmit = async () => {
        try {
            var iData = await JSON.parse(JSON.stringify(formik.values));
            var actionSubmit = await (id) ? backendUpdateCallSummary(id, iData) : backendAddNewCallSummary(iData)
            actionSubmit.then((result) => {
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
        initialValues: initialCreateCallSummary,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
        enableReinitialize: true
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const newData = await readXlsxFile(file);
                await setRequestFileData(newData);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleFileUploadSubmit = async () => {
        try {
            const dataArray = Object.values(requestFileData);
            backendImportCallSummary(dataArray).then((result) => {
                console.log(result);
                if (!result.isError) {
                    router.push('/callsummary');
                }
                else {

                }
            }).catch((err) => {
                console.log('error', err);
            });
        }
        catch (e) {
            console.log(e, "Error in the Login");
        }
    };

    function readXlsxFile(file: File): Promise<KeyValue[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                // Convert the array of arrays into an array of objects with key-value pairs
                const keys = jsonData[0];
                const values = jsonData.slice(1);
                const dataObjects = values.map((value: any) => {
                    const obj: KeyValue = {};
                    Array.isArray(keys) && keys.forEach((key: string, index: number) => {
                        obj[key] = value[index];
                    });
                    return obj;
                });
                resolve(dataObjects);
            };
            reader.onerror = (e) => {
                reject(e);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    const handleExportTemplate = async () => {
        const headers = [{ userid: '', customerid: "", callType: "", summary: "", notes: "", callStatus: "", createdAt: ""}];
        var wb = utils.book_new(),
            ws = utils.json_to_sheet(headers);
        utils.book_append_sheet(wb, ws, "Data");
        writeFile(wb, "callingTemplate.xlsx");
    }

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/transaction', label: 'TransactionList' }} itemlabel='Transaction List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6} className="mb-3">
                            <h3 className="card-body mb-0">{(id) ? 'Edit' : 'Add'}  Call Summary</h3>
                        </Col>
                        <Card className="flat-card">
                            <Row>
                                <Col md={2}><Button onClick={handleExportTemplate} className="btn btn-dark p-2 pr-2" variant="outline-light"><Download /> Template</Button></Col>
                                <Col md={4}>
                                    <InputGroup className="mb-3">
                                        <Form.Control type="file" accept='.xlsx' onChange={handleFileChange} />
                                        <Button className="btn btn-dark" onClick={handleFileUploadSubmit}> Upload</Button>
                                    </InputGroup>
                                </Col>
                                <Col xl={6} md={6}>
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
                                </Col>
                                <Row className='p-4'>
                                    <SelectCustomerList handleInputChange={handleInputChange} customerid={formik.values.customerid} />
                                    <Col md={4} sm={6} xs={12}>
                                        <SelectCallTypes handleInputChange={handleInputChange} callType={formik.values.callType} />
                                        {formik.errors.callType && (
                                            <div className="text-danger">{formik.errors.callType}</div>
                                        )}
                                    </Col>
                                    <Col md={4} sm={6} xs={12}>
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

                                </Row>
                            </Row>
                        </Card>
                    </Row >
                </Col >
            </Row >
        </Layout >
    )
}

