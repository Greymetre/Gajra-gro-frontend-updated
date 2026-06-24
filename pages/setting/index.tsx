import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Card,
  FormLabel,
  Image,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  initialSettingData,
  SettingInterface,
} from "../../interfaces/setting.interface";
import { settingFormValidation } from "../../validations/setting.validation";
import {
  addremark,
  backendGetSetting,
  backendPostAddsetting,
  backendRemoveBanerImage,
  backendUploadBannerImages,
  backendGetYoutubeShorts,
  backendUpdateYoutubeShorts,
} from "../../helpers/backend_helper";
import {
  BLACK_PLUS_CIRCLE_IMAGE,
  BLUE_PLUS_CIRCLE_IMAGE,
  CUSTOMER_DEMO_IMAGE,
  IMAGE_URL,
  PROFILE_DEMO_IMAGE,
  RECTANGLE_DEMO_IMAGE,
  WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { objectAppendIntoformData } from "../../utils/utility";
import {
  Formik,
  Field,
  FormikHelpers,
  FieldArray,
  ErrorMessage,
  useFormik,
  useFormikContext,
} from "formik";
import * as yup from "yup";
import Redemption from "../redemption";
import { PlusCircleFill, XCircleFill, Upload } from "react-bootstrap-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";


export default function Setting() {
  // const [data, setData] = useState({ remark: "" });
  const [remark, setData] = useState("");

  const router = useRouter();
  const { id } = router.query;

  const Remarksubmit = async () => {
    var iData = JSON.parse(JSON.stringify({ remark }));

    try {
      addremark(iData).then(async (response) => {
        console.warn("result", response);
        Router.push("/customer");
      });
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const [imageFile, setImageFile] = useState<File | undefined>();

   const [fileName, setFileName] = useState<string | null>(null);  // Store the file name

  const permissionData = useSelector(
    (state: any) => state?.permission?.permission
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "setting.read":
          return { ...acc, canRead: true };
        case "setting.update":
          return { ...acc, canUpdate: true };
        default:
          return acc;
      }
    }, {});
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };
  const handleFormSubmit = async () => {
    try {
      backendPostAddsetting(formik.values).then(async (response: any) => {
        if (!response.isError) {
          Router.push("/setting");
        }
      });
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const handleDeleteBanerImage = async (image: string) => {
    try {
      if (window.confirm("Are you sure to remove this image?")) {
        backendRemoveBanerImage({ image: image }).then(
          async (response) => {
            if (!response.isError) {
              Router.push("/setting");
            }
          },
          (error) => {}
        );
      }
    } catch (e) {
      console.log(e, "Error in this image");
    }
  };

  const uploadBanerImage = async () => {
    try {
      const formData = new FormData();
      if (imageFile) {
        await formData.append("image", imageFile);
        backendUploadBannerImages(formData).then(
          async (response) => {
            if (!response.isError) {
              Router.push("/setting");
            }
          },
          (error) => {}
        );
      }
    } catch (e) {
      console.log(e, "Error in this image");
    }
  };

  const formik = useFormik({
    initialValues: initialSettingData,
    validationSchema: settingFormValidation,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });
  const settings = useSelector((state: any) => state?.setting?.setting);

  const dispatch = useDispatch();
  const fetchSetting = async () => {
    await backendGetSetting().then((res) => {
      if (res.isError == false && res.data) {
        formik.setValues(res.data);
        console.log(res.data , "res.data")
      }
    });
  };
  useEffect(() => {
    fetchSetting();
  }, []);
  // const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newdata = { ...data };
  //   newdata[e.target.id] = e.target.value;
  //   setData(newdata);
  // };
  const handleRemarkChange = (e: any) => {
    setData(e.target.value);
  };

  useEffect(() => {
    getYoutubeShorts();
  }, []);

  const youtubeFormik : any = useFormik({
    initialValues: {
      youtubeShorts: [""],
    },

    onSubmit: async (values) => {
      try {
        const response = await backendUpdateYoutubeShorts({
          youtubeShorts: values.youtubeShorts,
        });

        console.log(response);

        if (!response.isError) {
          alert("Youtube Shorts Updated Successfully");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getYoutubeShorts = async () => {
    try {
      const response = await backendGetYoutubeShorts();

      console.log(response);

      youtubeFormik.setFieldValue(
        "youtubeShorts",
        response?.data?.youtubeShorts?.length
          ? response.data.youtubeShorts
          : [""]
      );
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/setting", label: "Setting" }}
        itemlabel="Setting"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6} className="mb-3">
              <h3 className="card-body mb-0"> Setting</h3>
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
                                  <PlusCircleFill size={24} color="gray"  
                                  style={{ cursor:"pointer" }}
                                   data-tooltip-id="selectImage"
                                  
                                  />
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="image"
                                  accept="image/*"
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setImageFile(event?.target?.files?.[0]!);
                                    
                                  }}
                                  required={true}
                                />
                              </Form.Group>
                              <ReactTooltip
                                id="selectImage"
                                place="right"
                                content="Select Image"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <Upload
                            size={24}
                            color="grey"
                            style={{ cursor:"pointer" }}
                                   data-tooltip-id="uploadImage"
                            onClick={() => uploadBanerImage()}
                          />
                        </div>
                        <ReactTooltip
                                id="uploadImage"
                                place="right"
                                content="Click to upload images"
                              />
                      </Col>
                    </Row>
                  </Col>
                  <Col className="text-end mt-3">
                    {moduleAccess?.canUpdate ? (
                      <Button
                        className="btn btn-sm btn-dark"
                        disabled={!formik.isValid}
                        onClick={() => {
                          if (formik.isValid) {
                            formik.handleSubmit();
                          } else {
                            console.log("is invalid", !formik.isValid);
                          }
                        }}
                      >
                        {" "}
                        <Image
                          src={IMAGE_URL + WHITE_CHECKED_IMAGE}
                        /> Save{" "}
                      </Button>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  {Array.isArray(formik.values.banner) &&
                    formik.values.banner.map((item, index) => {
                      return (
                        <Col xl={6} sm={6} xs={12} key={index}>
                          <div className="thumbnail mb-4">
                            <Image
                              className="img-fluid img-thumbnail"
                              src={
                                item
                                  ? IMAGE_URL + item
                                  : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                              }
                              // style={{ borderRadius: "100%" }}
                            />
                             {/* <Image
                              className="img-fluid img-thumbnail"
                              src={resizedImage
                              }
                              // style={{ borderRadius: "100%" }}
                            /> */}
                            <XCircleFill
                              size={24}
                              color="red"
                              onClick={() => handleDeleteBanerImage(item)}
                            />
                          </div>
                        </Col>
                      );
                    })}
                </Row>
                <Container>
                  <Row>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="customerType">
                          Customer Type
                        </Form.Label>
                        {Array.isArray(formik.values.customerType) &&
                          formik.values.customerType.map((item, index) => {
                            return (
                              <>
                                <InputGroup className="mb-3">
                                  <Form.Control
                                    type="text"
                                    name="customerType"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `customerType[${index}]`,
                                        e.target.value
                                      );
                                    }}
                                    value={item}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Enter Customer Type"
                                  />
                                  <InputGroup.Text
                                    onClick={async () => {
                                      const customer_types = await JSON.parse(
                                        JSON.stringify(
                                          formik.values.customerType
                                        )
                                      );
                                      const types = await customer_types.filter(
                                        (e: string) => e !== item
                                      );
                                      formik.setFieldValue(
                                        "customerType",
                                        types
                                      );
                                    }}
                                    className="bg-danger text-white"
                                  >
                                    x
                                  </InputGroup.Text>
                                </InputGroup>
                              </>
                            );
                          })}

                        <button
                          type="button"
                          onClick={() => {
                            const customer_types = JSON.parse(
                              JSON.stringify(formik.values.customerType)
                            );
                            customer_types.push("");
                            formik.setFieldValue(
                              "customerType",
                              customer_types
                            );
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col>
                    {/* <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="roles">
                          Roles
                        </Form.Label>
                        {Array.isArray(formik.values.roles) &&
                          formik.values.roles.map((item, index) => {
                            return (
                              <>
                                <InputGroup className="mb-3">
                                  <Form.Control
                                    type="text"
                                    name="roles"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `roles[${index}]`,
                                        e.target.value
                                      );
                                    }}
                                    value={item}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Enter Roles"
                                  />
                                  <InputGroup.Text
                                    onClick={async () => {
                                      const roles = await JSON.parse(
                                        JSON.stringify(
                                          formik.values.roles
                                        )
                                      );
                                      const types = await roles.filter(
                                        (e: string) => e !== item
                                      );
                                      formik.setFieldValue(
                                        "roles",
                                        types
                                      );
                                    }}
                                    className="bg-danger text-white"
                                  >
                                    x
                                  </InputGroup.Text>
                                </InputGroup>
                              </>
                            );
                          })}
                        <button
                          type="button"
                          onClick={() => {
                            const roles = JSON.parse(
                              JSON.stringify(formik.values.roles)
                            );
                            roles.push("");
                            formik.setFieldValue(
                              "roles",
                              roles
                            );
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col> */}
                  </Row>
                  <Row className="pt-4">
                    <hr />
                    <h4 className="text-center">Loyaltyscheme</h4>
                    <Row className="pt-4">
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Coupon Based{" "}
                          </Form.Label>
                          <Col sm={2}>
                            <Form.Check
                              inline
                              className="form-check form-switch custom-control-inline"
                              name="coupon_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[coupon_based]",
                                  !formik.values.loyaltyscheme.coupon_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.coupon_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Sales Based
                          </Form.Label>
                          <Col sm={2}>
                            <Form.Check
                              inline
                              className="form-check form-switch custom-control-inline"
                              name="sales_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[sales_based]",
                                  !formik.values.loyaltyscheme.sales_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.sales_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            CustomerType Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="customerType_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[customerType_based]",
                                  !formik.values.loyaltyscheme
                                    .customerType_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.customerType_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Scheme Start Alert
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="scheme_start_alert"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[scheme_start_alert]",
                                  !formik.values.loyaltyscheme
                                    .scheme_start_alert
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.scheme_start_alert
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            States Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="states_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[states_based]",
                                  !formik.values.loyaltyscheme.states_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.states_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            City Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="city_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[city_based]",
                                  !formik.values.loyaltyscheme.city_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.city_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Customer Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="customer_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[customer_based]",
                                  !formik.values.loyaltyscheme.customer_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.customer_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Category Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="category_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[category_based]",
                                  !formik.values.loyaltyscheme.category_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.category_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Subcategory Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="subcategory_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[subcategory_based]",
                                  !formik.values.loyaltyscheme.subcategory_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.subcategory_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Product Based
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="product_based"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "loyaltyscheme[product_based]",
                                  !formik.values.loyaltyscheme.product_based
                                );
                              }}
                              defaultChecked={
                                formik.values.loyaltyscheme.product_based
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label htmlFor="scheme_based">
                            Scheme Based On
                          </Form.Label>
                          {Array.isArray(
                            formik.values.loyaltyscheme.scheme_based
                          ) &&
                            formik.values.loyaltyscheme.scheme_based.map(
                              (item, index) => {
                                return (
                                  <>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        type="text"
                                        name="scheme_based"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `loyaltyscheme[scheme_based][${index}]`,
                                            e.target.value
                                          );
                                        }}
                                        value={item}
                                        required={true}
                                        autoComplete="off"
                                        placeholder="Enter Scheme Based"
                                      />
                                      <InputGroup.Text
                                        onClick={async () => {
                                          const schemetypes = await JSON.parse(
                                            JSON.stringify(
                                              formik.values.loyaltyscheme
                                                .scheme_based
                                            )
                                          );
                                          const types =
                                            await schemetypes.filter(
                                              (e: string) => e !== item
                                            );
                                          formik.setFieldValue(
                                            "loyaltyscheme[scheme_based]",
                                            types
                                          );
                                        }}
                                        className="bg-danger text-white"
                                      >
                                        x
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </>
                                );
                              }
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const schemetypes = Array.isArray(
                                formik.values.loyaltyscheme.scheme_based
                              )
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.loyaltyscheme.scheme_based
                                    )
                                  )
                                : [];
                              schemetypes.push("");
                              formik.setFieldValue(
                                "loyaltyscheme[scheme_based]",
                                schemetypes
                              );
                            }}
                          >
                            +
                          </button>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label htmlFor="scheme_types">
                            Scheme Type
                          </Form.Label>
                          {Array.isArray(
                            formik.values.loyaltyscheme.scheme_types
                          ) &&
                            formik.values.loyaltyscheme.scheme_types.map(
                              (item, index) => {
                                return (
                                  <>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        type="text"
                                        name="customerType"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `loyaltyscheme[scheme_types][${index}]`,
                                            e.target.value
                                          );
                                        }}
                                        value={item}
                                        required={true}
                                        autoComplete="off"
                                        placeholder="Enter Scheme Type"
                                      />
                                      <InputGroup.Text
                                        onClick={async () => {
                                          const schemetypes = await JSON.parse(
                                            JSON.stringify(
                                              formik.values.loyaltyscheme
                                                .scheme_types
                                            )
                                          );
                                          const types =
                                            await schemetypes.filter(
                                              (e: string) => e !== item
                                            );
                                          formik.setFieldValue(
                                            "loyaltyscheme[scheme_types]",
                                            types
                                          );
                                        }}
                                        className="bg-danger text-white"
                                      >
                                        x
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </>
                                );
                              }
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const schemetypes = Array.isArray(
                                formik.values.loyaltyscheme.scheme_types
                              )
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.loyaltyscheme.scheme_types
                                    )
                                  )
                                : [];
                              schemetypes.push("");
                              formik.setFieldValue(
                                "loyaltyscheme[scheme_types]",
                                schemetypes
                              );
                            }}
                          >
                            +
                          </button>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <Col md={4} sm={6} xs={12}>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="startedAt">
                            Scheme Start Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="loyaltyscheme.startedAt"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.loyaltyscheme.startedAt}
                            required={true}
                            autoComplete="off"
                            placeholder="Enter Start Date"
                          />
                          {/* {formik.errors.loyaltyscheme.startedAt && (
                          <div className="text-danger">{formik.errors..loyaltyscheme.startedAt}</div>
                        )} */}
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={6} xs={12}>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="endedAt">
                            {" "}
                            Valid End Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="loyaltyscheme.endedAt"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.loyaltyscheme.endedAt}
                            required={true}
                            autoComplete="off"
                            placeholder="Enter End Date"
                          />
                          {/* {formik.errors.endedAt && (
                          <div className="text-danger">{formik.errors.endedAt}</div>
                        )} */}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Row>
                  <Row className="pt-4">
                    <hr />
                    <h4 className="text-center">Redemption</h4>
                    <Row className="pt-4">
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Every Threshold
                          </Form.Label>
                          <Col sm={2}>
                            <Form.Check
                              inline
                              className="form-check form-switch custom-control-inline"
                              name="every_threshold"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "redemption[every_threshold]",
                                  !formik.values.redemption.every_threshold
                                );
                              }}
                              defaultChecked={
                                formik.values.redemption.every_threshold
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Only First Threshold
                          </Form.Label>
                          <Col sm={2}>
                            <Form.Check
                              inline
                              className="form-check form-switch custom-control-inline"
                              name="first_threshold"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "redemption[first_threshold]",
                                  !formik.values.redemption.first_threshold
                                );
                              }}
                              defaultChecked={
                                formik.values.redemption.first_threshold
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Milestone Points
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="milestone_points"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "redemption[milestone_points]",
                                  !formik.values.redemption.milestone_points
                                );
                              }}
                              defaultChecked={
                                formik.values.redemption.milestone_points
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Automated
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="automated"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "redemption[automated]",
                                  !formik.values.redemption.automated
                                );
                              }}
                              defaultChecked={
                                formik.values.redemption.automated
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={6} className="d-block m-r-10">
                            Approval
                          </Form.Label>
                          <Col sm={3}>
                            <Form.Check
                              className="form-check form-switch custom-control-inline"
                              inline
                              name="approval"
                              type="checkbox"
                              onClick={(e) => {
                                formik.setFieldValue(
                                  "redemption[approval]",
                                  !formik.values.redemption.approval
                                );
                              }}
                              defaultChecked={formik.values.redemption.approval}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <Col md={4} sm={6} xs={12}>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="threshold">
                            Threshold Point
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="redemption.threshold"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.redemption.threshold}
                            required={true}
                            autoComplete="off"
                            placeholder="Enter Threshold Point"
                          />
                          {/* {formik.errors.loyaltyscheme.startedAt && (
                          <div className="text-danger">{formik.errors..loyaltyscheme.startedAt}</div>
                        )} */}
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={6} xs={12}>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="startedAt">
                            Start Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="redemption.startedAt"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.redemption.startedAt}
                            required={true}
                            autoComplete="off"
                            placeholder="Enter Start Date"
                          />
                          {/* {formik.errors.loyaltyscheme.startedAt && (
                          <div className="text-danger">{formik.errors..loyaltyscheme.startedAt}</div>
                        )} */}
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={6} xs={12}>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="endedAt">
                            {" "}
                            Valid End Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="redemption.endedAt"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.redemption.endedAt}
                            required={true}
                            autoComplete="off"
                            placeholder="Enter End Date"
                          />
                          {/* {formik.errors.endedAt && (
                          <div className="text-danger">{formik.errors.endedAt}</div>
                        )} */}
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label htmlFor="redeem_types">
                            Redeem Types
                          </Form.Label>
                          {Array.isArray(
                            formik.values.redemption.redeem_types
                          ) &&
                            formik.values.redemption.redeem_types.map(
                              (item, index) => {
                                return (
                                  <>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        type="text"
                                        name="customerType"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `redemption[redeem_types][${index}]`,
                                            e.target.value
                                          );
                                        }}
                                        value={item}
                                        required={true}
                                        autoComplete="off"
                                        placeholder="Enter Redeem Types"
                                      />
                                      <InputGroup.Text
                                        onClick={async () => {
                                          const schemetypes = await JSON.parse(
                                            JSON.stringify(
                                              formik.values.redemption
                                                .redeem_types
                                            )
                                          );
                                          const types =
                                            await schemetypes.filter(
                                              (e: string) => e !== item
                                            );
                                          formik.setFieldValue(
                                            "loyaltyscheme[redeem_types]",
                                            types
                                          );
                                        }}
                                        className="bg-danger text-white"
                                      >
                                        x
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </>
                                );
                              }
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const schemetypes = Array.isArray(
                                formik.values.redemption.redeem_types
                              )
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.redemption.redeem_types
                                    )
                                  )
                                : [];
                              schemetypes.push("");
                              formik.setFieldValue(
                                "redemption[redeem_types]",
                                schemetypes
                              );
                            }}
                          >
                            +
                          </button>
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Form.Group>
                          <Form.Label htmlFor="reject_reason">
                            Reject Reason
                          </Form.Label>
                          {Array.isArray(
                            formik.values.redemption.reject_reason
                          ) &&
                            formik.values.redemption.reject_reason.map(
                              (item, index) => {
                                return (
                                  <>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        type="text"
                                        name="reject_reason"
                                        onChange={(e) => {
                                          formik.setFieldValue(
                                            `redemption[reject_reason][${index}]`,
                                            e.target.value
                                          );
                                        }}
                                        value={item}
                                        required={true}
                                        autoComplete="off"
                                        placeholder="Enter Reject Reason"
                                      />
                                      <InputGroup.Text
                                        onClick={async () => {
                                          const schemetypes = await JSON.parse(
                                            JSON.stringify(
                                              formik.values.redemption
                                                .reject_reason
                                            )
                                          );
                                          const types =
                                            await schemetypes.filter(
                                              (e: string) => e !== item
                                            );
                                          formik.setFieldValue(
                                            "loyaltyscheme[reject_reason]",
                                            types
                                          );
                                        }}
                                        className="bg-danger text-white"
                                      >
                                        x
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </>
                                );
                              }
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const schemetypes =
                                Array.isArray(
                                  formik.values.redemption.reject_reason
                                ) &&
                                formik.values.redemption.reject_reason.length
                                  ? JSON.parse(
                                      JSON.stringify(
                                        formik.values.redemption.reject_reason
                                      )
                                    )
                                  : [];
                              schemetypes.push("");
                              formik.setFieldValue(
                                "redemption[reject_reason]",
                                schemetypes
                              );
                            }}
                          >
                            +
                          </button>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <hr />
                      <h4 className="text-center">Login</h4>
                      <Row className="pt-4">
                        <Col sm={4}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={6}
                              className="d-block m-r-10"
                            >
                              Image in Background
                            </Form.Label>
                            <Col sm={2}>
                              <Form.Check
                                inline
                                className="form-check form-switch custom-control-inline"
                                name="background"
                                type="checkbox"
                                onClick={(e) => {
                                  formik.setFieldValue(
                                    "login[background]",
                                    !formik.values.login.background
                                  );
                                }}
                                defaultChecked={formik.values.login.background}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={6}
                              className="d-block m-r-10"
                            >
                              Login With Password
                            </Form.Label>
                            <Col sm={2}>
                              <Form.Check
                                inline
                                className="form-check form-switch custom-control-inline"
                                name="login_with_password"
                                type="checkbox"
                                onClick={(e) => {
                                  formik.setFieldValue(
                                    "login[login_with_password]",
                                    !formik.values.login.login_with_password
                                  );
                                }}
                                defaultChecked={
                                  formik.values.login.login_with_password
                                }
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={6}
                              className="d-block m-r-10"
                            >
                              Login With Otp
                            </Form.Label>
                            <Col sm={3}>
                              <Form.Check
                                className="form-check form-switch custom-control-inline"
                                inline
                                name="login_with_otp"
                                type="checkbox"
                                onClick={(e) => {
                                  formik.setFieldValue(
                                    "login[login_with_otp]",
                                    !formik.values.login.login_with_otp
                                  );
                                }}
                                defaultChecked={
                                  formik.values.login.login_with_otp
                                }
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={6}
                              className="d-block m-r-10"
                            >
                              Verified Check
                            </Form.Label>
                            <Col sm={3}>
                              <Form.Check
                                className="form-check form-switch custom-control-inline"
                                inline
                                name="verified_check"
                                type="checkbox"
                                onClick={(e) => {
                                  formik.setFieldValue(
                                    "login[verified_check]",
                                    !formik.values.login.verified_check
                                  );
                                }}
                                defaultChecked={
                                  formik.values.login.verified_check
                                }
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
                    <Row className="pt-4">
                      <hr />
                      <h4 className="text-center">Points</h4>
                      <Row className="pt-4">
                        <Col sm={6}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={4} htmlFor="FirmName">
                              Point_Value
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="number"
                                onChange={handleInputChange}
                                name="points.point_value" // correct name
                                value={formik.values.points.point_value}
                                required={true}
                                autoComplete="off"
                                placeholder="name"
                              />
                            </Col>
                            {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group as={Row} className="form-group">
                            <Form.Label column sm={4} htmlFor="FirmName">
                              Welcome
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="number"
                                onChange={handleInputChange}
                                name="points.welcome" // correct name
                                value={formik.values.points.welcome}
                                required={true}
                                autoComplete="off"
                                placeholder=" welcome"
                              />
                            </Col>
                            {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>

                   <div >
  <Row>
    <Row className="m-25" style={{ textAlign: "center" }}>
      <h4>Reel Links</h4>
    </Row>

    <Col sm={12}>
      <Form.Group>
        <Form.Label>Reel / Video Links (Max 5)</Form.Label>

        {Array.isArray(youtubeFormik.values.youtubeShorts) &&
          youtubeFormik.values.youtubeShorts.map((link : any, index: number) => (
            <InputGroup className="mb-3" key={index}>
              <Form.Control
                type="url"
                placeholder="Enter Reel / Video URL"
                value={link}
                onChange={(e) => {
                  youtubeFormik.setFieldValue(
                    `youtubeShorts[${index}]`,
                    e.target.value
                  );
                }}
              />

              <InputGroup.Text
                onClick={() => {
                  const updatedLinks =
                    youtubeFormik.values.youtubeShorts.filter(
                      (_ : any, i : number) => i !== index
                    );

                  youtubeFormik.setFieldValue(
                    "youtubeShorts",
                    updatedLinks
                  );
                }}
                className="bg-danger text-white"
                style={{ cursor: "pointer" }}
              >
                ×
              </InputGroup.Text>
            </InputGroup>
          ))}

        {youtubeFormik.values.youtubeShorts.length < 5 && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              youtubeFormik.setFieldValue(
                "youtubeShorts",
                [
                  ...youtubeFormik.values.youtubeShorts,
                  "",
                ]
              );
            }}
          >
            + Add Reel Link
          </button>
        )}

        {youtubeFormik.values.youtubeShorts.length >= 5 && (
          <small className="text-muted">
            Maximum 5 reel links allowed.
          </small>
        )}
      </Form.Group>
    </Col>

    <Col sm={12} className="mt-3">
          <Button
      type="button"
      variant="primary"
      onClick={youtubeFormik.handleSubmit}
    >
      Save Reel Links
    </Button>
    </Col>
  </Row>
</div>
                    <Row className="pt-4">
                      <hr />
                      <h4 className="text-center">Mobile App</h4>
                      <Row className="pt-4">
                        <Col md={4} sm={6} xs={12}>
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="threshold">
                              Loyalty App Version
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="mobileapp.loyalty_version"
                              onChange={handleInputChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.mobileapp?.loyalty_version}
                              required={true}
                              autoComplete="off"
                              placeholder="Enter Loyalty App Version"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="threshold">
                              Sales App Version
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="mobileapp.sales_version"
                              onChange={handleInputChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.mobileapp?.sales_version}
                              required={true}
                              autoComplete="off"
                              placeholder="Enter Sales App Version"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="threshold">
                              Sales Distributor Version
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="mobileapp.distributor_version"
                              onChange={handleInputChange}
                              onBlur={formik.handleBlur}
                              value={
                                formik.values.mobileapp?.distributor_version
                              }
                              required={true}
                              autoComplete="off"
                              placeholder="Enter Distributor App Version"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
                  </Row>

                  <Row>
                    <Row className="m-25" style={{ textAlign: "center" }}>
                      <h4>Helpdesk</h4>
                    </Row>
                    <Row>
                      {" "}
                      <Col>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="FirmName">Phone</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={handleInputChange}
                            name="helpdesk.phone" // correct name
                            value={formik.values.helpdesk.phone}
                            required={true}
                            autoComplete="off"
                            placeholder="mobile"
                          />
                          {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="FirmName">Whatsapp</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={handleInputChange}
                            name="helpdesk.whatsapp" // correct name
                            value={formik.values.helpdesk.whatsapp}
                            required={true}
                            autoComplete="off"
                            placeholder=" Whatsapp"
                          />
                        </Form.Group>
                        {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                      </Col>
                      <Col>
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="FirmName">Email</Form.Label>
                          <Form.Control
                            type="email"
                            onChange={handleInputChange}
                            name="helpdesk.email" // correct name
                            value={formik.values.helpdesk.email}
                            required={true}
                            autoComplete="off"
                            placeholder="Email"
                          />
                        </Form.Group>
                        {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                      </Col>
                      <Row>
                        {" "}
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Address
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="helpdesk.address" // correct name
                              value={formik.values.helpdesk.address}
                              required={true}
                              autoComplete="off"
                              placeholder="Enter Address"
                            />
                          </Col>
                          {/* {formik.errors.name && (
                                                    <div className="text-danger">{formik.errors.name }</div>
                                                  )} */}
                        </Form.Group>
                      </Row>
                    </Row>{" "}
                  </Row>

                  <Row>
                    <Row className="m-25" style={{ textAlign: "center" }}>
                      {" "}
                      <h4>Socialmedia </h4>
                    </Row>
                    <Col>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Facebook
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="socialmedia.facebook" // correct name
                              value={formik.values.socialmedia.facebook}
                              required={true}
                              autoComplete="off"
                              placeholder="Facebook"
                            />
                          </Col>
                          {/* {formik.errors.name && (
                                                    <div className="text-danger">{formik.errors.name }</div>
                                                  )} */}
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Youtube
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="socialmedia.youtube" // correct name
                              value={formik.values.socialmedia.youtube}
                              required={true}
                              autoComplete="off"
                              placeholder="youtube"
                            />
                          </Col>
                          {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Instagram
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="socialmedia.instagram" // correct name
                              value={formik.values.socialmedia.instagram}
                              required={true}
                              autoComplete="off"
                              placeholder="Instagram"
                            />
                          </Col>
                          {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Linkedin{" "}
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="socialmedia.linkedin" // correct name
                              value={formik.values.socialmedia.linkedin}
                              required={true}
                              autoComplete="off"
                              placeholder="linkedin "
                            />
                          </Col>
                          {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Twitter{" "}
                          </Form.Label>
                          <Col sm={10}>
                            {" "}
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="socialmedia.twitter" // correct name
                              value={formik.values.socialmedia.twitter}
                              required={true}
                              autoComplete="off"
                              placeholder="twitter "
                            />
                          </Col>
                          {/* {formik.errors.name && (
      <div className="text-danger">{formik.errors.name }</div>
    )} */}
                        </Form.Group>
                      </Row>
                    </Col>{" "}
                  </Row>

                  <Row>
                    <Row className="m-25" style={{ textAlign: "center" }}>
                      {" "}
                      <h4>Catalogue </h4>
                    </Row>
                    <Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label htmlFor="FirmName" column sm={2}>
                            Privacy
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="catalogue.privacy" // correct name
                              value={formik.values.catalogue.privacy}
                              required={true}
                              autoComplete="off"
                              placeholder="privacy"
                            />
                          </Col>
                          {/* {formik.errors.catalogue.privacy && (
      <div className="text-danger">{formik.errors.catalogue.privacy }</div>
    )} */}
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Terms
                          </Form.Label>
                          <Col sm={10}>
                            {" "}
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="catalogue.terms" // correct name
                              value={formik.values.catalogue.terms}
                              required={true}
                              autoComplete="off"
                              placeholder="Terms"
                            />
                          </Col>
                          {/* {formik.errors.catalogue.terms && (
      <div className="text-danger">{formik.errors.catalogue.terms }</div>
    )} */}
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Loyalty
                          </Form.Label>
                          <Col sm={10}>
                            {" "}
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="catalogue.loyalty" // correct name
                              value={formik.values.catalogue.loyalty}
                              required={true}
                              autoComplete="off"
                              placeholder="Catalogue"
                            />
                          </Col>
                          {/* {formik.errors.loyalty && (
      <div className="text-danger">{formik.errors.catalogue.loyalty }</div>
    )} */}
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Row} className="form-group">
                          <Form.Label column sm={2} htmlFor="FirmName">
                            Product
                          </Form.Label>
                          <Col sm={10}>
                            {" "}
                            <Form.Control
                              type="text"
                              onChange={handleInputChange}
                              name="catalogue.product" // correct name
                              value={formik.values.catalogue.product}
                              required={true}
                              autoComplete="off"
                              placeholder="Prodcut Catalogue"
                            />
                          </Col>
                        </Form.Group>
                      </Row>
                    </Row>
                  </Row>
                  <Row>
                    <h5 className="text-center">Gift</h5>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="gift_types">Gift Types</Form.Label>
                        {Array.isArray(formik.values.gift.gift_types) &&
                          formik.values.gift.gift_types.map((item, index) => {
                            return (
                              <>
                                <InputGroup className="mb-3">
                                  <Form.Control
                                    type="text"
                                    name="gift_types"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `gift[gift_types][${index}]`,
                                        e.target.value
                                      );
                                    }}
                                    value={item}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Enter Customer Type"
                                  />
                                  <InputGroup.Text
                                    onClick={async () => {
                                      const customer_types = await JSON.parse(
                                        JSON.stringify(
                                          formik.values.gift.gift_types
                                        )
                                      );
                                      const types = await customer_types.filter(
                                        (e: string) => e !== item
                                      );
                                      formik.setFieldValue(
                                        "gift[gift_types]",
                                        types
                                      );
                                    }}
                                    className="bg-danger text-white"
                                  >
                                    x
                                  </InputGroup.Text>
                                </InputGroup>
                              </>
                            );
                          })}
                        <button
                          type="button"
                          onClick={() => {
                            const types = Array.isArray(
                              formik.values.gift.gift_types
                            )
                              ? JSON.parse(
                                  JSON.stringify(formik.values.gift.gift_types)
                                )
                              : [];
                            types.push("");
                            formik.setFieldValue("gift[gift_types]", types);
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <h5 className="text-center">Call Center</h5>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="calltypes">Call Types</Form.Label>
                        {formik.values.callcenter &&
                          Array.isArray(formik.values.callcenter.calltypes) &&
                          formik.values.callcenter.calltypes.map(
                            (item, index) => {
                              return (
                                <>
                                  <InputGroup className="mb-3">
                                    <Form.Control
                                      type="text"
                                      name="calltypes"
                                      onChange={(e) => {
                                        formik.setFieldValue(
                                          `callcenter[calltypes][${index}]`,
                                          e.target.value
                                        );
                                      }}
                                      value={item}
                                      required={true}
                                      autoComplete="off"
                                      placeholder="Enter Customer Type"
                                    />
                                    <InputGroup.Text
                                      onClick={async () => {
                                        const customer_types = await JSON.parse(
                                          JSON.stringify(
                                            formik.values.callcenter.calltypes
                                          )
                                        );
                                        const types =
                                          await customer_types.filter(
                                            (e: string) => e !== item
                                          );
                                        formik.setFieldValue(
                                          "callcenter[calltypes]",
                                          types
                                        );
                                      }}
                                      className="bg-danger text-white"
                                    >
                                      x
                                    </InputGroup.Text>
                                  </InputGroup>
                                </>
                              );
                            }
                          )}
                        <button
                          type="button"
                          onClick={() => {
                            const types =
                              formik.values.callcenter &&
                              Array.isArray(formik.values.callcenter.calltypes)
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.callcenter.calltypes
                                    )
                                  )
                                : [];
                            types.push("");
                            formik.setFieldValue(
                              "callcenter[calltypes]",
                              types
                            );
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="callstatus">
                          Call Status
                        </Form.Label>
                        {formik.values.callcenter &&
                          Array.isArray(formik.values.callcenter.callstatus) &&
                          formik.values.callcenter.callstatus.map(
                            (item, index) => {
                              return (
                                <>
                                  <InputGroup className="mb-3">
                                    <Form.Control
                                      type="text"
                                      name="calltypes"
                                      onChange={(e) => {
                                        formik.setFieldValue(
                                          `callcenter[callstatus][${index}]`,
                                          e.target.value
                                        );
                                      }}
                                      value={item}
                                      required={true}
                                      autoComplete="off"
                                      placeholder="Enter Customer Type"
                                    />
                                    <InputGroup.Text
                                      onClick={async () => {
                                        const customer_types = await JSON.parse(
                                          JSON.stringify(
                                            formik.values.callcenter.callstatus
                                          )
                                        );
                                        const types =
                                          await customer_types.filter(
                                            (e: string) => e !== item
                                          );
                                        formik.setFieldValue(
                                          "callcenter[callstatus]",
                                          types
                                        );
                                      }}
                                      className="bg-danger text-white"
                                    >
                                      x
                                    </InputGroup.Text>
                                  </InputGroup>
                                </>
                              );
                            }
                          )}
                        <button
                          type="button"
                          onClick={() => {
                            const types =
                              formik.values.callcenter &&
                              Array.isArray(formik.values.callcenter.callstatus)
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.callcenter.callstatus
                                    )
                                  )
                                : [];
                            types.push("");
                            formik.setFieldValue(
                              "callcenter[callstatus]",
                              types
                            );
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col>

                    <Col sm={4}></Col>
                  </Row>
                </Container>
              </Form>
              <Container>
                <Form>
                  <Col sm={4}>
                    <label>Remark</label>
                    {/* <Form.Control
                      type="text"
                      name="remark"
                      onChange={(e: any) => handle(e)}
                      value={data.remark}
                      required={true}
                      autoComplete="off"
                      id="remark"
                      placeholder="Enter Remark"
                    /> */}
                    <input
                      type="text"
                      id="remark"
                      value={remark}
                      onChange={handleRemarkChange}
                    />
                    <br />
                    <button type="button" onClick={Remarksubmit}>
                      save
                    </button>
                  </Col>
                </Form>
              </Container>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}