import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Card,
  FormLabel,
  Image,
  InputGroup,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";

import Layout from "../../components/Layout";
import {
  backendPostAddNewProduct,
  backendPostProductStatus,
  backendPatchUpdateProduct,
  backendGetProductInfo,
  backendImportProducts,
} from "../../helpers/backend_helper";
import SelectCategorySubCategory from "../../components/InputFields/SelectCategorySubCategory";
import Router, { useRouter } from "next/router";
import {
  CreateProductInterface,
  ProductViewInterface,
  initialProduct,
  initialProductDetail,
} from "../../interfaces/product.interface";
import { objectAppendIntoformData } from "../../utils/utility";
import {
  BLACK_PLUS_CIRCLE_IMAGE,
  BLUE_PLUS_CIRCLE_IMAGE,
  RED_TRASH_IMAGE,
  WHITE_CHECKED_IMAGE,
  IMAGE_URL,
  RECTANGLE_DEMO_IMAGE,
} from "../../utils/constant";

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
import * as XLSX from "xlsx";
import ProductDetail from "./[id]";
interface KeyValue {
  [key: string]: any;
}
import { read, utils, writeFile } from "xlsx";
import { Download } from "react-bootstrap-icons";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(150, "Maximum 130 characters")
    .required("productname is required"),
  brand: yup.string().min(3).required("brand is required"),
  model: yup.string().required("brand is required"),
  discount: yup.string().required("discount is required"),
  productDetail: yup.array().of(
    yup.object().shape({
      price: yup.number().required("price is required"),
      mrp: yup.number().required("mrp Name is required"),
      partNo: yup.string().required("  partNo is required"),
      specification: yup.string().required("  specification Name is required"),
    }),
  ),
  ranking: yup.number().required("ranking is required"),
  description: yup.string().required("   description is required"),
  productNo: yup
    .string()
    .min(2, "Mininum 2 characters")
    .max(70, "Maximum 70 characters")
    .required("productNo is required"),
  points: yup.number(),
});

function readXlsxFile(file: File): Promise<KeyValue[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Convert the array of arrays into an array of objects with key-value pairs
      const keys = jsonData[0];
      const values = jsonData.slice(1);
      const dataObjects = values.map((value: any) => {
        const obj: KeyValue = {};
        Array.isArray(keys) &&
          keys.forEach((key: string, index: number) => {
            obj[key] = value[index];
          });
        return obj;
      });
      resolve(dataObjects);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsArrayBuffer(file);
  });
}

export default function ProductSave() {
  const router = useRouter();
  const { id } = router.query;
  const fetchProductDetail = async () => {
    await backendGetProductInfo(id).then((res) => {
      if (!res.isError) {
        formik.setValues(res.data);
      }
    });
  };
  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);
  const [requestData, setRequestData] =
    useState<CreateProductInterface>(initialProduct);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [requestDetailData, setRequestDetailData] =
    useState(initialProductDetail);
  const [requestFileData, setRequestFileData] = useState<KeyValue[]>([]);
  const [fileHeader, setFileHeader] = useState<File | undefined>(undefined);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const newData = await readXlsxFile(file);
        await setRequestFileData(newData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileUploadSubmit = async () => {
    try {
      const dataArray = Object.values(requestFileData);
      backendImportProducts(dataArray)
        .then((result) => {
          console.log(result);
          if (!result.isError) {
            router.push("/products");
          } else {
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

const handleFormSubmit = async () => {
  try {
const formData = new FormData();

const payload = {
  ...formik.values,
  images: imageFile
    ? [
        {
          image: imageFile,
        },
      ]
    : [],
};

const iData = await objectAppendIntoformData(
  formData,
  payload,
  ""
);

    if (imageFile) {
      iData.append("images", imageFile);
    }

    [
      "_id",
      "active",
      "createdAt",
      "categoryName",
      "subcategoryName",
      "featured",
    ].forEach((e) => iData.delete(e));

    // ✅ Console FormData Payload
    console.log("===== FORM DATA PAYLOAD =====");

    for (let pair of iData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // OPTIONAL: convert into normal object
    const payloadObject: any = {};

    iData.forEach((value:any, key:number) => {
      payloadObject[key] = value;
    });

    console.log("Payload Object:", payloadObject);
    // return
    var actionSubmit = formik.values._id
      ? backendPatchUpdateProduct(formik.values._id, iData)
      : backendPostAddNewProduct(iData);

    actionSubmit
      .then((result) => {
        if (!result.isError) {
          formik.setSubmitting(true);
          router.push("/products");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log(e, "Error in the Login");
  }
};

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      brand: "",
      productDetail: [
        {
          mrp: 1,
          price: 1,
          partNo: "1",
          specification: "",
        },
      ],
      measurement: {
        weight: "",
        pcs: "",
        size: "",
      },
      productNo: "",
      model: "",
      discount: 1,
      ranking: 1,
      points: 0,
      categoryid: "",
      subcategoryid: "",
      description: "",
      active: true,
      isNewLaunch: false,
    },
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });

  const onRemoveClick = () => {
    formik.setFieldValue(
      "productDetail",
      formik.values.productDetail.filter((productDetail) => !productDetail),
    );
  };

  const handleExportTemplate = async () => {
    const headers = [
      {
        name: "",
        description: "",
        productNo: "",
        categoryid: "",
        subcategoryid: "",
        brand: "",
        weight: "",
        pcs: "",
        size: "",
        model: "",
        mrp: "",
        price: "",
        partNo: "",
        specification: "",
        points: "",
      },
    ];
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(headers);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "productTemplate.xlsx");
  };

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "Home" }}
        secondItem={{ href: "/products", label: "ProductList" }}
        itemlabel="Product List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={3}>
              <h3 className="card-body mb-0">
                {id ? "Edit" : "Add"} Product Profile
              </h3>
            </Col>
            <Col md={2}>
              <Button
                onClick={handleExportTemplate}
                className="p-2 pr-2"
                variant="outline-light"
              >
                <Download /> Template
              </Button>
            </Col>
            <Col md={4}>
              <InputGroup className="mb-3">
                <Form.Control
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
                <Button
                  className="btn btn-dark"
                  onClick={handleFileUploadSubmit}
                >
                  {" "}
                  Upload
                </Button>
              </InputGroup>
            </Col>
            <Col md={3} className="text-end">
              <Card.Body>
                <div className="form-group d-flex align-items-center justify-content-end mb-0">
                  <Form.Group>
                    <Form.Label className="d-block m-r-10"></Form.Label>
                    <div className="form-check form-switch custom-control-inline">
                      <Form.Check
                        inline
                        name="active"
                        type="checkbox"
                        // onChange={(e) => {
                        //     setRequestData({
                        //         ...requestData,
                        //         active : e.target.checked
                        //     });
                        // }}
                        // defaultChecked={requestData.active}
                      />
                    </div>
                  </Form.Group>
                </div>
              </Card.Body>
            </Col>
            {Array.isArray(requestFileData) && requestFileData.length ? (
              <Card className="flat-card">
                <Row>
                  <Col xl={6} md={6}></Col>
                  <Col xl={6} md={6}>
                    <Row className="align-items-end card-body">
                      <Col xl={12} md={12} className="text-end">
                        <Button
                          className="btn btn-dark"
                          onClick={handleFileUploadSubmit}
                        >
                          {" "}
                          <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />{" "}
                          Upload{" "}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        {Object.keys(requestFileData[0]).map((key, index) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(requestFileData) &&
                        requestFileData.map((item, index) => {
                          return (
                            <tr>
                              {Object.keys(requestFileData[0]).map(
                                (key, indexrow) => (
                                  <td key={index + "_" + indexrow}>
                                    {item[key]}
                                  </td>
                                ),
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Row>
              </Card>
            ) : (
              <Card className="flat-card">
                <Row>
                  <Col xl={6} md={6}>
                    <Row className="align-items-center card-body">
                      {Array.isArray(requestData.images) &&
                        requestData.images.map((image, index) => (
                          <Col xl={6} md={6}>
                            <div className="position-relative d-inline-block">
                              <div className="avatar-upload">
                                <div className="avatar-edit">
                                  <Form.Group
                                    controlId="formFile"
                                    className="mb-3"
                                    key="index"
                                  >
                                    <Form.Label>
                                      <Image
                                        src={IMAGE_URL + BLUE_PLUS_CIRCLE_IMAGE}
                                      />
                                    </Form.Label>
                                    <Form.Control
                                      type="file"
                                      name="images"
                                      accept="image/*"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        setImageFile(
                                          event?.target?.files?.[0]!,
                                        );
                                      }}
                                      required={true}
                                    />
                                  </Form.Group>
                                </div>
                                <div className="avatar-preview">
                                  <Image
                                    id="imagePreview"
                                    src={IMAGE_URL + RECTANGLE_DEMO_IMAGE}
                                    style={{ borderRadius: "100%" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                        ))}
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
                          <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />{" "}
                          Save{" "}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Row className="p-4">
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ProductName">
                          Product Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleInputChange}
                          value={formik.values.name}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Product Name"
                        />
                        {formik.errors.name && (
                          <div className="text-danger">
                            {formik.errors.name}
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
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Brand Name"
                        />
                        {formik.errors.brand && (
                          <div className="text-danger">
                            {formik.errors.brand}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ModelName">Model Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="model"
                          onChange={handleInputChange}
                          value={formik.values.model}
                          onBlur={formik.handleBlur}
                          required={true}
                          autoComplete="off"
                          placeholder="Enter Model Name"
                        />
                        {formik.errors.model && (
                          <div className="text-danger">
                            {formik.errors.model}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Contactperson">
                          Discount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="discount"
                          value={formik.values.discount.toString()}
                          onChange={handleInputChange}
                          onBlur={formik.handleBlur}
                          autoComplete="off"
                          placeholder="Discount"
                        />
                        {formik.errors.discount && (
                          <div className="text-danger">
                            {formik.errors.discount}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ranking">Ranking</Form.Label>
                        <Form.Control
                          type="number"
                          name="ranking"
                          onChange={handleInputChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ranking.toString()}
                          autoComplete="off"
                          placeholder="Ranking"
                        />
                        {formik.errors.ranking && (
                          <div className="text-danger">
                            {formik.errors.ranking}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4} sm={6} xs={12}>
  <Form.Group className="form-group mt-3">
    <Form.Check
      type="checkbox"
      label="New Launch Product"
      name="isNewLaunch"
      checked={formik.values.isNewLaunch}
      onChange={(e) => {
        formik.setFieldValue("isNewLaunch", e.target.checked);
      }}
    />
  </Form.Group>
</Col>
                    <SelectCategorySubCategory
                      handleInputChange={handleInputChange}
                      categoryid={formik.values.categoryid}
                      subcategoryid={formik.values.subcategoryid}
                    />
                    <Col md={4} sm={6} xs={12}>
                      <Form.Label>Points</Form.Label>
                      <Form.Control
                        className="mb-1"
                        name="points"
                        value={formik.values.points}
                        onChange={handleInputChange}
                        required={true}
                        type="number"
                        autoComplete="off"
                        placeholder="Enter Points"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Label>GG No</Form.Label>
                      <Form.Control
                        className="mb-1"
                        name="productNo"
                        value={formik.values.productNo}
                        onChange={handleInputChange}
                        required={true}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter GG NO"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Label>Weight</Form.Label>
                      <Form.Control
                        className="mb-1"
                        name="measurement.weight"
                        value={formik.values?.measurement?.weight}
                        onChange={handleInputChange}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Weight"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Label>Pcs</Form.Label>
                      <Form.Control
                        className="mb-1"
                        name="measurement.pcs"
                        value={formik.values?.measurement?.pcs}
                        onChange={handleInputChange}
                        required={true}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter PCS"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Label>Size</Form.Label>
                      <Form.Control
                        className="mb-1"
                        name="measurement.size"
                        value={formik.values?.measurement?.size}
                        onChange={handleInputChange}
                        required={true}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Size"
                      />
                    </Col>
                    <Col md={6} sm={6} xs={6}>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="description">
                          ProductDescription
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          onChange={handleInputChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          autoComplete="off"
                          as="textarea"
                          placeholder="description"
                        />
                        {formik.errors.description && (
                          <div className="text-danger">
                            {formik.errors.description}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} sm={12} xs={12} className="p-2">
                      <h4>Product Details</h4>
                    </Col>

                    <Col md={12}>
                      <FieldArray
                        name="productDetail"
                        validateOnChange={false}
                        render={(arrayHelpers) => (
                          <div>
                            {formik.values.productDetail.map(
                              (productdetail, index) => (
                                <div key={index}>
                                  <Row>
                                    <Col md={4} sm={6} xs={12}>
                                      <Form.Label htmlFor="endedAt">
                                        PartNo.
                                      </Form.Label>
                                      <Form.Control
                                        name={`productDetail[${index}].partNo`}
                                        value={
                                          formik.values.productDetail[index]
                                            .partNo
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        className="mb-1"
                                        // onBlur={formik.handleBlur}
                                        autoComplete="off"
                                        placeholder="Enter partno"
                                        type="text"
                                      />
                                    </Col>

                                    <Col md={4} sm={6} xs={12}>
                                      <Form.Label htmlFor="endedAt">
                                        MRP
                                      </Form.Label>
                                      <Form.Control
                                        className="mb-1"
                                        name={`productDetail.${index}.mrp`}
                                        type="number"
                                        value={
                                          formik.values.productDetail[index].mrp
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        //onBlur={formik.handleBlur}
                                        autoComplete="off"
                                        placeholder="Enter   specification"
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col md={4} sm={6} xs={12}>
                                      <Form.Label htmlFor="endedAt">
                                        Price
                                      </Form.Label>
                                      <Form.Control
                                        className="mb-1"
                                        name={`productDetail.${index}.price`}
                                        value={
                                          formik.values.productDetail[index]
                                            .price
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        type="number"
                                        //onBlur={formik.handleBlur}
                                        autoComplete="off"
                                        placeholder="Enter  price"
                                      />
                                    </Col>

                                    <Col md={4} sm={6} xs={12}>
                                      <Form.Label htmlFor="endedAt">
                                        Specification
                                      </Form.Label>
                                      <Form.Control
                                        className="mb-1"
                                        name={`productDetail.${index}.specification`}
                                        value={
                                          formik.values.productDetail[index]
                                            .specification
                                        }
                                        onChange={handleInputChange}
                                        required={true}
                                        type="text"
                                        //onBlur={formik.handleBlur}
                                        autoComplete="off"
                                        placeholder="Enter   specification"
                                      />
                                    </Col>

                                    <Col md={1} sm={2} xs={12} className="mt-4">
                                      <div onChange={onRemoveClick}>
                                        {" "}
                                        <Image
                                          src={IMAGE_URL + RED_TRASH_IMAGE}
                                          style={{ borderRadius: "100%" }}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              ),
                            )}

                            <Form.Control
                              type="file"
                              name="images"
                              accept="image/*"
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                setImageFile(event.currentTarget.files?.[0]);
                              }}
                            />
                          </div>
                        )}
                      />
                    </Col>
                  </Row>

                  <Row className="align-items-end mt-5">
                    <Col xl={12} md={12} className="text-start">
                      <div>
                        <div
                          onClick={() => {
                            const newTodos = [
                              ...formik.values.productDetail,
                              {
                                detailName: "",
                              },
                            ];
                            formik.setFieldValue("productDetail", newTodos);
                          }}
                        >
                          <Image
                            src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE}
                            style={{ borderRadius: "100%" }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Card>
            )}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
