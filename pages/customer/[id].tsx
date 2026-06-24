import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import {
  PencilSquare,
  PlusCircleFill,
  XCircleFill,
  XSquare,
  EyeFill,
  EyeSlashFill,
  Pencil,
  Pentagon,
  Pen,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendDeleteCustomer,
  backendGetCustomerInfo,
  backendPostCustomerStatus,
  backendCustomerUserAssign,
} from "../../helpers/backend_helper";
import Link from "next/link";
import dashboardimg from "../../assets/images/auth/dashboard.svg";
import {
  CustomerProfileViewInterface,
  initialCustomerProfileData,
} from "../../interfaces/customer.interface";
import { useRouter } from "next/router";
import {
  IMAGE_URL,
  CUSTOMER_DEMO_IMAGE,
  EDIT_DEMO_IMAGE,
  EDIT_WHITE_DEMO_IMAGE,
  SHOPPING_BAG_IMAGE,
  SHOP_ALT_IMAGE,
  USER_ALT_IMAGE,
  SHOP_EARN_POINT_IMAGE,
  WHITE_TRASH_IMAGE,
} from "../../utils/constant";
import CustomerBank from "../../components/Customer/CustomerBank";
import CustomerTransactionList from "../../components/Customer/CustomerTransactionList";
import CustomerRedemptionList from "../../components/Customer/CustomerRedemption";
import CustomerCallSummary from "../../components/Customer/CustomerCallSummary";
import SelectUserList from "../../components/InputFields/SelectUserList";
import { Formik, FormikHelpers, useFormik, useFormikContext } from "formik";
import * as yup from "yup";
const schema = yup.object().shape({
  customerid: yup.string().min(3).max(50).required("CustomerID is required"),
  userid: yup.string().min(3).max(50).required("User is required"),
  reporting: yup.string().min(3).max(50),
});
const CustomerDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [key, setKey] = useState("detailinfo");
  const [assignUserView, setAssignUserView] = useState(false);
  const [assignReportingView, setAssignReportingView] = useState(false);
  const [customerInfo, setCustomerInfo] =
    useState<CustomerProfileViewInterface>(initialCustomerProfileData);
  const permissionData = useSelector(
    (state: any) => state?.permission?.permission
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "customers.read":
          return { ...acc, canRead: true };
        case "customers.update":
          return { ...acc, canUpdate: true };
        case "customers.delete":
          return { ...acc, canDelete: true };
        case "customers.create":
          return { ...acc, canCreate: true };
        case "customers.export":
          return { ...acc, canExport: true };
        case "customers.import":
          return { ...acc, canImport: true };
        default:
          return acc;
      }
    }, {});
  const dispatch = useDispatch();
  const fetchCustomerDetail = async () => {
    await backendGetCustomerInfo(id).then((res) => {
      if (!res.isError) {
        setCustomerInfo(res.data);
      }
    });
  };
  useEffect(() => {
    if (id) fetchCustomerDetail();
  }, [id]);
  const handleDeleteItem = (id: string) => {
    backendDeleteCustomer(id)
      .then((result) => {
        if (!result.isError) {
          router.push("/customer");
        } else {
        }
      })
      .catch((err) => {});
  };

  const activeInactiveCustomer = () => {
    backendPostCustomerStatus({
      customerid: id,
      active: customerInfo.active ? false : true,
    })
      .then((result) => {
        if (!result.isError) {
          fetchCustomerDetail();
        }
      })
      .catch((err) => {});
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, value);
  };
  const handleFormSubmit = async () => {
    try {
      formik.setSubmitting(true);
      backendCustomerUserAssign(formik.values)
        .then((result) => {
          if (!result.isError) {
            //router.push('/customer');
          } else {
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: {
      customerid: id,
      userid: customerInfo?.userInfo?._id,
      reporting: customerInfo?.reportings?._id,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Layout>
      {/* <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/customer', label: 'CustomerList' }} itemlabel='Customer Profile' /> */}
      <Row>
        <Col xl={3} sm={3} xs={12}>
          <Card className="prod-p-card bg-white">
            <Card.Body className="p-20">
              <Row className="align-items-center">
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOP_ALT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Point Earn</h6>
                  <h3 className="m-b-0 text-dark">
                    {" "}
                    {customerInfo.totalTransaction}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={3} xs={12}>
          <Card className="prod-p-card bg-white">
            <Card.Body className="p-20">
              <Row className="align-items-center">
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOPPING_BAG_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Redemption</h6>
                  <h3 className="m-b-0 text-dark">
                    {" "}
                    {customerInfo.totalRedemption}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} sm={3} xs={12}>
          <Card className="prod-p-card bg-white">
            <Card.Body className="p-20">
              <Row className="align-items-center">
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + USER_ALT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total RejectedPoint</h6>
                  <h3 className="m-b-0 text-dark">
                    {customerInfo.totalRejectedPoint}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={3} xs={12}>
          <Card className="prod-p-card bg-white">
            <Card.Body className="p-20">
              <Row className="align-items-center">
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + USER_ALT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total balancePoint</h6>
                  <h3 className="m-b-0 text-dark">
                    {customerInfo.balancePoint}
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col xl={3} sm={3} xs={12}>
          <Card className="prod-p-card bg-white">
            <Card.Body className="p-20">
              <Row className="align-items-center">
                <Col xl={3} sm={3} xs={3}>
                  <Image src={IMAGE_URL + SHOP_EARN_POINT_IMAGE} />
                </Col>
                <Col xl={9} sm={9} xs={9}>
                  <h6 className="m-b-5 text-dark">Total Points</h6>
                <h3 className="m-b-0 text-dark">$1,783</h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col> */}
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-0">Customer Profile</h3>
            </Col>
            <Col xl={6} sm={6} xs={6} className="text-end">
              <Card.Body>
                <div className="form-group d-flex align-items-center justify-content-end mb-0">
                  <Form.Group>
                    <Form.Label className="d-block m-r-10"></Form.Label>
                    <div className="form-check form-switch custom-control-inline">
                      <Form.Check
                        inline
                        name="active"
                        type="checkbox"
                        //   if (
                        //     window.confirm(
                        //       `Are you sure to ${
                        //         subcategoryInfo?.active ? "Inactive" : "Active"
                        //       } product ?`
                        //     )
                        //   ) {
                        //     activeInactiveSubCategory();
                        //   }
                        // }}

                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure to ${
                                customerInfo?.active ? "Inactive" : "Active"
                              } customer?`
                            )
                          ) {
                            activeInactiveCustomer();
                          }
                        }}
                        defaultChecked={customerInfo?.active}
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <Card className="flat-card m-t-10">
            <Row className="m-10">
              <Tabs
                defaultActiveKey="profile"
                id="pills-tab"
                className="nav-pills"
                fill
                activeKey={key}
                onSelect={(k: any) => setKey(k)}
              >
                <Tab eventKey="detailinfo" title="Detail">
                  <Row>
                    <Col
                      xl={6}
                      sm={6}
                      xs={6}
                      className="border-end border-end-dashed"
                    >
                      <Row className="align-items-center card-body">
                        <Col xl={6} sm={6} xs={6}>
                          <Image
                            className="width240 rounded img-fluid"
                            src={
                              customerInfo.avatar
                                ? IMAGE_URL + customerInfo.avatar
                                : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                            }
                          />
                        </Col>
                        <Col xl={6} sm={6} xs={6}>
                          <h4>{customerInfo.firmName}</h4>
                          <span className="text-muted">
                            <i className="feather icon-phone m-r-10"></i>
                            {customerInfo.email}
                          </span>
                          <br />
                          <span className="text-muted">
                            <i className="feather icon-mail m-r-10"></i>
                            {customerInfo.email}{" "}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={6} sm={6} xs={6}>
                      <Row className="align-items-center card-body">
                        <Col xl={6} sm={6} xs={6}>
                          <Col xl={6} sm={6} xs={6}>
                            <Image
                              className="width240 rounded img-fluid"
                              src={
                                customerInfo.shopimage
                                  ? IMAGE_URL + customerInfo.shopimage
                                  : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                              }
                            />
                            <p>ShopImage</p>
                          </Col>
                          {/* <div className="mb-2">
                            <p className="mb-0 f-12">Tier</p>
                            <span className="text-muted f-12">
                              <Image src="/gold.svg" />
                              {customerInfo.grade}
                            </span>
                          </div>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Grade</p>
                            <span className="text-muted ">
                              {customerInfo.grade}
                            </span>
                          </div> */}
                        </Col>
                        <Col xl={6} sm={6} xs={6} className="text-end">
                          {moduleAccess.canUpdate && (
                            <Link
                              className="mb-3"
                              href={{
                                pathname: "/customer/create",
                                query: { id: customerInfo._id },
                              }}
                            >
                              <Button className="btn btn-dark  m-r-5">
                                <Image
                                  src={IMAGE_URL + EDIT_WHITE_DEMO_IMAGE}
                                />{" "}
                                Edit
                              </Button>
                            </Link>
                          )}
                          {moduleAccess.canDelete && (
                            <div className="btn  btn-dark">
                              <a
                                className="btn p-0 btn-icon"
                                onClick={() => {
                                  handleDeleteItem(customerInfo._id);
                                }}
                              >
                                <Image src={IMAGE_URL + WHITE_TRASH_IMAGE} />
                                Delete
                              </a>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="border-top border-top-dashed">
                    <Col xl={12} sm={12} xs={12}>
                      <Row className="align-items-start card-body">
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Firm Name</p>
                            <span className="text-muted ">
                              {customerInfo.firmName}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Contact Person</p>
                            <span className="text-muted ">
                              {customerInfo.contactPerson}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Mobile</p>
                            <span className="text-muted ">
                              {customerInfo.mobile}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Customer Type</p>
                            <span className="text-muted ">
                              {customerInfo.customerType}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="border-top border-top-dashed">
                    <Col xl={12} sm={12} xs={12}>
                      <Row className="align-items-start card-body">
                        <Col xl={4} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">State</p>
                            <span className="text-muted ">
                              {customerInfo?.state}
                            </span>
                          </div>
                        </Col>
                        <Col xl={4} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">City</p>
                            <span className="text-muted ">
                              {customerInfo?.city}
                            </span>
                          </div>
                        </Col>
                        <Col xl={4} sm={12} xs={12}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Address</p>
                            <span className="text-muted ">
                              {customerInfo?.address}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="border-top border-top-dashed">
                    <Col xl={12} sm={12} xs={12}>
                      <Row className="align-items-start card-body">
                        <Col xl={4} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Assigned User</p>
                            <span className="text-muted ">
                              {customerInfo?.userInfo?.firstName}{" "}
                              {customerInfo?.userInfo?.lastName}
                            </span>
                            <span>
                              <PencilSquare
                                onClick={() => setAssignUserView(true)}
                              />
                            </span>
                          </div>
                          {assignUserView ? (
                            <SelectUserList
                              handleInputChange={handleInputChange}
                              fieldname="userid"
                              fieldvalue={formik.values.userid}
                            />
                          ) : null}
                        </Col>
                        <Col xl={4} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Assigned Manager</p>
                            <span className="text-muted ">
                              {customerInfo?.reportings?.firstName}{" "}
                              {customerInfo?.reportings?.lastName}
                            </span>
                            <span>
                              <PencilSquare
                                onClick={() => setAssignReportingView(true)}
                              />
                            </span>
                          </div>
                          {assignReportingView ? (
                            <SelectUserList
                              handleInputChange={handleInputChange}
                              fieldname="reporting"
                              fieldvalue={formik.values.reporting}
                            />
                          ) : null}
                        </Col>
                        <Col xl={4} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Created By</p>
                            <span className="text-muted ">
                              {customerInfo?.createdBy}
                            </span>
                          </div>
                          {assignReportingView || assignUserView ? (
                            <Link
                              className="mb-3"
                              href={{
                                pathname: "/customer",
                              }}
                            >
                              <Button
                                size="sm"
                                className="btn-dark"
                                disabled={!formik.isValid}
                                onClick={() => {
                                  if (formik.isValid) {
                                    formik.handleSubmit();
                                  }
                                }}
                              >
                                Save{" "}
                              </Button>
                            </Link>
                          ) : null}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="border-top border-top-dashed">
                    <Col xl={12} sm={12} xs={12}>
                      <Row className="align-items-start card-body">
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Created Date</p>
                            <span className="text-muted ">
                              {customerInfo.createdAt
                                ? new Date(
                                    customerInfo.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "numeric",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Last Login</p>
                            <span className="text-muted ">
                              {customerInfo.loginAt
                                ? new Date(
                                    customerInfo.loginAt
                                  ).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "numeric",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}></Col>
                        <Col xl={3} sm={4} xs={6}></Col>
                      </Row>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="aproval" title="KYC">
                  {id ? (
                    <CustomerBank customerid={id} customerInfo={customerInfo} />
                  ) : null}
                </Tab>
                <Tab eventKey="transactions" title="Transactions">
                  {id ? <CustomerTransactionList customerid={id} /> : null}
                </Tab>
                <Tab eventKey="redemptions" title="Redemptions">
                  {id ? <CustomerRedemptionList customerid={id} /> : null}
                </Tab>
                <Tab eventKey="callSummary" title="Activities">
                  {id ? <CustomerCallSummary customerid={id} /> : null}
                </Tab>
              </Tabs>
            </Row>
          </Card>
          <Card className="flat-card m-t-10">
            <Row></Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default CustomerDetail;
