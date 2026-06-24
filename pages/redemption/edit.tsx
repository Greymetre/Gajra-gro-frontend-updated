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
  backendGetRedemptionInfo,
  backendCustomersBalance,
  backendPatchUpdateRedemption,
} from "../../helpers/backend_helper";
import { IMAGE_URL, WHITE_CHECKED_IMAGE } from "../../utils/constant";

import {
  RedemptionCreateInterface,
  RedemptionDetailViewInterface,
  initialRedemption,
  updateRedemptionData,
} from "../../interfaces/redemption.interface";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
export default function RedemptionSave() {
  const router = useRouter();

  const { id } = router.query;
  const [customerId, setCustomerId] = useState("");
  const [redemptionInfo, setRedemptionInfo] =
    useState<RedemptionDetailViewInterface>({ _id: id });
  const [balancePoint, setBalancePoint] = useState(0);
  const fetchRedemptionDetail = async () => {
    await backendGetRedemptionInfo(id).then((res) => {
      if (!res.isError) {
        setRedemptionInfo(res.data);
        setCustomerId(res.data.customerid);
        for (const [key, value] of Object.entries(res.data)) {
          if (updateRedemptionData.hasOwnProperty(key)) {
            formik.setFieldValue(key, value);
          }
        }
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchRedemptionDetail();
    }
  }, [id]);

  const fatchCustomerBalance = async () => {
    await backendCustomersBalance({ customerid: customerId }).then((res) => {
      if (res.isError === false) {
        setBalancePoint(res.data.balance);
      }
    });
  };
  useEffect(() => {
    fatchCustomerBalance();
  }, [customerId]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };
  const handleFormSubmit = async () => {
    try {
      await backendPatchUpdateRedemption(id, formik.values)
        .then((result) => {
          if (!result.isError) {
            router.push("/redemption");
          } else {
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };
  const schema = yup.object().shape({
    // amount: yup.number().required("Amount is required"),
    status: yup.string().required("Status is required"),
    details: yup.string(),
    transactionID: yup.string(),
  });
  const formik = useFormik({
    initialValues: updateRedemptionData,
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
                  <Col md={3} sm={3} xs={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Customer Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={redemptionInfo.firmName}
                        readOnly={true}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={3} xs={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Reddem Mode</Form.Label>
                      <Form.Control
                        type="text"
                        value={redemptionInfo.type}
                        readOnly={true}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3} sm={3} xs={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="payment.amount"
                        // value={formik.values.amount}
                        value={redemptionInfo.amount}
                        onChange={handleInputChange}
                        required={true}
                        autoComplete="off"
                      />
                      {/* {formik.errors.amount && (
                        <div className="text-danger">
                         {formik.errors.amount} 
                        </div>
                      )} */}
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={3} xs={12}>
                    <Form.Group className="mb-1">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formik.values.status}
                        as="select"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                      >
                        <option value="">Select Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Success">Success</option>
                        <option value="Inverification">Inverification</option>
                      </Form.Select>
                      {formik.errors.status && (
                        <div className="text-danger">
                          {formik.errors.status}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                {redemptionInfo.type === "Neft" ? (
                  <Row className="px-4">
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Points">Account Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={redemptionInfo.accountNo}
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
                          value={redemptionInfo.holderName}
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
                          value={redemptionInfo.bankName}
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
                          value={redemptionInfo.ifsc}
                          readOnly={true}
                          disabled={true}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ) : null}
                <Row className="px-4">
                  {redemptionInfo.type === "Upi" ? (
                    <Col md={3} sm={3} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Points">Upi</Form.Label>
                        <Form.Control
                          type="text"
                          value={redemptionInfo.upiNumber}
                          readOnly={true}
                          disabled={true}
                        />
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
