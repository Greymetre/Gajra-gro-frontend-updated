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
  Offcanvas,
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
import PaginationNav from "../../components/Common/PaginationNav";
import {
  backendGetAllTransactions,
  backendDeleteTransaction,
  backendImportCouponsToScan,
  backendImportTransactions,
  backendGetTransactionPointTypes,
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

import { handleExportTemplate } from "../../utils/utility";
import { useRouter } from "next/navigation";
import {
  TraansactionFilterInterface,
  initialFiltertransaction,
} from "../../interfaces/redemption.interface";
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
  // Changing a filter starts again from the first page; both updates render together.
  const updateFilterData = (data: typeof filterData) => {
    setFilterData(data);
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };
  // Filter drawer; point type options are loaded from the backend (scheme names and types in use)
  const [showFilters, setShowFilters] = useState(false);
  const [pointTypeOptions, setPointTypeOptions] = useState<Array<{ value: string; label: string }> | null>(null);
  useEffect(() => {
    backendGetTransactionPointTypes()
      .then((res: any) => {
        const types: string[] = Array.isArray(res?.data) ? res.data : [];
        setPointTypeOptions([
          { value: "all", label: "All credits (Cr)" },
          ...types.map((type) => ({ value: type, label: type })),
        ]);
      })
      .catch(() => setPointTypeOptions([{ value: "all", label: "All credits (Cr)" }]));
  }, []);
  const clearAllFilters = () =>
    setPaginationData({ ...paginationData, currentPage: 1, startDate: "", endDate: "", customerType: [], pointType: [] });
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
                      currentPage: 1,
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
                  <option value={5000}>5000</option>
                  <option value={10000}>10000</option>
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
                      currentPage: 1,
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
                        currentPage: 1,
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
                <Button variant="dark" className="ms-2" onClick={() => setShowFilters(true)}>
                  <Image src={IMAGE_URL + WHITE_FILTER_IMAGE} /> Filters
                </Button>
              </Col>
            </Row>
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                  Filters{" "}
                  <span className="badge rounded-pill bg-light text-dark border ms-1">
                    {(resPaginateData.totalDocs ?? 0).toLocaleString("en-IN")}
                  </span>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Created Date</Form.Label>
                  <Row>
                    <Col xs={6}>
                      <Form.Label className="small text-muted">From</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        max={paginationData.endDate || undefined}
                        onChange={(e) => setPaginationData({ ...paginationData, currentPage: 1, startDate: e.target.value })}
                        value={paginationData.startDate}
                        autoComplete="off"
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Label className="small text-muted">To</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        min={paginationData.startDate || undefined}
                        onChange={(e) => setPaginationData({ ...paginationData, currentPage: 1, endDate: e.target.value })}
                        value={paginationData.endDate}
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="transactionCustomerType" className="fw-semibold">Customer Type</Form.Label>
                  <Select
                    inputId="transactionCustomerType"
                    options={customerTypeOptions}
                    value={customerTypeOptions.find((option) => option.value === paginationData?.customerType?.[0]) || null}
                    onChange={(e: any) =>
                      setPaginationData({ ...paginationData, currentPage: 1, customerType: e ? [e.value] : [] })
                    }
                    isClearable
                    isSearchable={false}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="transactionPointType" className="fw-semibold">Point Type / Scheme</Form.Label>
                  <Select
                    inputId="transactionPointType"
                    isMulti
                    isClearable
                    isLoading={pointTypeOptions === null}
                    placeholder="All transactions"
                    options={pointTypeOptions || []}
                    value={(pointTypeOptions || []).filter((option) =>
                      (paginationData.pointType || []).includes(option.value)
                    )}
                    onChange={(selected: any) =>
                      setPaginationData({
                        ...paginationData,
                        currentPage: 1,
                        pointType: (selected || []).map((option: any) => option.value),
                      })
                    }
                  />
                  <Form.Text className="text-muted">Schemes come from Loyalty Scheme, plus every type already used</Form.Text>
                </Form.Group>

                <div className="d-flex gap-2 pt-2">
                  <Button variant="outline-secondary" className="flex-fill" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                  <Button variant="dark" className="flex-fill" onClick={() => setShowFilters(false)}>
                    Show {(resPaginateData.totalDocs ?? 0).toLocaleString("en-IN")} transactions
                  </Button>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
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

            <Col xl={12} sm={12} xs={12} className="mb-2">
              <PaginationNav
                align="start"
                currentPage={paginationData.currentPage}
                totalPages={resPaginateData.totalPages}
                disabled={isLoading}
                onPageChange={(page) =>
                  setPaginationData({ ...paginationData, currentPage: page })
                }
              />
            </Col>
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
