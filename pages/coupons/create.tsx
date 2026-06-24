import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, FormLabel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import {
    backendPostAddNewCoupon, backendPatchUpdateCoupon,
    backendGetCouponInfo, backendGetCategoriesDropdownList,
    backendGetProductsDropdownList,
    backendGetSetting,
    backendPostImportNewCoupon
} from '../../helpers/backend_helper'
import { WHITE_CHECKED_IMAGE, IMAGE_URL, BLACK_PLUS_CIRCLE_IMAGE, RED_TRASH_IMAGE, EXCEL_DEMO_IMAGE } from '../../utils/constant';
import {
    CouponProfileInterface,
    initialCouponProfileData
} from '../../interfaces/coupon.interface';
import {
    Formik,
    FieldArray,
    useFormik,
    Field,
    ErrorMessage
} from 'formik';
import * as yup from "yup";
import CustomerTypeCheckbox from '../../components/InputFields/CustomerTypeCheckbox';
import SelectProductList from '../../components/InputFields/SelectProductList';
import { CloudUpload, Download } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

const schema = yup.object().shape({
    customerType: yup
      .array()
      .of(yup.string().required('Customer type is required'))
      .min(1, 'At least one customer type is required')
      .required('Customer type is required'),
  
    couponInfo: yup.array().of(
      yup.object().shape({
        couponCount: yup
          .number()
          .required('Coupon count is required')
          .min(1, 'Coupon count must be at least 1')
          .max(10000, 'Must be at most 10000'),
        productid: yup.string().required('Product is required'),
        subcategoryid: yup.string(),
        categoryid: yup.string(),
      })
    ),
  });
  
interface CouponInfo {
    couponCount: number;
    productid: string;
  }
export default function CouponSave() {
    const router = useRouter()
    const {
        id
    } = router.query
    // const [requestData, setRequestData] = useState<CouponProfileInterface>({})
    const fetchCouponDetail = async () => {
        await backendGetCouponInfo(id).then((res) => {
            if (!res.isError) {
                formik.setValues(res.data)
            }
        })
    }
    const [categoryData, setCategoryData] = useState([])
    const [productData, setProductData] = useState([])
    const fetchCategoriesList = async () => {
        await backendGetCategoriesDropdownList().then((res: any) => {
            if (!res.isError) {
                setCategoryData(res.data)
            }
        })
    }
    const fetchProductsList = async () => {
        await backendGetProductsDropdownList().then((res: any) => {
            const {
                docs
            } = res.data
            if (!res.isError) {
                setProductData(docs)
            }
        })
    }
    useEffect(() => {
        fetchCategoriesList()
    }, [])
    useEffect(() => {
        fetchProductsList()
    }, [])
    useEffect(() => {
        if (id) {
            fetchCouponDetail()
        }
    }, [id])
    const [customerTypeData, setCustomerTypeData] = useState(['Distributor',
        'Dealer', 'Stockist', 'Mechanic', 'STU', 'Fleet Owner'
    ])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            name,
            value,
            type
        } = event.target
        formik.setFieldValue(name, (type === "number") ? parseInt(value) : value);
    }
    const handleInputChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        var customertypes = (formik.values.customerType) ? JSON.parse(JSON.stringify(formik.values.customerType)) : [];
        if (checked) {
            customertypes.push(value);
        }
        else {
            customertypes = customertypes.filter(function (item: string) {
                return item !== value
            })
        }
        formik.setFieldValue(`customerType`, customertypes);
    }
    const handleFormSubmit = async () => {

        try {


            var iData = await JSON.parse(JSON.stringify(formik.values));
            ['_id', 'active', 'createdAt', 'categoryName', 'name', 'categoryid', 'productid', 'status'].forEach(e => delete iData[e]);
            if (id) {
                await delete iData["couponCount"];
            }
            var actionSubmit = await (formik.values._id) ? backendPatchUpdateCoupon(formik.values._id, iData) : backendPostAddNewCoupon(iData)
            actionSubmit.then((result) => {
                formik.setSubmitting(false)
                if (!result.isError) {
                    router.push('/coupons');

                }
            }).catch((err) => { });
        } catch (e) {
            console.log(e, "Error in the Login");
        }
    };
 
   const [isLoadingCheckbox , setIsLoadingCheckBox] = useState(false)
   
    const fetchSetting = async () => {

        setIsLoadingCheckBox(true)
        await backendGetSetting().then((res) => {
          if (!res.isError && res.data && Array.isArray(res.data.customerType)) {
            // Force a form update by resetting form values, only modifying the customerType
            // console.log(res.data.customerType, "res.data.customerType set successfully");

            formik.setFieldValue('customerType', res.data.customerType);
            setIsLoadingCheckBox(false)
            // console.log(res.data.customerType, "res.data.customerType set successfully");
          }
        });
      };
      
      useEffect(() => {
        fetchSetting();
      }, []);

      const formik = useFormik({
        initialValues: initialCouponProfileData,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
      });
      const createAndDownloadExcel = () => {
        // Define the columns and an empty template row
        const worksheetData = [
          ["CustomerType", "GGNO", "QTY","Packing List"], // Column headers
          ["", "", "",""] // Empty row for template
        ];
      
        // Create a new workbook and worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
      
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
      
        // Create a binary Excel file from the workbook
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      
        // Create a blob from the buffer and generate a download link
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(data);
        
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CustomerTemplate.xlsx'); // Specify the download file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
      };


      const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
      
        if (file) {
          const reader = new FileReader();
      
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const data = event.target?.result;
      
            if (data) {
              // Parse the Excel file to JSON
              const workbook = XLSX.read(data, { type: "binary" });
              const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
              const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                raw: false,
              });
      
              // Define the header mapping with specific keys
              const headerMapping: { [key: string]: keyof MappedItem } = {
                "CustomerType": "customerType",
                "GGNO": "ggNumber",
                "QTY": "couponCount",
                "Packing List": "packingList" // Assuming you want to include packing list
              };
      
              // Define the structure of the MappedItem
              interface MappedItem {
                customerType: string;
                ggNumber: string;
                couponCount: string;
                packingList: string; // Optional field for packing list
              }
      
              // Map the old headers to the new parameter names in the JSON data
              const mappedJsonData = jsonData.map((item: any) => {
                const mappedItem: MappedItem = {
                    customerType: '',
                    ggNumber: '',
                    couponCount: '',
                    packingList: ''
                };
      
                // Iterate over the object and map the headers
                for (const oldHeader in item) {
                  const newHeader = headerMapping[oldHeader] as keyof MappedItem;
      
                  if (newHeader) {
                    mappedItem[newHeader] = item[oldHeader];
                  }
                }
      
                return mappedItem;
              });
      
              // Function to handle the imported data, such as sending to API
              importExcelData(mappedJsonData);
      
            }
          };
      
          reader.readAsBinaryString(file);
        }
      };

      const importExcelData = async (data :any) => {
        const requestOption = {
            coupons :data
        }
         try {
            var actionSubmit = await backendPostImportNewCoupon(requestOption)
            console.log(actionSubmit , "actionSubmit")
          
                if (!actionSubmit.isError) {
                    router.push('/coupons');

                }
        
         } catch (error){
            console.log(error)
         }
      }
    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/coupons', label: 'QRcodeList' }} itemlabel='QRcode' />
            
            {
                !isLoadingCheckbox && <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6}>
                            <h3 className="card-body mb-4">{(id) ? 'Edit' : 'Create'}  QRcode</h3>
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
                                        <Col xl={3} md={12} className="text-end">
                                            <Button className="btn btn-dark" onClick={() => createAndDownloadExcel ()} >
                                                <Download /> Template 
                                            </Button>
                                        </Col>
                                        <Col xl={3} md={12} className="text-end upload_btn_container ">
                                            <Button className="btn btn-dark "  >
                                            <CloudUpload /> Upload  
                                            </Button>
                                            <input onChange={(e :any) => handleUploadExcel(e)} type="file" name="" id="" accept='.xlsx , .xls' className='coupon_entery_upload' />
                                        </Col>
                                        <Col xl={6} md={12} className="text-end">
                                            <Button className="btn btn-dark"
                                                disabled={(formik.isValid && formik.dirty && formik.isSubmitting)}
                                                onClick={() => {
                                                    if (formik.isValid) {

                                                        // set the profile Name  
                                                        formik.setFieldValue('profileName', new Date().getTime().toString() + new Date().getMilliseconds().toString(),);
 
                                                        formik.setSubmitting(true)
                                                        
                                                        formik.handleSubmit();
                                                    }
                                                    else { console.log("is invalid", !formik.isValid) ,  console.log("Form is invalid", formik.errors) }
                                                }}
                                            >
                                                <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />
                                                Generated
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Form>
                                    {
                                      Array.isArray(formik.values.customerType)  && 
                                    
                                <Row className='p-4'>
  <Col md={12} sm={12} xs={12}>
    <CustomerTypeCheckbox 
      key='customertype'
      handleInputChange={handleInputChecked}
      customerType={formik.values.customerType}
    />
  </Col>

  {/* Error message for customerType */}
  {
  // @ts-ignore 
  formik.values.customerType.length == 0 && (
    <div className="text-danger">Customer type is required</div>
  )}
</Row>

}
                                                  




                                    <Row className='p-4'>
                                        { Array.isArray(formik.values.couponInfo) && formik.values.couponInfo.map((info:any, index: number) => (
                                            <Row key={index}>
                                                <Col md={3} sm={3} xs={10}>
                                                    <Form.Label htmlFor="endedAt">Coupon Count </Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        name={`couponInfo[${index}].couponCount`}
                                                        value={formik.values.couponInfo[index].couponCount}
                                                        onChange={handleInputChange}
                                                        required={true} className="mb-1"
                                                        autoComplete='off'
                                                        placeholder='Enter CouponCount'
                                                    />
                                                   { (formik.values.couponInfo[index].couponCount < 1 || formik.values.couponInfo[index].couponCount > 10000 ) ? <div className="text-danger">Count must be at least 1 to 10000</div> : '' }
                                                </Col>
                                                <Col md={3} sm={3} xs={10}>
                                                <SelectProductList handleInputChange={handleInputChange} fieldname={`couponInfo[${index}].productid`} fieldvalue={formik.values.couponInfo[index].productid} />
                                                { formik.values.couponInfo[index].productid === '' && <div className="text-danger">Product Must be required</div> }
                                                </Col>
                                                
                                                <Col md={3} sm={3} xs={10}>
                                                    <Form.Label htmlFor="endedAt">Packing</Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        name={`couponInfo[${index}].packingList`}
                                                        value={formik.values.couponInfo[index].packingList}
                                                        onChange={handleInputChange}
                                                        required={true} className="mb-1"
                                                        autoComplete='off'
                                                        placeholder='Enter packing list'
                                                    />
                                                   { formik.values.couponInfo[index].packingList == "" ? <div className="text-danger">Packing list should not be empty</div> : '' }
                                                </Col>
                                                <Col md={3} sm={3} xs={10}>
                                                    <button className="mt-4 btn" type="button" onClick={() => {
                                                        const newInfo = formik.values.couponInfo.filter(function (copun: any, couponind: number) { return couponind !== index });
                                                        formik.setFieldValue('couponInfo', newInfo);
                                                    }}>
                                                        <Image src={IMAGE_URL + RED_TRASH_IMAGE} />
                                                    </button>
                                                </Col>
                                            </Row>
                                        )
                                        )
                                        }
                                        <Row className='text-end'>
                                        <Col md={12} sm={12} xs={12} className='text-end'>
                                        <Button variant="link" onClick={() => {
                                                const newRole = [
                                                    ...formik.values.couponInfo,
                                                    {
                                                        couponCount: 1,
                                                        productid: ''
                                                    }
                                                ];
                                                formik.setFieldValue('couponInfo', newRole);
                                            }}
                                            ><Image src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE} /> </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Form>
                            </Row>
                        </Card>
                    </Row>
                </Col>
            </Row>
}
        </Layout>
    )
}