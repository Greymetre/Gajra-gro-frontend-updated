import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link'
import { Container, Button,Image, Form, Row, Col, Card, Nav, Table } from 'react-bootstrap';

import { backendPostAddNewState , backendPatchUpdateState} from "../../helpers/backend_helper"
import CountryDropDown from '../InputFields/CountryDropDown';

import { EDIT_DEMO_IMAGE, IMAGE_URL, PROFILE_DEMO_IMAGE, RED_TRASH_IMAGE, SHOP_ALT_IMAGE, WHITE_PLUS_CIRCLE_IMAGE , WHITE_CHECKED_IMAGE} from '../../utils/constant'


import { Formik, FormikHelpers ,useFormik,useFormikContext} from 'formik';
import Router, { useRouter } from 'next/router';
import  * as yup from "yup";


const schema = yup.object().shape({
    stateName: yup.string(
        
    ).min(3).required("stateName is required"),

   iso: yup.string().min(3,"must be in 3 character ").required("iso is required"),
  
   
  });


export default function AddState(props :any) {
    const router = useRouter()
    const { id } = router.query;
    const [errorMsg, setErrorMsg] = useState('')
    const {  handleVisible, initialStateData } = props;
    const [requestData, setRequestData] = useState(initialStateData)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value,type } = event.target
        formik.setFieldValue(name,  (type === "number") ? parseInt(value) :value);
        //setRequestData({ ...requestData, [name]: value })
    }

    const handleFormSubmit = async() => {
        try {
            var iData = await JSON.parse(JSON.stringify(formik.values));
            await delete iData["_id"];
            await delete iData["active"];
            await delete iData["countryName"];
            var actionSubmit = await (formik.values._id) ? backendPatchUpdateState(formik.values._id, iData) : backendPostAddNewState(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    formik.setSubmitting(true);                

                    handleVisible('StateList')
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
            stateName: "",
          iso: "",
          countryid:"",
         
          
        },
        validationSchema: schema,
       onSubmit: handleFormSubmit,
  
      });
    

 
      console.log(formik.errors);
      console.log(formik.
        values);
    return (
        <>
            <Row className="p-4">
            <Col md={12} sm={12} xs={12} className="text-end">
                    <Form.Group className="form-group">
                        <Button type="submit"  disabled={!formik.isValid}   
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
                        <Form.Label className="form-label">State Name</Form.Label>
                        <Form.Control type="text" name="stateName" onChange={handleInputChange} value={formik.values.stateName} placeholder="Enter State" className="form-control" />
                    </Form.Group>
                    {formik.errors.stateName && (
      <div className="text-danger">{formik.errors.stateName}</div>
    )}
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">ISO</Form.Label>
                        <Form.Control type="text" name="iso" onChange={handleInputChange} value={formik.values.iso} placeholder="Enter ISO" className="form-control" />
                    </Form.Group>
                    {formik.errors.iso && (
      <div className="text-danger">{formik.errors.iso}</div>
    )}
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <CountryDropDown handleInputChange={handleInputChange} countryid={formik.values.countryid}/>
                </Col>
               
            </Row>
        </>
    )
}