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
  Spinner,
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
  backendCustomerWelcomePoint,
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
  const [welcomePointLoading, setWelcomePointLoading] = useState(false);
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

  const handleAddWelcomePoint = async () => {
    setWelcomePointLoading(true);
    try {
      const result = await backendCustomerWelcomePoint(customerInfo._id);
      const response = Array.isArray(result?.data) ? result.data[0] : result?.data;

      if (response?.message) {
        alert(response.message);
      } else if (
        response?.customerid === customerInfo._id &&
        response?.transactionType === "Cr" &&
        response?.pointType?.toLowerCase() === "welcome point"
      ) {
        alert(`${response.points || 50} welcome points credited successfully`);
      } else {
        alert("Unable to credit welcome points");
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Unable to credit welcome points. Please try again."
      );
    } finally {
      setWelcomePointLoading(false);
    }
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

  const formatDateTime = (value?: string) =>
    value
      ? new Date(value).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const fullName = (u?: { firstName?: string; lastName?: string }) =>
    [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "-";

  const stats = [
    {
      label: "Total Points Earned",
      value: customerInfo.totalTransaction,
      icon: SHOP_ALT_IMAGE,
      tone: "cd-stat-green",
    },
    {
      label: "Total Redemption",
      value: customerInfo.totalRedemption,
      icon: SHOPPING_BAG_IMAGE,
      tone: "cd-stat-blue",
    },
    {
      label: "Rejected Points",
      value: customerInfo.totalRejectedPoint,
      icon: USER_ALT_IMAGE,
      tone: "cd-stat-red",
    },
    {
      label: "Balance Points",
      value: customerInfo.balancePoint,
      icon: USER_ALT_IMAGE,
      tone: "cd-stat-amber",
    },
  ];

  return (
    <Layout>
      {/* <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/customer', label: 'CustomerList' }} itemlabel='Customer Profile' /> */}
      <div className="cd-page">
        <Link href="/customer" className="cd-back">
          &larr; Back to Customer List
        </Link>

        {/* Profile header */}
        <div className="cd-hero">
          <div className="cd-hero-identity">
            <Image
              className="cd-hero-avatar"
              src={
                customerInfo.avatar
                  ? IMAGE_URL + customerInfo.avatar
                  : IMAGE_URL + CUSTOMER_DEMO_IMAGE
              }
            />
            <div className="cd-hero-text">
              <h3>{customerInfo.firmName}</h3>
              <div className="cd-hero-tags">
                {customerInfo.customerType ? (
                  <span className="cd-badge cd-badge-type">
                    {customerInfo.customerType}
                  </span>
                ) : null}
                <span
                  className={`cd-badge ${
                    customerInfo.active ? "cd-badge-success" : "cd-badge-muted"
                  }`}
                >
                  {customerInfo.active ? "Active" : "Inactive"}
                </span>
                {customerInfo.refno ? (
                  <span className="cd-hero-meta">
                    Ref No: {customerInfo.refno}
                  </span>
                ) : null}
              </div>
              <div className="cd-hero-contact">
                {customerInfo.mobile ? (
                  <span>
                    <i className="feather icon-phone"></i> {customerInfo.mobile}
                  </span>
                ) : null}
                {customerInfo.email ? (
                  <span>
                    <i className="feather icon-mail"></i> {customerInfo.email}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="cd-hero-actions">
            <div className="cd-status-toggle">
              <span>Status</span>
              <div className="form-check form-switch custom-control-inline mb-0">
                <Form.Check
                  inline
                  name="active"
                  type="checkbox"
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
            </div>
            {customerInfo.customerType === "Mechanic" && (
              <Button
                className="cd-btn"
                variant="success"
                disabled={welcomePointLoading}
                onClick={handleAddWelcomePoint}
              >
                {welcomePointLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Crediting...
                  </>
                ) : (
                  "Add Welcome Point"
                )}
              </Button>
            )}
            {moduleAccess.canUpdate && (
              <Link
                href={{
                  pathname: "/customer/create",
                  query: { id: customerInfo._id },
                }}
              >
                <Button className="cd-btn" variant="dark">
                  <Image src={IMAGE_URL + EDIT_WHITE_DEMO_IMAGE} /> Edit
                </Button>
              </Link>
            )}
            {moduleAccess.canDelete && (
              <Button
                className="cd-btn cd-btn-danger"
                variant="outline-danger"
                onClick={() => {
                  handleDeleteItem(customerInfo._id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <Row className="g-3 mb-4">
          {stats.map((stat) => (
            <Col xl={3} sm={6} xs={12} key={stat.label}>
              <div className={`cd-stat ${stat.tone}`}>
                <div className="cd-stat-icon">
                  <Image src={IMAGE_URL + stat.icon} />
                </div>
                <div>
                  <div className="cd-stat-label">{stat.label}</div>
                  <div className="cd-stat-value">{stat.value ?? 0}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Tabs */}
        <div className="cd-tabs-card">
          <Tabs
            defaultActiveKey="profile"
            id="pills-tab"
            className="cd-tabs"
            activeKey={key}
            onSelect={(k: any) => setKey(k)}
          >
            <Tab eventKey="detailinfo" title="Detail">
              <Row className="g-4">
                <Col xl={8} md={12}>
                  <div className="cd-section">
                    <h6 className="cd-section-title">Basic Information</h6>
                    <div className="cd-grid">
                      <div className="cd-field">
                        <label>Firm Name</label>
                        <span>{customerInfo.firmName || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>Contact Person</label>
                        <span>{customerInfo.contactPerson || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>Mobile</label>
                        <span>{customerInfo.mobile || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>Customer Type</label>
                        <span>{customerInfo.customerType || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>Email</label>
                        <span>{customerInfo.email || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cd-section">
                    <h6 className="cd-section-title">Location</h6>
                    <div className="cd-grid">
                      <div className="cd-field">
                        <label>State</label>
                        <span>{customerInfo?.state || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>City</label>
                        <span>{customerInfo?.city || "-"}</span>
                      </div>
                      <div className="cd-field">
                        <label>Postal Code</label>
                        <span>{customerInfo?.postalCode || "-"}</span>
                      </div>
                      <div className="cd-field cd-field-full">
                        <label>Address</label>
                        <span>{customerInfo?.address || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cd-section">
                    <h6 className="cd-section-title">Assignment</h6>
                    <div className="cd-grid">
                      <div className="cd-field">
                        <label>Assigned User</label>
                        <span className="cd-editable">
                          {fullName(customerInfo?.userInfo)}
                          <PencilSquare
                            className="cd-edit-icon"
                            onClick={() => setAssignUserView(true)}
                          />
                        </span>
                        {assignUserView ? (
                          <div className="mt-2">
                            <SelectUserList
                              handleInputChange={handleInputChange}
                              fieldname="userid"
                              fieldvalue={formik.values.userid}
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="cd-field">
                        <label>Assigned Manager</label>
                        <span className="cd-editable">
                          {fullName(customerInfo?.reportings)}
                          <PencilSquare
                            className="cd-edit-icon"
                            onClick={() => setAssignReportingView(true)}
                          />
                        </span>
                        {assignReportingView ? (
                          <div className="mt-2">
                            <SelectUserList
                              handleInputChange={handleInputChange}
                              fieldname="reporting"
                              fieldvalue={formik.values.reporting}
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="cd-field">
                        <label>Created By</label>
                        <span>{customerInfo?.createdBy || "-"}</span>
                      </div>
                    </div>
                    {assignReportingView || assignUserView ? (
                      <div className="text-end mt-3">
                        <Link
                          href={{
                            pathname: "/customer",
                          }}
                        >
                          <Button
                            size="sm"
                            className="btn-dark cd-btn"
                            disabled={!formik.isValid}
                            onClick={() => {
                              if (formik.isValid) {
                                formik.handleSubmit();
                              }
                            }}
                          >
                            Save Assignment
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div className="cd-section mb-0">
                    <h6 className="cd-section-title">Activity</h6>
                    <div className="cd-grid">
                      <div className="cd-field">
                        <label>Created Date</label>
                        <span>{formatDateTime(customerInfo.createdAt)}</span>
                      </div>
                      <div className="cd-field">
                        <label>Last Login</label>
                        <span>{formatDateTime(customerInfo.loginAt)}</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xl={4} md={12}>
                  <div className="cd-section mb-0">
                    <h6 className="cd-section-title">Shop Image</h6>
                    <div className="cd-shop-image">
                      <Image
                        src={
                          customerInfo.shopimage
                            ? IMAGE_URL + customerInfo.shopimage
                            : IMAGE_URL + CUSTOMER_DEMO_IMAGE
                        }
                      />
                    </div>
                    {!customerInfo.shopimage ? (
                      <p className="cd-muted-note">No shop image uploaded</p>
                    ) : null}
                  </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetail;
