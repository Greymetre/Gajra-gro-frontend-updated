import React , {useState} from 'react'
import { Button, Row, Col, Form, Card, Image, InputGroup, Alert } from 'react-bootstrap';
import  { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import {
   
    backendPostAddNewDAMAGEENTRIES ,
    backendPostAddNewDAMAGEENTRIESIntoTransaction,
} from '../../helpers/backend_helper'
import { WHITE_CHECKED_IMAGE, IMAGE_URL} from '../../utils/constant';
import {

    initialDamageEntriesData
} from '../../interfaces/coupon.interface';
import {
    useFormik,
} from 'formik';
import * as yup from "yup";
import SelectCustomerList from '../../components/InputFields/SelectCustomerList';
import ImageUpload from '../../components/InputFields/selectDamageEntriesImage';

interface FormValues {
  customerid: string;
  couponGg: string;
  couponCode: string;

  // Add other fields as needed
}
const schema = yup.object().shape({
    // couponImage: yup.array()
    // .min(1, 'At least one image is required')
    // .required('Image is required'),
  customerid: yup.string().required('Customer ID is required'),
  couponGg: yup.string().required('Coupon Gg is required'),
  couponCode: yup.string().required('Coupon Code is required')
  });
  

export default function CouponSave() {
    const router = useRouter()
    //Button for disable Save and Approved button when any one button is clicked
     const [disbledButton , setDisabledButtons] = useState(false)
     const [show, setShow] = React.useState(false);
     const [alertMessage, setAlertMessage] = React.useState({
       variant: "",
       heading: "",
       message: "",
     });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            name,
            value,
            type
        } = event.target
        formik.setFieldValue(name, (type === "number") ? parseInt(value) : value);
    }

  
const handleFormSubmit = async () => {
  setDisabledButtons(true)
    // console.log(formik.values, "iData");  // Log the form values

  try {
    // console.log(formik.isSubmitting);  // Check if form is being submitted
    // console.log(formik.values, "iData");  // Log the form values
     const formdata = new FormData();
 

// Check and append each image if it's a File object
if (Array.isArray(formik.values.couponImage)) {
    formik.values.couponImage.forEach((image) => {
      if (image) {
        formdata.append('couponImage', image); // Appending all images under a single 'couponImage' key
      }
    });
  }
  
  // Append other fields, checking if they are defined
  if (formik.values.customerid) {
    formdata.append('customerid', formik.values.customerid);
  }
  
  if (formik.values.couponCode) {
    formdata.append('couponCode', formik.values.couponCode);
  }
  
  if (formik.values.couponGg) {
    formdata.append('couponGg', formik.values.couponGg);
  }
  
  

    // Make the backend API call and wait for the result
    const result = await backendPostAddNewDAMAGEENTRIES(formdata);

    // Once the result is received, check if there's an error
    if (!result.isError) {
      // If no error, navigate to the damage entries page
      router.push('/damageentries');
    }
    setDisabledButtons(false)

    // Set submitting state to false after the submission is done
    formik.setSubmitting(false);
  } catch (error) {
    console.log(error, "Error in the Login");
    setDisabledButtons(false)

    formik.setSubmitting(false);  // In case of error, also stop submitting state
  }
};


const handleFormSubmittoTransaction = async () => {
    // console.log(formik.values, "iData");  // Log the form values
    setDisabledButtons(true)

  try {
       const reqestData = {
        customerid : formik.values.customerid ,
        couponCode : formik.values.couponCode ,
        couponGg : formik.values.couponGg ,
        statusType : 'Approved',
       }


    // Make the backend API call and wait for the result
    const result = await backendPostAddNewDAMAGEENTRIESIntoTransaction(reqestData);
    
    // Once the result is received, check if there's an error
    if (!result.isError) {
      // If no error, navigate to the damage entries page
      router.push('/damageentries');
    }
    setDisabledButtons(false)

    // Set submitting state to false after the submission is done
    formik.setSubmitting(false);
    
  } catch (error :any) {
    console.log(error, "Error in the Login");
    setDisabledButtons(false)
    setShow(true)
    setAlertMessage({
      variant: "danger",
      heading: "Oh snap! You got an error!",
      message: error.response?.data?.message,
    });
    formik.setSubmitting(false);  // In case of error, also stop submitting state
  }
};

      const formik = useFormik({
        initialValues: initialDamageEntriesData,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
      });
      const handleApproveClick = async () => {
        // Manually validate the form
        const errors = await formik.validateForm();
      
        // Use Formik's setTouched method properly
        formik.setTouched(
          Object.keys(formik.values).reduce((acc, key) => {
            acc[key as keyof FormValues] = true; // Use keyof FormValues to avoid TypeScript error
            return acc;
          }, {} as Record<keyof FormValues, boolean>) // Properly typed touched object
        );
      
        // Check if errors exist and trigger custom logic
        if (Object.keys(errors).length === 0) {
          handleFormSubmittoTransaction(); // Trigger your custom API logic
        } else {
          console.log('Form is invalid', errors); // Handle errors if any
        }
      };
      
    return (
        <Layout>
          {show && (
  <Alert
    variant={alertMessage.variant}
    onClose={() => setShow(false)}
    dismissible
  >
    <Alert.Heading>{alertMessage.heading}</Alert.Heading>
    <p>{alertMessage.message}</p>
  </Alert>
)}
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/coupons', label: 'Damage QR Entries' }} itemlabel='Damage Entries' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6} className="mb-3">
                            <h3 className="card-body mb-0">Add Damage Entries</h3>
                        </Col>

                        <Card className="flat-card">
                            <Row>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-center card-body'>
                                        <Col xl={6} md={6} >

                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-end card-body'>
                                        <Col xl={12} md={12} className="text-end">
                                            <Button className="btn btn-dark" 
                                            disabled={!formik.isValid || disbledButton}
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
                                
                                   
                                    <SelectCustomerList handleInputChange={handleInputChange} customerid={formik.values.customerid} />

  {formik.touched.customerid && formik.errors.customerid ? (
            <span className="text-danger">{formik.errors.customerid}</span>
          ) : null}
          <Row className='pt-4'>
                                    <Col md={7} sm={7} xs={11} lg={4} >
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="Coupon">Coupon Code </Form.Label>
                                        
                                                    <div className="mb-3" >
                                                    <InputGroup>
                                                        <Form.Control className="mb-1"
                                                            name='couponCode'
                                                            value={formik.values.couponCode}
                                                            onChange={handleInputChange}
                                                            required={true}
                                                            autoComplete='off'
                                                        />
                                               
                                                    </InputGroup>
                                                       {/* Display error for Coupon Code */}
            {formik.touched.couponCode && formik.errors.couponCode ? (
              <div className="text-danger">{formik.errors.couponCode}</div>
            ) : null}
                                                    
                                                    </div>
                                                
                                            
                                        </Form.Group>
                                    </Col>
                                    <Col md={7} sm={7} xs={11} lg={4} >
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="couponGg">Coupon GG </Form.Label>
                                        
                                                    <div className="mb-3" >
                                                    <InputGroup>
                                                        <Form.Control className="mb-1"
                                                            name='couponGg'
                                                            value={formik.values.couponGg}
                                                            onChange={handleInputChange}
                                                            required={true}
                                                            autoComplete='off'
                                                        />
                                               
                                                    </InputGroup>
                                                         {/* Display error for Coupon GG */}
            {formik.touched.couponGg && formik.errors.couponGg ? (
              <div className="text-danger">{formik.errors.couponGg}</div>
            ) : null}
                                                    </div>
                                             
                                            
                                        </Form.Group>
                                   
                                    </Col>
                                
                                </Row>
                                <Row className='align-items-end card-body'>
                                        <Col xl={12} md={12} className="text-end">
                                            <Button className="btn btn-dark" 
                                            disabled={!formik.isValid || disbledButton}
                                                onClick={() => {
                                                    // if (formik.isValid) {
                                                    //     formik.handleSubmit();
                                                    handleApproveClick()

                                                    // }
                                                    // else {
                                                    //     console.log("is invalid", !formik.isValid)
                                                    // }
                                                }}>  <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />Approve  </Button>
                                        </Col>
                                    </Row>
                               
                                        <ImageUpload setFieldValue={formik.setFieldValue} values={formik.values.couponImage} />


                                        {formik.touched.couponImage && formik.errors.couponImage ? (
      <div className="text-danger p-2">{formik.errors.couponImage}</div>
    ) : null}
                            </Row>
                        </Card>
                    </Row >
                </Col >
            </Row >

        </Layout>
    )
}