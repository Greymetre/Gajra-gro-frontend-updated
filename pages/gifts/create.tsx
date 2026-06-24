import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  Button,
  Row,
  Image,
  Col,
  Form,
  Card,
  FormLabel,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendPostAddNewGift,
  backendPostGiftStatus,
  backendPatchUpdateGift,
  backendGetGiftInfo,
} from "../../helpers/backend_helper";
import {
  BLUE_PLUS_CIRCLE_IMAGE,
  IMAGE_URL,
  RECTANGLE_DEMO_IMAGE,
  WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { GiftInterface } from "../../interfaces/gift.interface";
import { objectAppendIntoformData } from "../../utils/utility";
import { Formik, FormikHelpers, useFormik, useFormikContext } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  brand: yup.string().min(3).required("brand is required"),

  giftName: yup
    .string()
    .min(3, "must be in 3 character ")
    .required("GiftName is required"),
  model: yup.string().required("model is required"),
  mrp: yup.number().required("mrp is required"),
  price: yup.number().required("price is required"),
  points: yup.number().required("points Name is required"),
  giftType: yup.string().required("giftType is required"),
  giftDescription: yup.string().required("description is required"),

  //    images: yup.array()
  //    .required('images required'),
});

export default function GiftSave() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const [requestData, setRequestData] = useState<GiftInterface>({});
  const [imagesFile, setImagesFile] = useState<File | undefined>(undefined);
  const fetchGiftDetail = async () => {
    await backendGetGiftInfo(id).then((res: any) => {
      if (!res.isError) {
        formik.setValues(res.data);
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchGiftDetail();
    }
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    // if (type === "number") {
    //     formik.setFieldValue({ ...value, [name]: parseInt(value) })
    //     console.log("Form::onChange", event);
    // }
    // else {
    //     formik.setFieldValue({ ...value, [name]: value})
    //     console.log("Form::onChange", event);
    // }
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();

      const iData = await objectAppendIntoformData(formData, formik.values, "");

      await iData.append("images", imagesFile);

      ["_id", "active", "createdAt", "expirydate"].forEach((e) =>
        iData.delete(e)
      );

      var actionSubmit = (await formik.values._id)
        ? backendPatchUpdateGift(formik.values._id, iData)
        : backendPostAddNewGift(iData);
      actionSubmit
        .then((result) => {
          if (!result.isError) {
            router.push("/gifts");

            formik.setSubmitting(true);
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: {
      _id: "",
      giftName: "",
      brand: "",
      model: "",
      price: 1,
      giftDescription: "",
      mrp: 1,
      giftType: "",
      points: 1,

      active: true,
    },
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });

  console.log(formik.values);
  console.log("error", formik.errors);

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/gifts", label: "GiftList" }}
        itemlabel="Gift List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6} className="align-items-center mb-4">
              <h3 className="card-body mb-0">{id ? "Edit" : "Add"} Gift</h3>
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
                                accept="image/*"
                                name="images"
                                //   onChange={(event) => {
                                //    formik.setFieldValue("images",event.target.files);}}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setImagesFile(event?.target?.files?.[0]!);
                                }}
                                required={true}
                              />
                            </Form.Group>
                          </div>
                          <div className="avatar-preview">
                            <Image
                              id="imagePreview2"
                              className="width120"
                              src={
                                requestData.images
                                  ? IMAGE_URL + requestData.images
                                  : IMAGE_URL + RECTANGLE_DEMO_IMAGE
                              }
                              style={{ borderRadius: "100%" }}
                            />
                          </div>
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
                        <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Row className="p-4">
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="FirmName">Gift Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="giftName"
                        onChange={handleInputChange}
                        value={formik.values.giftName}
                        required={true}
                        onBlur={formik.handleBlur}
                        autoComplete="off"
                        placeholder="Gift Name"
                      />
                      {formik.errors.giftName && (
                        <div className="text-danger">
                          {formik.errors.giftName}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="BrandName">Brand Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        onChange={handleInputChange}
                        value={formik.values.brand}
                        required={true}
                        autoComplete="off"
                        placeholder="Brand Name"
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.brand && (
                        <div className="text-danger">{formik.errors.brand}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Gifttype">Model Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        onBlur={formik.handleBlur}
                        onChange={handleInputChange}
                        value={formik.values.model}
                        required={true}
                        autoComplete="off"
                        placeholder="model"
                      />
                      {formik.errors.model && (
                        <div className="text-danger">{formik.errors.model}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Prce">Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        onBlur={formik.handleBlur}
                        onChange={handleInputChange}
                        value={formik.values.price.toString()}
                        required={true}
                        autoComplete="off"
                      />
                      {formik.errors.price && (
                        <div className="text-danger">{formik.errors.price}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="MRP">MRP</Form.Label>
                      <Form.Control
                        type="number"
                        name="mrp"
                        onBlur={formik.handleBlur}
                        onChange={handleInputChange}
                        value={formik.values.mrp.toString()}
                        required={true}
                        autoComplete="off"
                      />
                      {formik.errors.mrp && (
                        <div className="text-danger">{formik.errors.mrp}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Points">Points</Form.Label>
                      <Form.Control
                        type="number"
                        name="points"
                        onBlur={formik.handleBlur}
                        onChange={handleInputChange}
                        value={formik.values.points.toString()}
                        required={true}
                        autoComplete="off"
                      />
                      {formik.errors.points && (
                        <div className="text-danger">
                          {formik.errors.points}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="giftType">Gift Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="giftType"
                        onChange={handleInputChange}
                        value={formik.values.giftType}
                        required={true}
                        autoComplete="off"
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.giftType && (
                        <div className="text-danger">
                          {formik.errors.giftType}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6} sm={6} xs={12}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="FirmName">
                        GiftDescription
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="giftDescription"
                        onChange={handleInputChange}
                        value={formik.values.giftDescription}
                        required={true}
                        onBlur={formik.handleBlur}
                        autoComplete="off"
                        placeholder="giftDescription"
                        as="textarea"
                        rows={3}
                      />
                      {formik.errors.giftDescription && (
                        <div className="text-danger">
                          {formik.errors.giftDescription}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Row>
            </Card>
          </Row>
        </Col>
        {/* );
}}
</Formik> */}
      </Row>
    </Layout>
  );
}
