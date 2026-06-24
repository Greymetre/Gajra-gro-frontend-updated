import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  Button,
  Row,
  Col,
  Form,
  Card,
  FormLabel,
  Image,
  Container,
} from "react-bootstrap";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  CustomerProfileViewInterface,
  CreateCustomerInterface,
  initialCustomerData,
} from "../../interfaces/customer.interface";
import {
  backendPostAddNewCustomer,
  backendPatchUpdateCustomer,
  backendGetCustomerInfo,
  backendPostCustomerStatus,
  addremark,
} from "../../helpers/backend_helper";
import MobileWithCode from "../../components/InputFields/MobileWithCode";
import AddressForm from "../../components/Common/AddressForm";
import {
  BLUE_PLUS_CIRCLE_IMAGE,
  CUSTOMER_DEMO_IMAGE,
  IMAGE_URL,
  PROFILE_DEMO_IMAGE,
  RECTANGLE_DEMO_IMAGE,
  WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { objectAppendIntoformData } from "../../utils/utility";
import { Formik, FormikHelpers, useFormik, useFormikContext } from "formik";
import * as yup from "yup";
import SelectCustomerType from "../../components/InputFields/SelectCustomerType";
import SelectRemarkList from "./remark";

import RemarkList from "./remark";

const schema = yup.object().shape({
  firmName: yup.string().min(3).max(100).required("firmName is required"),
  // remarkid: yup.string().required("remark is required"),

  contactPerson: yup
    .string()
    .min(3)
    .max(100)
    .required("Contact person is required"),
  email: yup.string().email().min(3).max(100),
  mobile: yup
    .string()
    .min(10, "Enter valid Mobile No")
    .max(10, "Enter valid Mobile No")
    .required("mobile is required"),
  password: yup.string().min(6).max(20),

  customerType: yup
    .string()
    .min(3)
    .max(50)
    .required("customerType Name is required"),
  address: yup.object({
    state: yup.string().min(3).max(50).required("State is required"),
    city: yup.string().min(3).max(50).required("City is required"),
    postalCode: yup
      .string()
      .min(6, "Enter valid Pincode")
      .max(6, "Enter valid Pincode")
      .required("Pincode is required"),
    address: yup.string().min(1).max(100),
  }),
});
export default function CustomerSave() {
  const router = useRouter();
  const { id } = router.query;

  const fetchCustomerDetail = async () => {
    await backendGetCustomerInfo(id).then((res) => {
      if (!res.isError) {
        const { data } = res;
        Object.keys(data).forEach(async (key) => {
          if (["address", "city", "state", "postalCode"].includes(key)) {
            formik.setFieldValue(`address.${key}`, data[key]);
          } else if (key in initialCustomerData) {
            formik.setFieldValue(key, data[key]);
          }
        });
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchCustomerDetail();
    }
  }, [id]);
  const [requestData, setRequestData] =
    useState<CreateCustomerInterface>(initialCustomerData);
  const [shopImageFile, setShopImageFile] = useState<File | undefined>(
    undefined
  );
  const [remarkid, setremarkId] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };

  const callback = async (resp: any) => {
    if (resp.id) {
    }
  };

  const handleFormSubmit = async () => {
    console.log("dee");

    try {
      formik.setSubmitting(true);
      const formData = new FormData();

      const iData = await objectAppendIntoformData(formData, formik.values, "");

      await iData.append("shopimage", shopImageFile);
      await iData.append("avatar", avatarFile);

      [
        "_id",
        "visitingCard",
        "beatid",
        "beatName",
        "active",
        "createdAt",
        "createdBy",
      ].forEach((e) => iData.delete(e));
      if (!iData.email) {
        iData.delete("email");
      }
      var actionSubmit = (await formik.values._id)
        ? backendPatchUpdateCustomer(formik.values._id, iData)
        : backendPostAddNewCustomer(iData);
      actionSubmit
        .then((result) => {
          if (!result.isError) {
            alert("done");
            router.push("/customer");
          } else {
          }
        })
        .catch((err) => {
          console.log(err, "Error ");
        });
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: initialCustomerData,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });
  console.log("dd", formik.values.email);
  // console.log("remakr", formik.values.remarkid);

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/customer", label: "CustomerList" }}
        itemlabel="Customer List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6} className="mb-3">
              <h3 className="card-body mb-0">
                {id ? "Edit" : "Add"} Customer Profile
              </h3>
            </Col>
            <Col md={6} className="text-end mb-3">
              <Card.Body>
                <div className="form-group d-flex align-items-center justify-content-end mb-0">
                  <Form.Group>
                    <Form.Label className="d-block m-r-10"></Form.Label>
                    <div className="form-check form-switch custom-control-inline">
                      <Form.Check
                        inline
                        name="active"
                        type="checkbox"
                        onChange={(e) => {
                          setRequestData({
                            ...requestData,
                            active: e.target.checked,
                          });
                        }}
                        defaultChecked={
                          requestData.active ? requestData.active : false
                        }
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
            <Card className="flat-card">
              <Form>
                <Row>
                  <Col xl={7} md={7}>
                    <Row className="align-items-center card-body">
                      <Col xl={6} md={6}>
                        <div className="position-relative d-inline-block">
                          <div className="avatar-upload">
                            <div className="avatar-edit">
                              <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>
                                  <Image
                                    src={IMAGE_URL + BLUE_PLUS_CIRCLE_IMAGE}
                                  />
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="avatar"
                                  accept="image/*"
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setAvatarFile(event?.target?.files?.[0]!);
                                  }}
                                  required={true}
                                />
                              </Form.Group>
                            </div>
                            <div className="avatar-preview">
                              <Image
                                className="width120  "
                                src={
                                  requestData.avatar
                                    ? IMAGE_URL + requestData.avatar
                                    : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                                }
                                style={{ borderRadius: "100%" }}
                              />

                              {/* <Image  className='width120' src={(requestData.avatar) ? IMAGE_URL + requestData.avatar : IMAGE_URL + RECTANGLE_DEMO_IMAGE} style={{ borderRadius: "100%" }} /> */}
                            </div>
                            <Form.Label htmlFor="FirmName">
                              Profile Image
                            </Form.Label>
                          </div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} className="justify-content-md-center">
                        <div className="position-relative d-inline-block">
                          <div className="avatar-upload">
                            <div className="avatar-edit">
                              <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>
                                  <Image
                                    src={IMAGE_URL + BLUE_PLUS_CIRCLE_IMAGE}
                                  />
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="shopimage"
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setShopImageFile(
                                      event?.target?.files?.[0]!
                                    );
                                  }}
                                  required={true}
                                />
                              </Form.Group>
                            </div>
                            <div className="avatar-preview">
                              <Image
                                className="width120  "
                                src={
                                  requestData.shopimage
                                    ? IMAGE_URL + requestData.shopimage
                                    : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                                }
                                style={{ borderRadius: "100%" }}
                              />
                            </div>
                            <Form.Label>Shop Image</Form.Label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
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
                          <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Save{" "}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Row className="p-4">
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="FirmName">Firm Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firmName"
                          onChange={handleInputChange}
                          value={formik.values.firmName}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Firm Name"
                        />
                        {formik.errors.firmName && (
                          <div className="text-danger">
                            {formik.errors.firmName}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ContactPerson">
                          Contact Person
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="contactPerson"
                          onChange={handleInputChange}
                          value={formik.values.contactPerson}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Contact Person"
                        />
                        {formik.errors.contactPerson && (
                          <div className="text-danger">
                            {formik.errors.contactPerson}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Email">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          onChange={handleInputChange}
                          value={formik.values.email}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Enter Email"
                        />
                        {formik.errors.email && (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <MobileWithCode
                        handleInputChange={handleInputChange}
                        mobile={formik.values.mobile}
                      />
                      {formik.errors.mobile && (
                        <div className="text-danger">
                          {formik.errors.mobile}
                        </div>
                      )}
                    </Col>

                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Contactperson">
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          onChange={handleInputChange}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="******"
                        />
                        {formik.errors.password && (
                          <div className="text-danger">
                            {formik.errors.password}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <SelectCustomerType
                        key="CusrtomerType"
                        handleInputChange={handleInputChange}
                        customerType={formik.values.customerType}
                      />
                      {formik.errors.customerType && (
                        <div className="text-danger">
                          {formik.errors.customerType}
                        </div>
                      )}
                    </Col>
                    <AddressForm
                      key={"AddressForm"}
                      handleInputChange={handleInputChange}
                      requestData={formik.values}
                      errors={formik.errors.address}
                    />
                    {/*   <Col md={4} sm={6} xs={12}>
                       <RemarkList
                        handleInputChange={handleInputRemark}
                        _id={formik.values.remarkid}
                      /> 
                      <Form.Group className="mb-1">
                        {!isLoading && (
                          <div className="col-md-4 col-sm-6 col-xs-12">
                            <Form.Label htmlFor="Customer">Remark</Form.Label>
                            <select
                              name="_id"
                              value={selectedItemId}
                              onChange={(e) =>
                                handleInputChange({
                                  target: {
                                    name: "_id",
                                    value: e.target.value,
                                    type: "select",
                                  },
                                })
                              }
                            >
                              <option value="">Select Remark</option>
                              {options.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.remark}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </Form.Group>
                    </Col>*/}
                  </Row>
                </Row>
              </Form>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
