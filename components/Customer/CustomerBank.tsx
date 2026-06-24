import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Row,
  Table,
  Image,
  Form,
  Tabs,
  Tab,
  ProgressBar,
} from "react-bootstrap";
import {
  backendCustomersBankInfo,
  backendCustomersBankVerified,
  backendCustomersUpiVerified,
  backendCustomersClearBank,
  backendCustomersClearUpi,
  backendCustomerkycVerified,
  backendCustomerkycRejected,
  backendCustomerKycUpload,
  backendGetCustomerInfo,
} from "../../helpers/backend_helper";
import {
  CustomerBankDetailInterface,
  initialBankDetail,
  initialKycData,
} from "../../interfaces/customer.interface";
import {
  IMAGE_URL,
  CUSTOMER_DEMO_IMAGE,
  WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { Formik, FormikHelpers, useFormik, useFormikContext } from "formik";
import * as yup from "yup";
import { objectAppendIntoformData } from "../../utils/utility";
const schema = yup.object().shape({
  // gstinNo: yup.string().optional().matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z1-9]{1})?$/, 'Invalid GSTIN'),
  gstinNo: yup.string().optional(),
  panNo: yup
    .string()
    .optional()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN number"),
  aadharNo: yup
    .string()
    .nullable()
    .matches(/^[0-9]{12}$/, "Invalid Aadhaar No"),
  otherNo: yup.string().optional(),
  otherName: yup.string().optional(),
  accountNo: yup
    .string()
    .nullable()
    .matches(/^\d{9,18}$/, "Invalid Bank Account No"),
  // ifsc: yup.string().nullable().matches(/^[A-Za-z]{4}\d{7}$/, 'Invalid IFSC Code'),
  ifsc: yup.string().nullable(),
  holderName: yup.string().nullable(),
  bankName: yup.string().nullable(),
  upiNumber: yup
    .string()
    .nullable()
    ,


    upi_number : yup.string().nullable(),

});

const CustomerBank = ({
  customerid,
  customerInfo,
}: {
  customerid: any;
  customerInfo: any;
}) => {
  const router = useRouter();
  const [customerBankInfo, setCustomerBankInfo] =
    useState<CustomerBankDetailInterface>(initialBankDetail);
  const [gstinFile, setGstinFile] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
  const [passbookFile, setPassbookFile] = useState<File | null>(null);
  const [upiFile, setUpiFile] = useState<File | null>(null);

  const [aadharImage, setAadharImage] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<string | null>(null);
  const [gstinImage, setGstinImage] = useState<string | null>(null);
  const [otherImage, setOtherImage] = useState<string | null>(null);
  const [passbookImage, setPassBookImage] = useState<string | null>(null);

  const [upiImage, setUpiImage] = useState<string | null>(null);


  const [aadharBackImage, setAadharBackImage] = useState<string | null>(null);
  
  const fetchCustomerBankDetail = async () => {
    await backendGetCustomerInfo(customerid).then((res) => {
      console.log("resresresresresresresres" , res)
      if (!res.isError) {
        console.log( "0-0-0-0-0-0-0-0-" , res.data);
        setCustomerBankInfo(res.data);
        for (const [key, value] of Object.entries(res.data)) {
          if (initialKycData.hasOwnProperty(key)) {
            formik.setFieldValue(key, value);

            console.log("this are the key val;ue" , key, value)
          }
          if (key === "gstinImage" && typeof value === "string") {
            setGstinImage(IMAGE_URL + value);
          }
          if (key === "panImage" && typeof value === "string") {
            setPanImage(IMAGE_URL + value);
          }
          if (key === "aadharFrontImage" && typeof value === "string") {
            setAadharImage(IMAGE_URL + value);
          }
          if (key === "aadharBackImage" && typeof value === "string") {
            setAadharBackImage(IMAGE_URL + value);
          }
          if (key === "otherFrontImage" && typeof value === "string") {
            setOtherImage(IMAGE_URL + value);
          }
          if (key === "passbookImage" && typeof value === "string") {
            setPassBookImage(IMAGE_URL + value);
          }
          if (key === "upiImage" && typeof value === "string") {
            setUpiImage(IMAGE_URL + value);
          }
        }
      }
    });
    // await backendCustomersBankInfo({ customerid: customerid }).then((res) => {
    //     if (res.isError == false) {
    //         setCustomerBankInfo(res.data)
    //         for (const [key, value] of Object.entries(res.data)) {
    //             if (initialKycData.hasOwnProperty(key)) {
    //               formik.setFieldValue(key, value);
    //             }
    //           }
    //     }
    // })
  };
  useEffect(() => {
    if (customerid) {
      fetchCustomerBankDetail();
      formik.setFieldValue("customerid", customerid);
    }
  }, [customerid]);
console.log("customeridcustomerid" , customerid)
  const handelCustomerBankVerified = async () => {
    if (window.confirm("Are you sure to verified this bankinfo?")) {
      await backendCustomersBankVerified({ customerid: customerid }).then(
        (res) => {
          if (res.isError == false) {
            setCustomerBankInfo(res.data);
          }
        }
      );
    }
  };

  const handelCustomerUpiVerified = async () => {
    if (window.confirm("Are you sure to verified this upi?")) {
      await backendCustomersUpiVerified({
        customerid: customerid,
        upiNumber: customerBankInfo.upiNumber,
      }).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };



  const handelCustomerUpiClear = async () => {
    if (window.confirm("Are you sure to clear this upi?")) {
      await backendCustomersClearUpi({ customerid: customerid }).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };

  const handelCustomerBankClear = async () => {
    if (window.confirm("Are you sure to clear this bank info?")) {
      await backendCustomersClearBank({ customerid: customerid }).then(
        (res) => {
          if (res.isError == false) {
            setCustomerBankInfo(res.data);
          }
        }
      );
    }
  };

  const handelCustomerkycVerified = async (iData: any) => {
    if (window.confirm("Are you sure to verified this kyc?")) {
      await backendCustomerkycVerified(iData).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };
  const handelCustomerkycRejected = async (iData: any) => {
    if (window.confirm("Are you sure to reject this kyc?")) {
      await backendCustomerkycRejected(iData).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    console.log("this is a ba;le" ,  name, "0-0-" , value, "0-0-" ,  type , "-0-0-0")
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };
  console.log("hello bro 8888888888888888888888")
// console.log(formik.values , "909090909090909")
  const handleFormSubmit = async () => {
    try {
      formik.setSubmitting(true);
      const formData = new FormData();
      console.log("this is a formdata" , formData)
      const iData = await objectAppendIntoformData(formData, formik.values, "");
      if (aadharFile) {
        await iData.append("aadharimage", aadharFile);
      }
      if (gstinFile) {
        await iData.append("gstinimage", gstinFile);
      }
      if (panFile) {
        await iData.append("panimage", panFile);
      }
      if (otherFile) {
        await iData.append("otherimage", otherFile);
      }
      if (aadharBackFile) {
        await iData.append("aadharBackImage", aadharBackFile);
      }
      if (passbookFile) {
        await iData.append("passbookImage", passbookFile);
      }
      if (upiFile) {
        await iData.append("upiImage", upiFile);
      }
      const formDataObject = Object.fromEntries(iData.entries());
      console.log("Form Data as Object:", formDataObject);
      




      backendCustomerKycUpload(iData)
        .then((result) => {
          if (!result.isError) {
            // router.reload();
            router.push("/customer");
          } else {
          }
        })
        .catch((err) => {});





    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: initialKycData,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });
  return (
    <>
      <Row className="border-top border-top-dashed pt-4 pb-4">
        <Col xl={7} md={7}></Col>
        <Col xl={5} md={5}>
          <Row className="align-items-end card-body">
            <Col xl={12} md={12} className="text-end">
              <Button
                className="btn btn-dark"
                disabled={!formik.isValid}
                onClick={() => {
                  if (formik.isValid) {
                    formik.handleSubmit();
                  } else {
                    console.log("is invalid", !formik.isValid);
                  }
                }}
              >
                <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Upload{" "}
              </Button>
            </Col>
          </Row>
        </Col>
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">GSTIN Image</h4>
          <Col xl={6} sm={6} xs={6}>
            {gstinImage && (
              <Image src={gstinImage} className="width240 rounded img-fluid" />
            )}
            {/* {customerInfo.gstinImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.gstinImage} />} */}
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                <Col>
                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setGstinFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setGstinImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={4} sm={4} xs={4}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="gstinNo">Gstin No</Form.Label>
              <Form.Control
                type="text"
                name="gstinNo"
                onChange={handleInputChange}
                value={formik.values.gstinNo}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="GSTIN No"
              />
              {formik.errors.gstinNo && (
                <div className="text-danger">{formik.errors.gstinNo}</div>
              )}
            </Form.Group>
          </Col>
          {(customerInfo.gstinImage || customerInfo.gstinNo) && (
            <Col xl={2} sm={2} xs={4}>
              <p className="mb-0 f-12">Click To</p>
              <div className="mb-2">
                <Form.Check
                  type="switch"
                  label="Verified"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycVerified({
                        customerid: customerid,
                        verifiedTo: "verified.gstinVerified",
                      });
                    }
                  }}
                  defaultChecked={customerInfo.gstinVerified}
                />
              </div>
              <div className="mb-2">
                <Form.Check
                  className="text-danger"
                  type="switch"
                  label="Reject"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycRejected({
                        customerid: customerid,
                        kycdocs: "gstin",
                      });
                    }
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
        <hr />
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">PAN Image</h4>
          <Col xl={6} sm={6} xs={6}>
            {panImage && (
              <Image src={panImage} className="width240 rounded img-fluid" />
            )}
            {/* {customerInfo.panImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.panImage} />} */}
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                <Col>
                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setPanFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPanImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={4} sm={4} xs={4}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">Pan No</Form.Label>
              <Form.Control
                type="text"
                name="panNo"
                onChange={handleInputChange}
                value={formik.values.panNo}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Pan No"
              />
              {formik.errors.panNo && (
                <div className="text-danger">{formik.errors.panNo}</div>
              )}
            </Form.Group>
          </Col>
          {(customerInfo.panImage || customerInfo.panNo) && (
            <Col xl={2} sm={2} xs={4}>
              <p className="mb-0 f-12">Click To</p>
              <div className="mb-2">
                <Form.Check
                  type="switch"
                  label="Verified"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycVerified({
                        customerid: customerid,
                        verifiedTo: "verified.panVerified",
                      });
                    }
                  }}
                  defaultChecked={customerInfo.panVerified}
                />
              </div>
              <div className="mb-2">
                <Form.Check
                  className="text-danger"
                  type="switch"
                  label="Reject"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycRejected({
                        customerid: customerid,
                        kycdocs: "pan",
                      });
                    }
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
        <hr />
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">Aadhar Image</h4>
          <Col xl={6} sm={6} xs={6}>
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                <Col xl={6} sm={6} xs={6}>
                  {aadharImage && (
                    <Image
                      src={aadharImage}
                      className="width240 rounded img-fluid"
                    />
                  )}
                  {/* {customerInfo.aadharFrontImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.aadharFrontImage} />} */}
                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setAadharFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAadharImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>
                </Col>
                <Col xl={6} sm={6} xs={6}>
                  {aadharBackImage && (
                    <Image
                      src={aadharBackImage}
                      className="width240 rounded img-fluid"
                    />
                  )}
                  {/* {customerInfo.aadharBackImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.aadharBackImage} />} */}
                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setAadharBackFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAadharBackImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={4} sm={4} xs={4}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="FirmName">Aadhar NO</Form.Label>
              <Form.Control
                type="text"
                name="aadharNo"
                onChange={handleInputChange}
                value={formik.values.aadharNo}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Aadhar No"
              />
              {formik.errors.aadharNo && (
                <div className="text-danger">{formik.errors.aadharNo}</div>
              )}
            </Form.Group>
          </Col>
          {(customerInfo.aadharFrontImage || customerInfo.aadharNo) && (
            <Col xl={2} sm={2} xs={4}>
              <p className="mb-0 f-12">Click To</p>
              <div className="mb-2">
                <Form.Check
                  type="switch"
                  label="Verified"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycVerified({
                        customerid: customerid,
                        verifiedTo: "verified.aadharVerified",
                      });
                    }
                  }}
                  defaultChecked={customerInfo.aadharVerified}
                />
              </div>
              <div className="mb-2">
                <Form.Check
                  className="text-danger"
                  type="switch"
                  label="Reject"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycRejected({
                        customerid: customerid,
                        kycdocs: "aadhar",
                      });
                    }
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
        <hr />
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">Other Image</h4>
          <Col xl={6} sm={6} xs={6}>
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                {otherImage && (
                  <Image
                    src={otherImage}
                    className="width240 rounded img-fluid"
                  />
                )}
                {/* {customerInfo.otherFrontImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.otherFrontImage} />} */}
                <button className="dz-button" type="button">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setOtherFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setOtherImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </button>
              </Row>
            </div>
          </Col>
          <Col xl={4} sm={4} xs={4}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="FirmName">Other Doc No</Form.Label>
              <Form.Control
                type="text"
                name="otherNo"
                onChange={handleInputChange}
                value={formik.values.otherNo}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Other Doc No"
              />
              {formik.errors.otherNo && (
                <div className="text-danger">{formik.errors.otherNo}</div>
              )}
            </Form.Group>
          </Col>
          {(customerInfo.otherFrontImage || customerInfo.otherNo) && (
            <Col xl={2} sm={2} xs={4}>
              <p className="mb-0 f-12">Click To</p>
              <div className="mb-2">
                <Form.Check
                  type="switch"
                  label="Verified"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycVerified({
                        customerid: customerid,
                        verifiedTo: "verified.otherVerified",
                      });
                    }
                  }}
                  defaultChecked={customerInfo.otherVerified}
                />
              </div>
              <div className="mb-2">
                <Form.Check
                  className="text-danger"
                  type="switch"
                  label="Reject"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      handelCustomerkycRejected({
                        customerid: customerid,
                        kycdocs: "other",
                      });
                    }
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
        <hr />
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">Passbook / Check Image</h4>
          <Col xl={3} sm={3} xs={6}>
            {passbookImage && (
              <Image
                src={passbookImage}
                className="width240 rounded img-fluid"
              />
            )}
            {/* {customerInfo.panImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.panImage} />} */}
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                <Col>
                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setPassbookFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPassBookImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={3} sm={3} xs={6}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">Account No</Form.Label>
              <Form.Control
                type="text"
                name="accountNo"
                onChange={handleInputChange}
                value={formik.values.accountNo}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Account No"
              />
              {formik.errors.accountNo && (
                <div className="text-danger">{formik.errors.accountNo}</div>
              )}
            </Form.Group>
          </Col>
          <Col xl={3} sm={3} xs={6}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">Account Holder Name</Form.Label>
              <Form.Control
                type="text"
                name="holderName"
                onChange={handleInputChange}
                value={formik.values.holderName}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Account No"
              />
              {formik.errors.holderName && (
                <div className="text-danger">{formik.errors.holderName}</div>
              )}
            </Form.Group>
          </Col>
          <Col xl={3} sm={3} xs={6}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">Bank Name</Form.Label>
              <Form.Control
                type="text"
                name="bankName"
                onChange={handleInputChange}
                value={formik.values.bankName}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Account No"
              />
              {formik.errors.bankName && (
                <div className="text-danger">{formik.errors.bankName}</div>
              )}
            </Form.Group>
          </Col>
          <Col xl={4} sm={4} xs={4}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">Ifsc</Form.Label>
              <Form.Control
                type="text"
                name="ifsc"
                onChange={handleInputChange}
                value={formik.values.ifsc}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder="Ifsc"
              />
              {formik.errors.ifsc && (
                <div className="text-danger">{formik.errors.ifsc}</div>
              )}
            </Form.Group>
          </Col>
          <Col xl={2} sm={2} xs={4}>
            <p className="mb-0 f-12">Click To</p>
            <div className="mb-2">
              <Form.Check
                type="switch"
                label="Verified"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerkycVerified({
                      customerid: customerid,
                      verifiedTo: "verified.bankVerified",
                    });
                  }
                }}
                defaultChecked={customerInfo.bankVerified}
              />
            </div>
            <div className="mb-2">
              <Form.Check
                className="text-danger"
                type="switch"
                label="Reject"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerkycRejected({
                      customerid: customerid,
                      kycdocs: "bank",
                    });
                  }
                }}
              />
            </div>
          </Col>
        </Row>
        <hr />





        
        
        <Row className="align-items-center pt-4 pb-4">
          <h4 className="mb-0 f-18">UPI/ UPI Number Image</h4>
          <Col xl={3} sm={3} xs={6}>
            {upiImage && (
              <Image
                src={upiImage}
                className="width240 rounded img-fluid"
              />
            )}
            {/* {customerInfo.panImage && <Image className='width240 rounded img-fluid' src={IMAGE_URL + customerInfo.panImage} />} */}
            <div className="dropzone dz-clickable">
              <Row className="dz-default dz-message">
                <Col>
                  


                  <button className="dz-button" type="button">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setUpiFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUpiImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>

                
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={3} sm={3} xs={6}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="panNo">UPI Number</Form.Label>
              <Form.Control
                type="text"
                name="upiNumber"
                onChange={handleInputChange}
                value={formik.values.upiNumber}
                onBlur={formik.handleBlur}
                required={true}
                autoComplete="off"
                placeholder=" Enter UPI Number"
              />
              {formik.errors.upiNumber && (
                <div className="text-danger">{formik.errors.upiNumber}</div>
              )}
            </Form.Group>
          </Col>
      
          <Col xl={2} sm={2} xs={4}>
            <p className="mb-0 f-12">Click To</p>
            <div className="mb-2">
              <Form.Check
                type="switch"
                label="Verified"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerkycVerified({
                      customerid: customerid,
                      verifiedTo: "verified.upiVerified",
                    });
                  }
                }}
                defaultChecked={customerInfo?.upiVerified}
              />
            </div>
            <div className="mb-2">
              <Form.Check
                className="text-danger"
                type="switch"
                label="Reject"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerkycRejected({
                      customerid: customerid,
                      kycdocs: "upi",
                    });
                  }
                }}
              />
            </div>
          </Col>
        </Row>



        
        

        {customerBankInfo.accountNo ? (
          <Col xl={12} sm={12} xs={12}>
            <Row className="align-items-start card-body">
              <h3> Bank Account </h3>
              <Col xl={4} sm={4} xs={6}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Account No</p>
                  <span className="text-muted ">
                    {customerBankInfo.accountNo}
                  </span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={6}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Holder Name</p>
                  <span className="text-muted ">
                    {customerBankInfo.holderName}
                  </span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={6}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Bank Name</p>
                  <span className="text-muted ">
                    {customerBankInfo.bankName}
                  </span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={6}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Account Type</p>
                  <span className="text-muted ">
                    {customerBankInfo.accountType}
                  </span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={6}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Ifsc</p>
                  <span className="text-muted ">{customerBankInfo.ifsc}</span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={6}>
                <p className="mb-0 f-12">Click To</p>
                <div className="mb-2">
                  <Form.Check
                    type="switch"
                    label="Verified"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        handelCustomerBankVerified();
                      }
                    }}
                    defaultChecked={customerBankInfo.verified}
                  />
                </div>
                <div className="mb-2">
                  <Form.Check
                    className="text-danger"
                    type="switch"
                    label="Reject"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        handelCustomerBankClear();
                      }
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>
{/*  */}
      {/* <Row className="border-top border-top-dashed pt-4 pb-4">
        {customerBankInfo.upiNumber ? (
          <Col xl={12} sm={12} xs={12}>
            <Row className="align-items-start card-body">
              <h3> Upi </h3>
              <Col xl={8} sm={8} xs={8}>
                <div className="mb-2">
                  <p className="mb-0 f-12">Upi Number</p>
                  <span className=" ">{customerBankInfo.upiNumber}</span>
                </div>
              </Col>
              <Col xl={4} sm={4} xs={4}>
                <p className="mb-0 f-12">Click To</p>
                <div className="mb-2">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    name="custom-switch"
                    label="Verified"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        handelCustomerUpiVerified(
                    );
                      }
                    }}
                    defaultChecked={customerBankInfo.upiVerified}
                  />
                </div>
                <div className="mb-2">
                  <Form.Check
                    className="text-danger"
                    type="switch"
                    name="custom-switch"
                    id="custom-switch"
                    label="Reject"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      if (checked) {
                        handelCustomerUpiClear();
                      }
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row> */}
    </>
  );
};

export default CustomerBank;
