import React, { useEffect, useState } from "react";
// import Router, { useRouter } from 'next/router';
import Select from "react-select";

import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Image,
  Form,
  Spinner,
  InputGroup,
  Accordion,
} from "react-bootstrap";
import {
  Download,
  PencilSquare,
  PlusCircleFill,
  XCircleFill,
  XSquare,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendGetAllTransactions,
  backendDeleteTransaction,
  backendImportCouponsToScan,
  backendImportTransactions,
} from "../../helpers/backend_helper";
import {
  EDIT_DEMO_IMAGE,
  EXCEL_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
  WHITE_TRASH_IMAGE,
} from "../../utils/constant";
import * as XLSX from "xlsx";
import { read, utils, writeFile } from "xlsx";
import {
  TransFilterInterface,
  TransactionDetailViewInterface,
  TransactionScanInterface,
  initialFilterTrans,
} from "../../interfaces/transaction.interface";
import {
  PaginationTransInterface,
  ResPaginateInterface,
  initialPagination,
  initialResPaginate,
  initialTransPagination,
} from "../../interfaces/pagination.interface";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

import { handleExportTemplate } from "../../utils/utility";
import { useRouter } from "next/navigation";
import {
  TraansactionFilterInterface,
  initialFiltertransaction,
} from "../../interfaces/redemption.interface";
function CustomToggle(props: any) {
  const { eventKey } = props;
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );

  return (
    <button type="button" className="btn  btn-dark" onClick={decoratedOnClick}>
      Filter
    </button>
  );
}
interface KeyValue {
  [key: string]: any;
}
interface customerTypeOptions {
  label: string;
  options: string;
}
const Transaction = React.forwardRef((props, ref) => {
  const router = useRouter();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<
    Array<TransactionDetailViewInterface>
  >([]);
  const [paginationData, setPaginationData] =
    useState<PaginationTransInterface>(initialTransPagination);
  const [resPaginateData, setResPaginateData] =
    useState<ResPaginateInterface>(initialResPaginate);

  const [filterData, setFilterData] = useState<TraansactionFilterInterface>(
    initialFiltertransaction
  );
  const [requestFileData, setRequestFileData] = useState<KeyValue[]>([]);
  const [requestTransactionFileData, setRequestTransactionFileData] = useState<
    KeyValue[]
  >([]);
  const [importTransactionData, setImportTransactionData] = useState<
    Array<TransactionScanInterface>
  >([]);
  const transactionList = useSelector(
    (state: any) => state?.transactions?.transactions
  );
  const permissionData = useSelector(
    (state: any) => state?.permission?.permission
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "transactions.read":
          return { ...acc, canRead: true };
        case "transactions.update":
          return { ...acc, canUpdate: true };
        case "transactions.delete":
          return { ...acc, canDelete: true };
        case "transactions.create":
          return { ...acc, canCreate: true };
        case "transactions.export":
          return { ...acc, canExport: true };
        case "transactions.import":
          return { ...acc, canImport: true };

        default:
          return acc;
      }
    }, {});
  const dispatch = useDispatch();
  const fetchTransactions = async () => {
 
    await backendGetAllTransactions(paginationData).then((res) => {
      const { docs, paginate } = res.data;
      let totalData =
        Array.isArray(paginate) && paginate.length && paginate[0].totalDocs;
      setResPaginateData({
        ...resPaginateData,
        totalDocs: totalData,
        totalPages: Math.ceil(totalData / paginationData.recordPerPage),
      });
      setTransactionData(docs);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [paginationData, filterData]);

  const handleDeleteItem = (id: string) => {
    backendDeleteTransaction(id)
      .then((result) => {
        if (!result.isError) {
          fetchTransactions();
          // router.push('/transaction');
        } else {
        }
      })
      .catch((err) => {});
  };

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(
      transactionData.map(async (item: any) => {
        item.createdAt = item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "numeric",
            })
          : "";
        return item;
      })
    );
    console.log(mappedArray , "mappedArray")
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
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
      backendImportCouponsToScan(dataArray)
        .then((result) => {
          if (!result.isError) {
            router.refresh();
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
  const handleTransactionFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const newData = await readXlsxFile(file);
        await setRequestTransactionFileData(newData);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleFileUploadTransactionSubmit = async () => {
    try {
      const dataArray = Object.values(requestTransactionFileData);
      backendImportTransactions(dataArray)
        .then((result) => {
          if (!result.isError) {
            router.refresh();
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

  const handleExportTemplate = async () => {
    const headers = [{ points: "", customerid: "", pointType: "" }];
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(headers);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "transectionTemplate.xlsx");
  };
  const handleCouponExportTemplate = async () => {
    const headers = [{ coupon: "", customerid: "" }];
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(headers);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "qrscanTemplate.xlsx");
  };
  const customerTypeOptions  = [
    { value: 'Mechanic', label: 'Mechanic' },
    { value: 'Retailer', label: 'Retailer' },

  ]

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "Home" }}
        secondItem={{ href: "", label: "" }}
        itemlabel="Transaction List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={3}>
              <h3 className="card-body">
                Transaction List({resPaginateData.totalDocs})
              </h3>
            </Col>
            <Col md={2}>
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label className="p-2">Show</Form.Label>
                <Form.Select
                  value={paginationData.recordPerPage}
                  onChange={(e: any) => {
                    setPaginationData({
                      ...paginationData,
                      recordPerPage: e.target.value,
                    });
                  }}
                >
                  <option value={10}>{10}</option>
                  <option value={100}>{100}</option>
                  <option value={200}>{200}</option>
                  <option value={500}>{500}</option>
                  <option value={1000}>{1000}</option>
                  <option value={2000}>{2000}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group className="d-flex align-items-center mb-0">
                <Form.Label className="p-2">PointType</Form.Label>
                <Form.Select
                  value={paginationData.pointType}
                  onChange={(e: any) => {
                    setPaginationData({
                      ...paginationData,
                      pointType: e.target.value,
                    });
                  }}
                >
                  <option value={"Gajra Gro Loyalty Program"}>
                    Gajra Gro Loyalty Program
                  </option>

                  <option value={"Gajra Loyalty2"}>Gajra Loyalty2</option>
                  <option value={"MRP LABEL SCHEME"}>MRP LABEL SCHEME</option>
                  <option value={"Coupon Scan"}>Coupon Scan</option>
                  <option value="">All</option>
                </Form.Select>
              </Form.Group>
            </Col> */}

            <Row>
              <Col md={3}>
                <Form.Group className="form-group">
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setPaginationData({
                        ...paginationData,
                        search: e.target.value,
                      });
                    }}
                    value={paginationData.search}
                    autoComplete="off"
                    placeholder="Search"
                  />
                </Form.Group>
              </Col>{" "}
              <Col>
                {moduleAccess?.canExport && (
                  <Button
                    onClick={handleOnExport}
                    className="ml-15 m-3"
                    variant="outline-light"
                  >
                    <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
                  </Button>
                )}
              </Col>
              <Col className="text-end">
                {" "}
                {moduleAccess?.canCreate && (
                  <Link href={{ pathname: "/transaction/create" }}>
                    <Button className="mr-15 text-end" variant="dark">
                      <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />{" "}
                      Transaction
                    </Button>
                  </Link>
                )}
              </Col>
            </Row>
            <Row>
              <Col xl={12} sm={12} xs={12} className="text-end">
                <Accordion defaultActiveKey="0" className="mb-3">
                  <CustomToggle eventKey="1"></CustomToggle>
                  <Accordion.Collapse eventKey="1">
                    <Card className="text-start prod-p-card bg-white">
                      <Card.Body>
                        <Row>
                          <Col md={4} className="border-end">
                            <Row>
                              <Form.Label> Created Date</Form.Label>
                              <Form.Group
                                as={Row}
                                className="mb-4"
                                controlId="formHorizontalEmail"
                              >
                                <Col md={6}>
                                  <Form.Label> From</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => {
                                      setPaginationData({
                                        ...paginationData,
                                        startDate: e.target.value,
                                      });
                                    }}
                                    value={paginationData.startDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Start Date"
                                  />

                                  <Form.Label> To</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => {
                                      setPaginationData({
                                        ...paginationData,
                                        endDate: e.target.value,
                                      });
                                    }}
                                    value={paginationData.endDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="End Date"
                                  />
                                </Col>
                                {/* <Col sm={6}>
                                  <Form.Label> From</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => {
                                      setFilterData({
                                        ...filterData,
                                        startDate: e.target.value,
                                      });
                                    }}
                                    value={filterData.startDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Start Date"
                                  />
                                </Col>
                                <Col sm={6}>
                                  <Form.Label> To</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => {
                                      setFilterData({
                                        ...filterData,
                                        endDate: e.target.value,
                                      });
                                    }}
                                    value={filterData.endDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="End Date"
                                  />
                                </Col> */}
                              </Form.Group>
                            </Row>

                            <Form.Group className="mb-1">
      <Form.Label htmlFor="User">Customer Type</Form.Label>
      <Select
  options={customerTypeOptions}
  // value={customerTypeOptions.find(option => option.value === filterData?.customerType[0])}
  value={customerTypeOptions.find(option => option.value === paginationData?.customerType?.[0] ?? '')}

  onChange={(e :any) => {
    setPaginationData({
      ...paginationData,
      customerType: [e.value],
    });
  }}
  isSearchable={false}
/>
    </Form.Group>
                          </Col>
                          <Col md={4} className="border-end">
                            <h5>PointType</h5>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="pointType"
                                type="checkbox"
                                value="MRP LABEL SCHEME"
                                label="MRP LABEL SCHEME"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var pointType = paginationData.pointType
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.pointType)
                                      )
                                    : [];
                                  if (checked) {
                                    pointType.push(value);
                                  } else {
                                    pointType = pointType.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    pointType: Array.from(new Set(pointType)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.pointType)
                                    ? paginationData.pointType.some(
                                        (item) => item == "MRP LABEL SCHEME"
                                      )
                                    : false
                                }
                              />
                            </Col>

                            <Col className="form-check m-2">
                              <Form.Check
                                inline
                                className="form-check pt-4 pr-10"
                                name="pointType"
                                type="checkbox"
                                value="Gajra Gro Loyalty Program"
                                label="Gajra Gro Loyalty Program"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var pointType = paginationData.pointType
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.pointType)
                                      )
                                    : [];
                                  if (checked) {
                                    pointType.push(value);
                                  } else {
                                    pointType = pointType.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    pointType: Array.from(new Set(pointType)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.pointType)
                                    ? paginationData.pointType.some(
                                        (item) =>
                                          item == "Gajra Gro Loyalty Program"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2">
                              <Form.Check
                                inline
                                className="form-check pt-4 pr-10"
                                name="pointType"
                                type="checkbox"
                                value="Coupon Scan"
                                label="Coupon Scan"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var pointType = paginationData.pointType
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.pointType)
                                      )
                                    : [];
                                  if (checked) {
                                    pointType.push(value);
                                  } else {
                                    pointType = pointType.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    pointType: Array.from(new Set(pointType)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.pointType)
                                    ? paginationData.pointType.some(
                                        (item) => item == "Coupon Scan"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check  m-r-4"
                                name="pointType"
                                type="checkbox"
                                value="Gajra Loyalty2"
                                label="Gajra Loyalty2"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var pointType = paginationData.pointType
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.pointType)
                                      )
                                    : [];
                                  if (checked) {
                                    pointType.push(value);
                                  } else {
                                    pointType = pointType.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    pointType: Array.from(new Set(pointType)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.pointType)
                                    ? paginationData.pointType.some(
                                        (item) => item == "Gajra Loyalty2"
                                      )
                                    : false
                                }
                              />
                            </Col>
                          </Col>
                          <Col>
                            <Form.Check
                              inline
                              className="form-check  m-r-4"
                              name="pointType"
                              type="checkbox"
                              value="all"
                              label="All"
                              onChange={(e) => {
                                const { value, checked } = e.target;
                                var pointType = paginationData.pointType
                                  ? JSON.parse(
                                      JSON.stringify(paginationData.pointType)
                                    )
                                  : [];
                                if (checked) {
                                  pointType.push(value);
                                } else {
                                  pointType = pointType.paginationData(
                                    function (item: string) {
                                      return item !== value;
                                    }
                                  );
                                }
                                setPaginationData({
                                  ...paginationData,
                                  pointType: Array.from(new Set(pointType)),
                                });
                              }}
                              defaultChecked={
                                Array.isArray(paginationData.pointType)
                                  ? paginationData.pointType.some(
                                      (item) => item == "all"
                                    )
                                  : false
                              }
                            />
                          </Col>{" "}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Accordion.Collapse>
                </Accordion>
              </Col>
            </Row>
            {moduleAccess?.canImport && (
              <Row className="align-items-center mb-4">
                <Col md={6}>
                  <h5 className="card-body">Coupon Scan</h5>
                  <Row className="align-items-center mb-4">
                    <Col md={4}>
                      {moduleAccess?.canImport ? (
                        <Button
                          onClick={handleCouponExportTemplate}
                          className="btn btn-dark p-2 pr-2"
                          variant="outline-light"
                        >
                          <Download /> Template
                        </Button>
                      ) : null}
                    </Col>
                    <Col md={8}>
                      <InputGroup>
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
                  </Row>
                </Col>
                <Col md={6}>
                  <h5 className="card-body">Other Transection</h5>
                  <Row className="align-items-center mb-4">
                    <Col md={4}>
                      {moduleAccess?.canImport ? (
                        <Button
                          onClick={handleExportTemplate}
                          className="btn btn-dark p-2 pr-2"
                          variant="outline-light"
                        >
                          <Download /> Template
                        </Button>
                      ) : null}
                    </Col>
                    <Col md={8}>
                      <InputGroup>
                        <Form.Control
                          type="file"
                          accept=".xlsx"
                          onChange={handleTransactionFileChange}
                        />
                        <Button
                          className="btn btn-dark"
                          onClick={handleFileUploadTransactionSubmit}
                        >
                          {" "}
                          Upload
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}

            <Card className="flat-card p-0">
              <div className="row-table">
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Firm Name</th>
                              <th>Contact Person</th>
                              <th>Points</th>
                              <th>Coupon</th>
                              <th>GG No</th>
                              <th>Category</th>
                              <th>PointType</th>
                              <th>Packing Slip No.</th>
                              <th>Date</th>
                              <th>Action</th>
                              <th>Created By</th>

                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(transactionData) &&
                              transactionData.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.refno}</td>
                                    <td className="text-black">
                                      <Link
                                        className="mb-2"
                                        href={{
                                          pathname: "/transaction/" + item._id,
                                        }}
                                      >
                                        {item.firmName}
                                      </Link>
                                    </td>
                                    <td className="text-black">
                                      <Link
                                        className="mb-3"
                                        href={{
                                          pathname: "/transaction/" + item._id,
                                        }}
                                      >
                                        {item.contactPerson}
                                      </Link>
                                    </td>
                                    <td>{item.points}</td>
                                    <td>{item.coupon}</td>
                                    <td>{item.productNo}</td>
                                    <td>{item.categoryName}</td>

                                    <td>{item.pointType}</td>
                                    <td>{item.packingList || '-'}</td>

                                    <td>{item.createdAt}</td>
                                    <td>
                                      {moduleAccess?.canUpdate && (
                                        <Link
                                          className="pt-2"
                                          href={{
                                            pathname: "/transaction/create",
                                            query: { id: item._id },
                                          }}
                                        >
                                          <Button
                                            className="p-0"
                                            variant="outline-light"
                                          >
                                            <Image
                                              src={IMAGE_URL + EDIT_DEMO_IMAGE}
                                            />
                                          </Button>
                                        </Link>
                                      )}
                                      {moduleAccess?.canDelete && (
                                        <Button
                                          className="p-2"
                                          variant="outline-light"
                                          onClick={() => {
                                            handleDeleteItem(item._id);
                                          }}
                                        >
                                          <Image
                                            src={IMAGE_URL + RED_TRASH_IMAGE}
                                          />
                                        </Button>
                                      )}
                                    </td>
                                    <td>{item.creadtedByContactPerson}</td>

                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                        {isLoading ? (
                          <Col
                            xl={12}
                            sm={12}
                            xs={12}
                            className="mb-3 text-center"
                          >
                            <Spinner animation="border" />
                          </Col>
                        ) : null}
                        <Col xl={12} sm={12} xs={12} className="mb-3 text-end">
                          <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                              <li
                                className={`page-item ${
                                  paginationData.currentPage === 1
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <a
                                  className="page-link"
                                  onClick={() => {
                                    setPaginationData({
                                      ...paginationData,
                                      currentPage:
                                        paginationData.currentPage - 1,
                                    });
                                    router.push(
                                      `/transaction/?page=${
                                        paginationData.currentPage - 1
                                      }`
                                    );
                                  }}
                                >
                                  Previous
                                </a>
                              </li>

                              <li
                                className={`page-item ${
                                  paginationData.currentPage ===
                                  resPaginateData.totalPages
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <a
                                  className="page-link"
                                  onClick={() => {
                                    setPaginationData({
                                      ...paginationData,
                                      currentPage:
                                        paginationData.currentPage + 1,
                                    });
                                    router.push(
                                      `/transaction/?page=${
                                        paginationData.currentPage + 1
                                      }`
                                    );
                                  }}
                                >
                                  Next
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </Col>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
});
export default Transaction;
