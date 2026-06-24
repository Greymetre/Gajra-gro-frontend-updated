import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Card,
  FormLabel,
  Image,
  ButtonGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendPostAddNewRedemption,
  backendPatchUpdateRedemption,
  backendGetRedemptionInfo,
  backendGetGiftInfo,
  backendGetCustomerInfo,
  getRedeemTypeList,
  backendCustomersBankInfo,
  backendCustomersBalance,
  backendCustomerNeftRedemption,
  backendCustomerUpiRedemption,
} from "../../helpers/backend_helper";
import { IMAGE_URL, WHITE_CHECKED_IMAGE } from "../../utils/constant";
import SelectCustomerList from "../../components/InputFields/SelectCustomerList";
import SelectGiftDropDown from "../../components/InputFields/SelectGiftDropDown";
import {
  RedemptionCreateInterface,
  initialRedemption,
} from "../../interfaces/redemption.interface";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import SelectUserList from "../../components/InputFields/SelectUserList";
export default function RedemptionSave() {
  const router = useRouter();
  const [requestData, setRequestData] =
    useState<RedemptionCreateInterface>(initialRedemption);
  const { id } = router.query;
  const [giftPoint, setGiftPoint] = useState(1);
  const [balancePoint, setBalancePoint] = useState(0);
  const [creaditPoint, setcreaditPoint] = useState(0);
  const [bankVerified, setBankVerify] = useState(false);
  const [aadharVerified, setAadharverify] = useState(false);
  const [panVerified, setpanVerified] = useState(false);

  const [redeemTypeData, setRedeemTypeData] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const fetchRedemptionDetail = async () => {
    await backendGetRedemptionInfo(id).then((res) => {
      if (!res.isError) {
        for (const [key, value] of Object.entries(res.data)) {
          if (initialRedemption.hasOwnProperty(key)) {
            formik.setFieldValue(key, value);
          }
        }
        // formik.setValues(res.data)
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchRedemptionDetail();
    }
    fetchRedeemTypeList();
  }, [id]);

  const fetchCustomerBankDetail = async () => {
    await backendCustomersBankInfo({ customerid: customerId }).then((res) => {
      if (res.isError == false) {
        formik.setFieldValue("payment", res.data);
        // for (const [key, value] of Object.entries(res.data)) {
        //   if (initialRedemption.hasOwnProperty(key)) {
        //     formik.setFieldValue(`payment${[key]}`, value);
        //   }
        // }
      }
    });
  };

  const fatchCustomerBalance = async () => {
    await backendCustomersBalance({ customerid: customerId }).then((res) => {
      if (res.isError === false) {
        setBalancePoint(res.data.balance);
      }
      if (res.isError === false) {
        setcreaditPoint(res.data.creditpoint);
      }
      if (res.isError === false) {
        setpanVerified(res.data.panVerified);
      }
      if (res.isError === false) {
        setAadharverify(res.data.aadharVerified);
      }
      if (res.isError === false) {
        setBankVerify(res.data.bankVerified);
      }
    });
  };
  useEffect(() => {
    if (customerId) {
      fetchCustomerBankDetail();
      fatchCustomerBalance();
    }
  }, [customerId]);
  const fetchGiftData = async (giftid: string) => {
    await backendGetGiftInfo(giftid).then(async (res) => {
      if (!res.isError) {
        await setGiftPoint(res.data.points);
      }
    });
  };

  const fetchRedeemTypeList = async () => {
    await getRedeemTypeList().then(async (res) => {
      if (!res.isError) {
    
        await setRedeemTypeData(res.data);
      }
    });
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    if (name === "customerid") {
      setCustomerId(value);
    }
  };
  const handleFormSubmit = async () => {
    try {
      if (
        bankVerified == true &&
        aadharVerified == true &&
        panVerified == true
      ) {
        if (creaditPoint >=0) {
          alert("Now you are able Redem  ");
          if (formik.values.type == "Neft" || formik.values.type == "IMPS") {
            console.log("coming inside the ntf and the imps wala code")
            var iData = await {
              customerid: formik.values.customerid,
              points: formik.values.points,
              type: formik.values.type,
              isAdmin:true,
              payment: {
                 ifsc: formik.values.payment.ifsc, 
                accountNo: formik.values.payment.accountNo,
                holderName: formik.values.payment.holderName,
                bankName: formik.values.payment.bankName,
                amount: formik.values.payment.amount,
              },
            };
            await backendCustomerNeftRedemption(iData)
              .then((result) => {
                if (!result.isError) {
                  router.push("/redemption");
                } else {
                }
              })
              .catch((err) => {});
          }
          if (formik.values.type == "UPI") {

            console.log("coming inside the upi and the upi  wala code")
            var iUpiData = await {
              customerid: formik.values.customerid,
              points: formik.values.points,
              type: formik.values.type,
              payment: {
                upiNumber: formik.values.payment.upiNumber,
                amount: formik.values.payment.amount,
              },
              isAdmin:true
            };
            await backendCustomerUpiRedemption(iUpiData)
              .then((result) => {
                if (!result.isError) {
                  router.push("/redemption");
                } else {
                }
              })
              .catch((err) => {});
          }
        } else {
          alert("Unable to Redem you have less point");
        }
      } else {
        alert("your Kyc Document  is not verified!");
      }
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };
  const schema = yup.object().shape({
    customerid: yup.string().required("Customer is required"),
    points: yup.number().required("Points is required"),
    type: yup.string().required("Mode is required"),
    payment: yup.object().shape({
      upiNumber: yup.string(),
      accountNo: yup.string(),
      holderName: yup.string(),
      bankName: yup.string(),
      ifsc: yup.string(),
      amount: yup.number().min(1),
    }),
  });
  const formik = useFormik({
    initialValues: initialRedemption,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });
  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/redemption", label: "RedemptionList" }}
        itemlabel="Redemption List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h3 className="card-body mb-3">
                {id ? "Edit" : "Add"} Redemption
              </h3>
            </Col>
            <Card className="flat-card">
              <Row>
                <Col xl={6} md={6}>
                  <Row className="align-items-end card-body"></Row>
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
                        <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />
                        Save{" "}
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Row className="p-4">
                  <SelectCustomerList
                    handleInputChange={handleInputChange}
                    customerid={formik.values.customerid}
                  />
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="mb-1">
                      <Form.Label>Reddem Mode</Form.Label>
                      <Form.Select
                        name="type"
                        value={formik.values.type}
                        as="select"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                      >
                        <option value="">Select Reddem Type</option>
                        {Array.isArray(redeemTypeData) &&
                          redeemTypeData.map((item: any, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                      </Form.Select>
                      {formik.errors.type && (
                        <div className="text-danger">{formik.errors.type}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={2} sm={2} xs={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Points</Form.Label>
                      <Form.Control
                        type="text"
                        name="points"
                        value={formik.values.points}
                        onChange={handleInputChange}
                        required={true}
                        autoComplete="off"
                        readOnly={true}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} sm={2} xs={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Balance</Form.Label>
                      <Form.Control
                        type="text"
                        name="points"
                        value={balancePoint}
                        required={true}
                        autoComplete="off"
                        readOnly={true}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {formik.values.type === "Neft" || formik.values.type === "IMPS" ? (
                  <Row className="px-4">
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Points">Account Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.accountNo"
                          value={formik.values.payment?.accountNo}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Account Holder Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.holderName"
                          value={formik.values?.payment?.holderName}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.bankName"
                          value={formik.values?.payment?.bankName}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label>IFSC</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.ifsc"
                          value={formik.values?.payment?.ifsc}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ) : null}
                <Row className="px-4">
                  {formik.values.type === "UPI" ? (
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Points">Upi</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.upiNumber"
                          value={formik.values.payment.upiNumber}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                  ) : null}
                  {formik.values.type === "UPI" ||
                  formik.values.type === "Neft" || formik.values.type === "IMPS" ? (
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Points">Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="payment.amount"
                          value={formik.values.payment?.amount}
                          onChange={handleInputChange}
                          required={true}
                          autoComplete="off"
                        />
                        {formik.errors.payment?.amount && (
                          <div className="text-danger">
                            {formik.errors.payment?.amount}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  ) : null}
                </Row>
              </Row>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
