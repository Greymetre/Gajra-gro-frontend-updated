import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link'
import Router, { useRouter } from 'next/router';
import { Container, Button, Form, Image,Row, Col, Card, Nav, Table } from 'react-bootstrap';
import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE , WHITE_CHECKED_IMAGE} from '../../utils/constant'
import { backendPostAddNewCountry, backendPatchUpdateCountry } from "../../helpers/backend_helper"

import { Formik, FormikHelpers ,useFormik,useFormikContext} from 'formik';
import  * as yup from "yup";


const schema = yup.object().shape({
    countryName: yup.string(
        
    ).min(3).required("countryName is required"),

   iso: yup.string().min(3,"must be in 3 character ").required("iso is required"),
   phoneCode: yup.string()
   .length(3, `The country code must be exactly  letters`)
   .required('phoneCode is required'),
   currency: yup.string()
   .required('currency is required'),
   timezones: yup.string()
   .required(' timezones is required'),
   flag: yup.string()
   .required('flag Name is required'),
   
  });



export default function AddCountry(props: any) {
  
    const router = useRouter()
    const { id } = router.query;
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState('')
    const { handleVisible, initialCountyData } = props;
    const [requestData, setRequestData] = useState(initialCountyData)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value ,type} = event.target
        formik.setFieldValue(name,  (type === "number") ? parseInt(value) :value);
       // formik.setFieldValue(name,value);
        //setRequestData({ ...requestData, [name]: value })
    }
    const handleFormSubmit = async () => {
        try {
            var iData = await JSON.parse(JSON.stringify(formik.values));
            await delete iData["_id"];
            await delete iData["active"];
        
            var actionSubmit = await (formik.values._id) ? backendPatchUpdateCountry(formik.values._id, iData) : backendPostAddNewCountry(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    formik.setSubmitting(true);                
                    handleVisible('CountyList')
                }
                else {

                }
            }).catch((err) => {

            });
        }
        catch (e) {
            console.log(e, "Error in the Login");
        }
    };



    const  formik = useFormik({
        initialValues:{
            _id:"",
            countryName: "",
          iso: "",
          phoneCode:"",
          currency:"",
          timezones:"",
          
          flag:"",
          
        },
        validationSchema: schema,
       onSubmit: handleFormSubmit,
  
      });
    
    return (
        <>
            <Row className="p-4">
            <Col md={12} sm={12} xs={12} className="text-end">
                    <Form.Group className="form-group">
                        <Button type="submit"   disabled={!formik.isValid}   
                                              onClick={()=>{
                                           if(formik.isValid){
                                                formik.handleSubmit();
                                             }
                                             else{
                                             console.log("is invalid",!formik.isValid)
                                             }
                                         } } className="btn text-white bg-dark float-right"><Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Save</Button>
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Country Name</Form.Label>
                        <Form.Control type="text" name="countryName" onChange={handleInputChange} value={formik.values.countryName}           onBlur={formik.handleBlur} placeholder="Enter Country" className="form-control" />
                        {formik.errors.countryName && (
      <div className="text-danger">{formik.errors.countryName}</div>
    )}
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">ISO</Form.Label>
                        <Form.Control type="text" name="iso" onChange={handleInputChange}       onBlur={formik.handleBlur}  value={formik.values.iso} placeholder="Enter ISO" className="form-control" />
                        {formik.errors.iso && (
      <div className="text-danger">{formik.errors.iso}</div>
    )}
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Phone Code</Form.Label>
                        <Form.Control type="text" name="phoneCode" onChange={handleInputChange}        onBlur={formik.handleBlur} value={formik.values.phoneCode} placeholder="Enter Phone Code" className="form-control" />
      
                        {formik.errors.phoneCode && (
      <div className="text-danger">{formik.errors.phoneCode}</div>
    )}
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Currency</Form.Label>
                        <Form.Control type="text" name="currency" onChange={handleInputChange}         onBlur={formik.handleBlur} value={formik.values.currency} placeholder="Enter Currency" className="form-control" />
                        {formik.errors.currency && (
      <div className="text-danger">{formik.errors.currency}</div>
    )}
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group"> 
                        <Form.Label className="form-label">Time Zone</Form.Label>
                        <Form.Control type="text" name="timezones" onChange={handleInputChange}        onBlur={formik.handleBlur} value={formik.values.timezones} placeholder="Enter Time zone" className="form-control" />
                        {formik.errors.timezones && (
      <div className="text-danger">{formik.errors.timezones}</div>
    )}
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Flag</Form.Label>
                        <Form.Control type="text" name="flag" onChange={handleInputChange}        onBlur={formik.handleBlur} value={formik.values.flag} placeholder="Enter Flag" className="form-control" />
                        {formik.errors.flag && (
      <div className="text-danger">{formik.errors.flag}</div>
    )}
                    </Form.Group>
                </Col>
                
            </Row>

        </>
    )
}