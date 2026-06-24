import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Card,
  FormLabel,
  Image,
  FormControl,
  InputGroup,
  Modal,
  ListGroup,
} from "react-bootstrap";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import {
  IMAGE_URL,
  WHITE_CHECKED_IMAGE,
  BLUE_PLUS_CIRCLE_IMAGE,
  RECTANGLE_DEMO_IMAGE,
  BLACK_PLUS_CIRCLE_IMAGE,
  RED_TRASH_IMAGE,
} from "../../utils/constant";
import Layout from "../../components/Layout";
import {
  backendPostAddNewLoyaltyScheme,
  backendPostLoyaltySchemeStatus,
  backendPatchUpdateLoyaltyScheme,
  backendGetCountryStates,
  backendGetStateCities,
  backendCustomersDropDownList,
  backendGetCategoriesDropdownList,
  backendGetProductsDropdownList,
  backendGetLoyaltySchemeInfo,
  backendGetSetting,
  getCategoryProducts,
} from "../../helpers/backend_helper";
import { objectAppendIntoformData } from "../../utils/utility";
import {
  LoyaltySchemeInterface,
  LoyaltySchemeDetailInterface,
  initialLoyaltyScheme,
  initialLoyaltySchemeDetail,
} from "../../interfaces/scheme.interface";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";
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
import {
  initialLoyaltySettingData,
  SettingLoyaltyInterface,
} from "../../interfaces/setting.interface";
import {
  CategoryDropDownInterface,
  ProductDropDownInterface,
} from "../../interfaces/product.interface";
import CustomerTypeCheckbox from "../../components/InputFields/CustomerTypeCheckbox";
import SelectLoyaltySchemeType from "../../components/InputFields/SelectLoyaltySchemeType";
import SelectSchemeBasedOn from "../../components/InputFields/SelectSchemeBasedOn";
const schema = yup.object().shape({
  schemeName: yup.string().min(3).required("schemeName is required"),
  basedOn: yup.string().required("basedon is required"),
  frequency: yup.string().required("frequency is required"),
  customers: yup.array().required("customers is required"),
  customerType: yup.array().required("customerType Name is required"),
  schemeDescription: yup.string().required("description code is required"),
  schemeType: yup.string().required("schemeType is required"),

  //  startedAt:yup.date().required('required field'),
  // endedAt:yup.date().required('required field'),

  startedAt: yup
    .date()
    .default(() => new Date())
    .required("required field"),
  endedAt: yup.date().required("required field"),
  //    .when(
  //        "eventStartDate",
  //        (startedAt, schema) =>schema.min(startedAt)),

  schemeDetail: yup.array().of(
    yup.object().shape({
      detailName: yup.string().required(`require feild`),
      categories: yup.array().required(`require field`),
      products: yup.array().required(`require feild`),
      points: yup.number().required(`require field`),
    })
  ),
});
const LoyaltySchemeSave = React.forwardRef((props, ref) => {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] =
    useState<LoyaltySchemeInterface>(initialLoyaltyScheme);
  const [settingData, setSettingData] = useState<SettingLoyaltyInterface>(
    initialLoyaltySettingData
  );
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchString, setSearchString] = useState("");
  const fetchLoyaltySchemeDetail = async () => {
    await backendGetLoyaltySchemeInfo(id).then((res: any) => {
      if (!res.isError) {
        formik.setValues(res.data);
      }
    });
  };
  const fetchProjectSetting = async () => {
    await backendGetSetting().then((res: any) => {
      if (!res.isError) {
        const { loyaltyscheme } = res.data;
        setSettingData(loyaltyscheme);
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchLoyaltySchemeDetail();
    }
    fetchProjectSetting();
  }, [id]);
  const [customerTypeData, setCustomerTypeData] = useState([
    "Distributor",
    "Dealer",
    "Stockist",
    "Mechanic",
    "STU",
    "Fleet Owner",
  ]);
  const [frequencyData, setFrequencyData] = useState([
    "Monthly",
    "Quarterly",
    "Half Yearly",
    "Yearly",
  ]);
  const [basedOnData, setBasedOnData] = useState([
    "Coupons",
    "Quantity",
    "Values",
    "Referral",
  ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    console.log("{ name, value, type }" , { name, value, type })
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);

    console.log("formikformikformikformikformikformik" , formik)
    //setRequestData({ ...requestData, [name]: value })
  };

  const handleInputChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    var customertypes = formik.values.customerType
      ? JSON.parse(JSON.stringify(formik.values.customerType))
      : [];
    if (checked) {
      customertypes.push(value);
    } else {
      customertypes = customertypes.filter(function (item: string) {
        return item !== value;
      });
    }
    formik.setFieldValue(`customerType`, customertypes);
  };

  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [categoryData, setCategoryData] = useState<CategoryDropDownInterface>();
  const [productData, setProductData] = useState<
    Array<ProductDropDownInterface>
  >([]);
  const fetchStatesList = async () => {
    await backendGetCountryStates({ country: "India" }).then((res: any) => {
      if (!res.isError) {
        setStateData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchStatesList();
  }, []);

  const fetchCitiesList = async () => {
    await backendGetStateCities({ state: "Madhya Pradesh" }).then(
      (res: any) => {
        if (!res.isError) {
          setCityData(res.data);
        }
      }
    );
  };
  useEffect(() => {
    fetchCitiesList();
  }, [requestData.states]);

  const fetchCustomersList = async () => {
    await backendCustomersDropDownList().then((res: any) => {
      const { docs } = res.data;
      if (!res.isError) {
        setCustomersData(docs);
      }
    });
  };
  useEffect(() => {
    fetchCustomersList();
  }, []);

  const fetchCategoriesList = async () => {
    await backendGetCategoriesDropdownList().then((res: any) => {
      if (!res.isError) {
        setCategoryData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchCategoriesList();
    fetchAllProductsList();
  }, []);

  const fetchAllProductsList = async () => {
    await getCategoryProducts({ category: [], exceptids: [] }).then(
      (res: any) => {
        if (!res.isError) {
          setAllProducts(res.data);
        }
      }
    );
  };

  const fetchProductsList = async () => {
    let products = formik.values.schemeDetail
      .filter(function (rows) {
        return rows.products != null;
      })
      .map(function (rows) {
        return rows.products;
      });
    await getCategoryProducts({
      category: selectedCategory,
      exceptids: products.flat(1),
    }).then((res: any) => {
      if (!res.isError) {
        setProductData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchProductsList();
  }, [selectedCategory]);

  const handleFormSubmit = async () => {
    try {
      // const formData = new FormData();
      var iData = JSON.parse(JSON.stringify(formik.values));
      // //await iData.append("image", imageFile);
      delete iData["_id"];
      delete iData["pointValue"];
      delete iData["image"];
      delete iData["active"];
      delete iData["createdAt"];
      delete iData["createdBy"];
      delete iData["__v"];
      delete iData["productInfo"];
      delete iData["categoryInfo"];
      delete iData["subcategoryInfo"];

      var schemeDetail = await iData.schemeDetail.map((rows: any) => {
        delete rows["_id"];
        return rows;
      });
      delete iData["schemeDetail"];
      iData["schemeDetail"] = schemeDetail;
      var actionSubmit = (await formik.values._id)
        ? backendPatchUpdateLoyaltyScheme(formik.values._id, iData)
        : backendPostAddNewLoyaltyScheme(iData);
      actionSubmit
        .then((result) => {
          if (!result.isError) {
            router.push("/loyaltyscheme");
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: initialLoyaltyScheme,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });

  const onRemoveClick = (index:any) => {
    const updatedDetails = formik.values.schemeDetail.filter((_, i) => i !== index);
    formik.setFieldValue("schemeDetail", updatedDetails);
  };
  
  
  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/loyaltyscheme", label: "LoyaltySchemeList" }}
        itemlabel="LoyaltyScheme List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h3 className="card-body mb-2">
                {id ? "Edit" : "Add"} LoyaltyScheme
              </h3>
            </Col>
            <Col md={6} className="text-end">
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
                        defaultChecked={requestData.active}
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
            <Card className="flat-card">
              <Row>
                <Col xl={6} md={6}>
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
                          </div>
                          <div className="avatar-preview">
                            <Image
                              className="width120"
                              id="imagePreview"
                              src={
                                requestData.image
                                  ? IMAGE_URL + requestData.image
                                  : IMAGE_URL + RECTANGLE_DEMO_IMAGE
                              }
                              style={{ borderRadius: "100%" }}
                            />
                          </div>
                          <Form.Label htmlFor="FirmName">Image</Form.Label>
                        </div>
                      </div>
                    </Col>
                    <Col xl={6} md={6}></Col>
                  </Row>
                </Col>
                <Col xl={6} md={6}>
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
                        {" "}
                        <Image
                          src={IMAGE_URL + WHITE_CHECKED_IMAGE}
                        /> Save{" "}
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Row className="p-4">
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="SchemeName">Scheme Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="schemeName"
                        onChange={handleInputChange}
                        value={formik.values.schemeName}
                        onBlur={formik.handleBlur}
                        required={true}
                        autoComplete="off"
                        placeholder="Scheme Name"
                      />
                      {formik.errors.schemeName && (
                        <div className="text-danger">
                          {formik.errors.schemeName}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="startedAt">
                        {" "}
                        Valid Start Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="startedAt"
                        onChange={handleInputChange}
                        onBlur={formik.handleBlur}
                        value={
                          formik.values.startedAt &&
                          new Date(formik.values.startedAt)
                            .toISOString()
                            .split("T")[0]
                        }
                        required={true}
                        autoComplete="off"
                        placeholder="Enter Start Date"
                      />
                      {formik.errors.startedAt && (
                        <div className="text-danger">
                          {formik.errors.startedAt}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="endedAt"> Valid End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endedAt"
                        onChange={handleInputChange}
                        value={
                          formik.values.endedAt &&
                          new Date(formik.values.endedAt)
                            .toISOString()
                            .split("T")[0]
                        }
                        onBlur={formik.handleBlur}
                        required={true}
                        autoComplete="off"
                        placeholder="Enter End Date"
                      />
                      {formik.errors.endedAt && (
                        <div className="text-danger">
                          {formik.errors.endedAt}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <SelectLoyaltySchemeType
                      handleInputChange={handleInputChange}
                      schemeType={formik.values.schemeType}
                    />
                    {formik.errors.schemeType && (
                      <div className="text-danger">
                        {formik.errors.schemeType}
                      </div>
                    )}
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <SelectSchemeBasedOn
                      handleInputChange={handleInputChange}
                      basedOn={formik.values.basedOn}
                    />
                    {formik.errors.basedOn && (
                      <div className="text-danger">{formik.errors.basedOn}</div>
                    )}
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="mb-1">
                      <Form.Label htmlFor="frequency">Frequency</Form.Label>
                      <Form.Select
                        name="frequency"
                        defaultValue={formik.values.frequency}
                        onChange={(e: any) => handleInputChange(e)}
                      >
                        <option selected disabled>
                          Select Frequency
                        </option>
                        {frequencyData.map((item: any, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </Form.Select>
                      {formik.errors.frequency && (
                        <div className="text-danger">
                          {formik.errors.frequency}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  {settingData.customerType_based === true ? (
                    <Col md={4} sm={6} xs={12} className="mb-2">
                      <CustomerTypeCheckbox
                        key="customertype"
                        handleInputChange={handleInputChecked}
                        customerType={formik.values.customerType}
                      />
                      {/* <Form.Group className="form-group mb-1 ">
                                                <Form.Label htmlFor="customerType">Customer Type</Form.Label>
                                                <Form.Select className="form-control select2" name='customerType' value={formik.values.customerType}
                                                    as="select"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    //onChange={e => setRequestData({ ...requestData, customerType: [].slice.call(e.target.selectedOptions).map((item: any) => item.value) })}

                                                    autoComplete='off' multiple>
                                                    {customerTypeData.map((item: any, index) => (
                                                        <option key={index} value={item}>{item}</option>
                                                    ))}
                                                </Form.Select>
                                                {formik.errors.customerType && (
                                                    <div className="text-danger">{formik.errors.customerType}</div>
                                                )}
                                            </Form.Group> */}
                    </Col>
                  ) : null}
                  {settingData.states_based === true ? (
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="mb-1">
                        <Form.Label htmlFor="states">States</Form.Label>
                        <Form.Select
                          name="states"
                          value={formik.values.states}
                          //onChange={e => setRequestData({ ...requestData, states: [].slice.call(e.target.selectedOptions).map((item: any) => item.value) })}
                          as="select"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          autoComplete="off"
                          multiple
                        >
                          {stateData.map((item: any, index) => (
                            <option key={index} value={item.value}>
                              {item.value}
                            </option>
                          ))}
                        </Form.Select>
                        {formik.errors.states && (
                          <div className="text-danger">
                            {formik.errors.states}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  ) : null}
                  {settingData.city_based === true ? (
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="mb-1">
                        <Form.Label htmlFor="cities">Cities</Form.Label>
                        <Form.Select
                          name="cities"
                          value={formik.values.cities}
                          //onChange={e => setRequestData({ ...requestData, cities: [].slice.call(e.target.selectedOptions).map((item: any) => item.value) })}
                          as="select"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          autoComplete="off"
                          multiple
                        >
                          {cityData.map((item: any, index) => (
                            <option key={index} value={item.cityName}>
                              {item.cityName}
                            </option>
                          ))}
                        </Form.Select>
                        {formik.errors.cities && (
                          <div className="text-danger">
                            {formik.errors.cities}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  ) : null}
                  {settingData.customer_based === true ? (
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="mb-1">
                        <Form.Label htmlFor="customerType">
                          Customers
                        </Form.Label>
                        <Form.Select
                          name="customers"
                          defaultValue={formik.values.customers}
                          //onChange={e => setRequestData({ ...requestData, customers: [].slice.call(e.target.selectedOptions).map((item: any) => item.value) })}

                          as="select"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          autoComplete="off"
                          multiple
                        >
                          {Array.isArray(customersData) &&
                            customersData.map((item: any, index) => (
                              <option key={index} value={item._id}>
                                {item.firmName}
                              </option>
                            ))}
                        </Form.Select>
                        {formik.errors.customers && (
                          <div className="text-danger">
                            {formik.errors.customers}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  ) : null}
                  <Col md={12} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="endedAt">
                        SchemeDescription
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="schemeDescription"
                        onChange={handleInputChange}
                        value={formik.values.schemeDescription}
                        required={true}
                        as="textarea"
                        onBlur={formik.handleBlur}
                        autoComplete="off"
                        placeholder="Enter Description"
                      />
                      {formik.errors.schemeDescription && (
                        <div className="text-danger">
                          {formik.errors.schemeDescription}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={12} sm={12} xs={12} className="p-2">
                    <h4>LoyaltyScheme Details</h4>
                  </Col>

                  <FieldArray
                    name="schemeDetail"
                    validateOnChange={false}
                    render={(arrayHelpers) => (
                      <div>
                        {formik.values.schemeDetail.map(
                          (schemedetail, index: number) => (
                            <div key={index}>
                              <Row>
                                <Col md={3} sm={6} xs={10}>
                                  <Form.Label htmlFor="endedAt">
                                    DetailName
                                  </Form.Label>
                                  <Form.Control
                                    name={`schemeDetail[${index}].detailName`}
                                    value={
                                      formik.values.schemeDetail[index]
                                        .detailName
                                    }
                                    onChange={handleInputChange}
                                    required={true}
                                    className="mb-1"
                                    // onBlur={formik.handleBlur}
                                    autoComplete="off"
                                    placeholder="Enter detailName"
                                  />
                                </Col>
                                <Col md={3} sm={4} xs={12}>
                                  <Form.Label htmlFor="categories">
                                    Categories
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => {
                                        setShowCategoryModal(true);
                                        setSelectedIndex(index);
                                      }}
                                    >
                                      <Image
                                        src={
                                          IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE
                                        }
                                      />{" "}
                                    </Button>
                                  </Form.Label>
                                  <ListGroup>
                                    {Array.isArray(
                                      formik.values.schemeDetail[index]
                                        .categories
                                    ) &&
                                      Array.from(
                                        new Set(
                                          formik.values.schemeDetail[
                                            index
                                          ].categories
                                        )
                                      ).map((item: any) => {
                                        const categorrow =
                                          Array.isArray(categoryData) &&
                                          categoryData.filter(function (
                                            category: any
                                          ) {
                                            return category.value === item;
                                          });
                                        const category =
                                          Array.isArray(categorrow) &&
                                          categorrow.length
                                            ? categorrow[0]
                                            : { label: "" };
                                        return (
                                          <ListGroup.Item>
                                            {category?.label}
                                          </ListGroup.Item>
                                        );
                                      })}
                                  </ListGroup>
                                </Col>
                                <Col md={4} sm={6} xs={12}>
                                  <Form.Label htmlFor="products">
                                    Products{" "}
                                    <Button variant="link" size="sm">
                                      <Image
                                        onClick={() => {
                                          setShowModal(true);
                                          setSelectedIndex(index);
                                        }}
                                        src={
                                          IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE
                                        }
                                      />{" "}
                                    </Button>
                                  </Form.Label>
                                  <ListGroup>
                                    {Array.isArray(
                                      formik.values.schemeDetail[index].products
                                    ) &&
                                      formik.values.schemeDetail[
                                        index
                                      ].products.map((item: any) => {
                                        const productrow =
                                          Array.isArray(allProducts) &&
                                          allProducts.filter(function (
                                            product: any
                                          ) {
                                            return product._id === item;
                                          });
                                        const product =
                                          Array.isArray(productrow) &&
                                          productrow.length
                                            ? productrow[0]
                                            : { name: "" };
                                        return (
                                          <ListGroup.Item>
                                            {product.name}
                                          </ListGroup.Item>
                                        );
                                      })}
                                  </ListGroup>
                                </Col>
                                <Col md={2} sm={2} xs={2}>
                                  <Form.Label htmlFor="endedAt">
                                    Percentage
                                  </Form.Label>
                                  <InputGroup className="mb-3">
                                    <Form.Control
                                      className="mb-1 gdfgdgdgdgdgdgdg"
                                      name={`schemeDetail.${index}.points`}
                                      value={
                                        formik.values.schemeDetail[index].points
                                      }
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                
                                        if (/^\d*\.?\d*$/.test(value) || value === '') {
                                          handleInputChange(e);  
                                        }
                                      }}
                                      
                                      required={true}
                                     step="0.01" 
                                      //onBlur={formik.handleBlur}
                                      autoComplete="off"
                                      placeholder="Enter points"
                                    />
                                    <InputGroup.Text
                                      onClick={() =>  onRemoveClick(index)}
                                      className="bg-danger text-white "
                                      style={{cursor:"pointer"}}
                                    >
                                      x
                                    </InputGroup.Text>
                                  </InputGroup>
                                </Col>
                              </Row>
                              <div></div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  />

                  <Row className="align-items-end mt-5">
                    <Col xl={12} md={12} className="text-start">
                      <div
                        onClick={() => {
                          const newTodos = [
                            ...formik.values.schemeDetail,
                            {
                              detailName: "",
                            },
                          ];
                          formik.setFieldValue("schemeDetail", newTodos);
                        }}
                      >
                        <Image src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE} />{" "}
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Row>
            </Card>
          </Row>
        </Col>
      </Row>
      <Row>
        <Modal
          style={{ alignItems: "center" }}
          show={showModal}
          onHide={() => setShowModal(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Product Selection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="form-group">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                    value={searchString}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pt-4">
              {Array.isArray(productData) &&
                productData.map((item: ProductDropDownInterface, index) => {
                  if (item?.name?.match(searchString)) {
                    return (
                      <Col sm={12}>
                        <Form.Group className="form-group">
                          <Form.Check
                            inline
                            className="form-check pt-2 pr-4"
                            name="coupon_based"
                            type="checkbox"
                            value={item._id}
                            label={item.name}
                            onChange={(e) => {
                              const { value, checked } = e.target;
                              var products = formik.values.schemeDetail[
                                selectedIndex
                              ].products
                                ? JSON.parse(
                                    JSON.stringify(
                                      formik.values.schemeDetail[selectedIndex]
                                        .products
                                    )
                                  )
                                : [];
                              if (checked) {
                                products.push(value);
                              } else {
                                products = products.filter(function (
                                  item: string
                                ) {
                                  return item !== value;
                                });
                              }

                              formik.setFieldValue(
                                `schemeDetail[${selectedIndex}][products]`,
                                Array.from(new Set(products))
                              );
                            }}
                            defaultChecked={
                              Array.isArray(
                                formik.values.schemeDetail[selectedIndex]
                                  .products
                              )
                                ? formik.values.schemeDetail[
                                    selectedIndex
                                  ].products.some(
                                    (product) => product == item._id
                                  )
                                : false
                            }
                          />
                        </Form.Group>
                      </Col>
                    );
                  }
                })}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          size="lg"
          style={{ alignItems: "center" }}
          show={showCategoryModal}
          onHide={() => setShowCategoryModal(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Category Selection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="pt-4">
              {Array.isArray(categoryData) &&
                categoryData.map((item: any, index: number) => {
                  return (
                    <Col sm={12}>
                      <Form.Group className="form-group">
                        <Form.Check
                          inline
                          className="form-check pt-2 pr-4"
                          name="coupon_based"
                          type="checkbox"
                          value={item.value}
                          label={item.label}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            var categories = formik.values.schemeDetail[
                              selectedIndex
                            ].categories
                              ? JSON.parse(
                                  JSON.stringify(
                                    formik.values.schemeDetail[selectedIndex]
                                      .categories
                                  )
                                )
                              : [];
                            if (checked) {
                              categories.push(value);
                            } else {
                              categories = categories.filter(function (
                                item: string
                              ) {
                                return item !== value;
                              });
                            }
                            setSelectedCategory(categories);
                            formik.setFieldValue(
                              `schemeDetail[${selectedIndex}][categories]`,
                              Array.from(new Set(categories))
                            );
                          }}
                          defaultChecked={
                            Array.isArray(
                              formik.values.schemeDetail[selectedIndex]
                                .categories
                            )
                              ? formik.values.schemeDetail[
                                  selectedIndex
                                ].categories.some(
                                  (category) => category == item._id
                                )
                              : false
                            //Array.isArray(formik.values.schemeDetail[selectedIndex].categories) ? formik.values.schemeDetail[selectedIndex].categories.includes(item._id) : false
                          }
                        />
                      </Form.Group>
                    </Col>
                  );
                })}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowCategoryModal(false);
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Layout>
  );
});
export default LoyaltySchemeSave;
