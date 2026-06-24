import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, FormLabel, Image, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendPostAddNewRedemption, backendPatchUpdateRedemption, backendGetRedemptionInfo, backendGetGiftInfo, backendGetSaleInfo, backendPatchUpdateSale, backendPostAddNewSale } from '../../helpers/backend_helper'

import SelectCustomerList from '../../components/InputFields/SelectCustomerList';
import SelectGiftDropDown from '../../components/InputFields/SelectGiftDropDown';
import { OrdersCreateInterface, initialOrders } from '../../interfaces/orders.interface';

import { CUSTOMER_DEMO_IMAGE, EDIT_DEMO_IMAGE, EXCEL_DEMO_IMAGE, IMAGE_URL,WHITE_TRASH_IMAGE,WHITE_CHECKED_IMAGE, PROFILE_DEMO_IMAGE,RED_TRASH_IMAGE, BLACK_PLUS_CIRCLE_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE } from '../../utils/constant'

import { backendGetProductsDropdownList,backendGetOrderInfo,backendPostAddNewOrder,backendPatchUpdateOrder } from '../../helpers/backend_helper'
import { Formik, Field,FormikHelpers,FieldArray,ErrorMessage ,useFormik,useFormikContext} from 'formik';
import  * as yup from "yup";
import { initialSales,SalesCreateInterface } from '../../interfaces/sales.interface';




const schema = yup.object().shape({
    parentid: yup.string()
    .required('parentid is required'),
    status: yup.string()
   .required('  status is required'),
   totalAmount: yup.number()
   .required(' totalAmount is required'),
  
   address: yup.string()
   .required('   address Name is required'),
   paymentStatus: yup.string()
   .required('paymentStatus is required'),
   subTotal: yup.number()
   .required('invoiceNo is required'),

   

   detail: yup.array().of(
   
    yup.object().shape({
 

             price: yup.number().required(`require field`),
             quantity: yup.number().required(`require field`), 
             lineTotal: yup.number().required(`require field`),
     })
    )

  });

  

export default function SaleSave() {
    const router = useRouter()
    // const [requestData, setRequestData] = useState<SalesCreateInterface>(initialSales)
    const { id } = router.query
    const [productData, setProductData] = useState([])
    const [giftPoint, setGiftPoint] = useState(1)
    const fetchSaleDetail = async () => {
        await backendGetSaleInfo(id).then((res) => {
            if (!res.isError) {
                formik.setValues(res.data)
            }
        })
    }
    useEffect(() => {
        if (id) {
            fetchSaleDetail()
        }
    }, [id])
    const fetchGiftData = async (giftid : string) => {
        await backendGetGiftInfo(giftid).then(async(res) => {
            if(!res.isError)
            {
                await setGiftPoint(res.data.points);
            }
        })
    }

    
    const fetchProductsList = async () => {
        await backendGetProductsDropdownList().then((res: any) => {
            if (!res.isError) {
                setProductData(res.data)
            }
        })
    }
    useEffect(() => {
        fetchProductsList()
    }, [])

    const handleInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
       
       
            formik.setFieldValue(name,(type === "number") ? parseInt(value) : value);
        
       
       
    }
    const handleFormSubmit = async () => {
        try {
            var iData = await JSON.parse(JSON.stringify(formik.values));
          //  ['_id', 'active','giftid','coupon','invoiceNo' ,'quantity','redeemedpoints','createdAt', 'giftName','address','giftType','firmName','status'].forEach(e => delete iData[e]);
            var actionSubmit = await (formik.values.parentid) ?  backendPatchUpdateSale(formik.values.parentid, iData) : backendPostAddNewSale(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    router.push('/sales');
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
           
            parentid: "6386e7f2cdf7fa81c533b10e",
    subTotal: 1,
    totalAmount: 1,
    customerid: "",
    paymentStatus:"",

    status : "Open",
    address:"",
   
    detail:[{
        productid:[],
        productDetailid:[],
        quantity:0,
        price:1,
        lineTotal:1,
        

    }]
}
            
           
        ,
        validationSchema: schema,
       onSubmit: handleFormSubmit,
  
      });
    

 
      console.log("error",formik.errors);
      console.log(formik.
        values);

      
        const removeDetail = () => {
        //    formik.setValues({
        //       ...formik.values,
        //       detail: formik.values.detail.filter(details => details.productid !== formik.values.productid),
        //     });
          };


       const   adddetailBelow = () => {
         //   console.log(formik.values.detail.findIndex(p => p.productid === formik.values.productid));
            const detail = formik.values.detail;
        //     detail.splice(
        //       formik.values.detail.findIndex(p => p.productid === formik.values.productid) + 1,
        //       0,
        //       {
        //         productid:[],
        //         productDetailid:[],
        //         quantity:0,
        //         price:1,
        //         lineTotal:1,
                
        //       },
        //     );
        //    formik.setValues({
        //       ...formik.values,
        //       detail,
        //     });
          };

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/sales', label: 'SaleList' }} itemlabel='Sales List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6}>
                            <h3 className="card-body mb-3">{ (id) ? 'Edit' : 'Add' }Sale</h3>
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
                                             disabled={!formik.isValid} 
                                                
                                             onClick={()=>{
                                                 if(formik.isValid){
                                                    formik.handleSubmit();
                                                 }
                                                 else{
                                                 console.log("is invalid",!formik.isValid)
                                                 }
                                             }}
                                           >  <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />Save </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Row className='p-4'>
                                    <Row>
                              
                                    <Col  md={4} sm={6} xs={12}>
                                   <Form.Group >
                                            <Form.Label htmlFor="ModelName" >Parent</Form.Label>
                                <Form.Select 
                                //name={`detail.${index}.productid`}  value={formik.values.productid}
//   onChange={formik.handleChange}
  required={true}
             >
                                              
                                            
                                            </Form.Select>
                                            </Form.Group>
                                   </Col>
            
                       
                                <SelectCustomerList handleInputChange = {handleInputChange} customerid = {formik.values.customerid} />
                                {/* <Col  md={4} sm={6} xs={12}>
                                <Form.Group  >
                                            <Form.Label htmlFor="ModelName" column sm="4">OrderDate</Form.Label>
                                            <Col sm="10"> <Form.Control
                                                  type="date"
                                                  name="orderdate"
                                                  onChange={handleInputChange}
                                                  value={formik.values.orderdate}
                                                  required={true}
                                            />  </Col>
                                              {formik.errors.paymentStatus && (
      <div className="text-danger">{formik.errors.paymentStatus}</div>
    )}
                                        </Form.Group>
                                        </Col> */}
                                </Row>
                                <Row>
                                <Col md={4} sm={6} xs={12}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="endedAt">Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                onChange={handleInputChange}
                                                value={formik.values.address}
                                                onBlur={formik.handleBlur}
                                                required={true}
                                                autoComplete='off'
                                                placeholder='Enter End address'
                                            />
                                            {formik.errors.address && (
      <div className="text-danger">{formik.errors.address}</div>
    )}
                                        </Form.Group>
                                    </Col>
                             
                                </Row>
                             
                                    <Col md={12} sm={12} xs={12} className="p-2">
                                        <h4> Details</h4>
                                    </Col>
                                  
                      
                                    <FieldArray
          name="detail"
    
          validateOnChange={false}
          render={(arrayHelpers) => (
            <div>
              {
              
              formik.values.detail.map((schemedetail, index) => (
             
                <div key={index}> 
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Products</th>
          <th>ProductDetail</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
   
      <tbody 
           >
     

      <tr>
          <td>1</td>
          <td key={index}> <Form.Select name={`detail.${index}.productid`}
  value={formik.values.detail[index].productid}
  onChange={formik.handleChange}
  required={true}
                                            as="select"    >
                                              
                                            
                                            {productData.map((item: any, index) => (
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                ))}
                                            </Form.Select></td>
          <td>Otto</td>
          <td key={index} >
         <Form.Select name={`detail.${index}.productid`}
  value={formik.values.detail[index].productid}
//   onChange={formik.handleChange}
  required={true}
             >
                                              
                                              {/* {productData.map((item, index) => (
                                                    <option key={index} value={item.price}>{item.price}</option>
                                                ))} */}
                                            </Form.Select>
            
            </td>
          <td key={index}><Form.Control
   name={`detail[${index}].quantity`}
   value={formik.values.detail[index].quantity}
  onChange={handleInputChange}
   required={true}
                              // onBlur={formik.handleBlur}
                               autoComplete='off'
                               placeholder='Enter quantity'
                             
 /></td>
    <td>{22*formik.values.detail[index].quantity}</td>
    <td>
                                    <Button
                      type="button"
                      onClick={removeDetail } // remove an item from the list
                    >
                      -
                    </Button>
                
                                    </td>
        </tr>
      
        </tbody>

   </Table>

   
                
</div>   
                ))}
<Button
                      type="button"
                      onClick={adddetailBelow } // remove an item from the list
                    >
                      +
                    </Button>
            </div>
          )}
        />
                      

    <Row>
        <Col></Col>
        <Col> 
      
                                        <Form.Group  as={Row} className="mb-3">
                                            <Form.Label htmlFor="ModelName" column sm="4">PaymentStatus</Form.Label>
                                            <Col sm="8"> <Form.Control
                                                type="text"
                                                name="paymentStatus"
                                                onChange={handleInputChange}
                                                value={formik.values.paymentStatus}
                                                required={true}
                                                autoComplete='off'
                                                
                                                placeholder='Enter '
                                            />  </Col>
                                              {formik.errors.paymentStatus && (
      <div className="text-danger">{formik.errors.paymentStatus}</div>
    )}
                                        </Form.Group>
                                 
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="4">
        SubTotal
        </Form.Label>
        <Col sm="8">
       
       {/* {22*formik.values.detail[index].quantity} */}
              </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">
        totalAmount 
        </Form.Label>
        <Col sm="8">
          <Form.Control     type="number"
    name="totalAmount"
    onChange={handleInputChange}
    value={formik.values.totalAmount}
    required={true}
   
        autoComplete='off'
    placeholder='Enter totalAmount'  />
        </Col>
      </Form.Group>

        
      {/* <Form.Group as={Row} className="mb-3" >
        <Form.Label column sm="4">
        lineTotal 
        </Form.Label>
        <Col sm="8"  key={index}  >
          <Form.Control
           name="{`detail.${index}.lineTotal}"
           type="text"
           value={formik.values.detail[index].lineTotal}
          onChange={handleInputChange}
           required={true}
                                      // onBlur={formik.handleBlur}
                                       autoComplete='off'
                                       placeholder='Enter quantity'
          
        />
        </Col>
      </Form.Group> */}

 

  </Col> 
  </Row> 
     
        
   
                                </Row>
                            </Row>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}

