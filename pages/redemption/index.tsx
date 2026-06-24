import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Image,
  Form,
  Accordion,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  PencilSquare,
  PlusCircleFill,
  XCircleFill,
  XSquare,
  Download,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendGetAllRedemptions,
  backendDeleteRedemption,
  getRedeemTypeList,
  backendBulkStatusChangeRedemption,
} from "../../helpers/backend_helper";
import editimg from "../../assets/images/auth/edit-3.svg";
import {
  EDIT_DEMO_IMAGE,
  EXCEL_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
} from "../../utils/constant";
import {
  RedemptionDetailViewInterface,
  RedemptionFilterInterface,
  initialFilterRedemption,
} from "../../interfaces/redemption.interface";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import {
  PaginationInterface,
  ResPaginateInterface,
  initialPagination,
  initialResPaginate,
} from "../../interfaces/pagination.interface";
// import DatePicker from 'react-datepicker';
import { read, utils, writeFile } from "xlsx";
import { convertExcelToJson } from "../../utils/utility";
import * as XLSX from "xlsx";
import Select from "react-select";

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
//  interface KeyValue {

//    key?: {
//      details?: string;
//      paymentDate?: any;
//      redemptionid?: string;
//      status?: string;
//      transactionID?: string;
//    };
//  }
interface KeyValue {
  [key: string]: string;
}
interface customerTypeOptions {
  label: string;
  options: string;
}
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
          keys.forEach((key: any, index: number) => {
            obj[key] = value[index];
            // {new Date(obj[key.paymentDate]).toLocaleDateString();}
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
export default function Redemption() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] =
    useState<PaginationInterface>(initialPagination);
  const [resPaginateData, setResPaginateData] =
    useState<ResPaginateInterface>(initialResPaginate);
  const [redemptionData, setRedemptionData] = useState<
    Array<RedemptionDetailViewInterface>
  >([]);
  const [filterData, setFilterData] = useState<RedemptionFilterInterface>(
    initialFilterRedemption
  );
  const [redeemTypeData, setRedeemTypeData] = useState([]);
  const [requestFileData, setRequestFileData] = useState<KeyValue[]>([]);
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  const redemptionList = useSelector(
    (state: any) => state?.redemptions?.redemptions
  );
  const permissionData = useSelector(
    (state: any) => state?.permission?.permission
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "redemptions.read":
          return { ...acc, canRead: true };
        case "redemptions.update":
          return { ...acc, canUpdate: true };
        case "redemptions.delete":
          return { ...acc, canDelete: true };
        case "redemptions.create":
          return { ...acc, canCreate: true };
        case "redemptions.export":
          return { ...acc, canExport: true };
        case "redemptions.import":
          return { ...acc, canImport: true };

        default:
          return acc;
      }
    }, {});
  const dispatch = useDispatch();
  const fetchRedemptions = async () => {
    await backendGetAllRedemptions({ ...filterData, ...paginationData }).then(
      (res) => {
        const { docs, paginate } = res.data;
        let totalData =
          Array.isArray(paginate) && paginate.length && paginate[0].totalDocs;
        setResPaginateData({
          ...resPaginateData,
          totalDocs: totalData,
          totalPages: Math.ceil(totalData / paginationData.recordPerPage),
        });
        setRedemptionData(docs);
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    setIsLoading(true);
    fetchRedemptions();
  }, [paginationData, filterData]);

  useEffect(() => {
    fetchRedeemTypeList();
  }, []);

  const fetchRedeemTypeList = async () => {
    await getRedeemTypeList().then(async (res) => {
      if (!res.isError) {
        await setRedeemTypeData(res.data);
      }
    });
  };

  const handleDeleteItem = (id: string) => {
    backendDeleteRedemption(id)
      .then((result) => {
        if (!result.isError) {
          fetchRedemptions();
          router.push("/redemption");
        }
      })
      .catch((err) => { });
  };

  const onHandleDateRange = (dates: any) => {
    const [start, end] = dates;
    setFilterData({
      ...filterData,
      startDate: new Date(start),
      endDate: new Date(end),
    });
  };
  const handleOnExport = async () => {
    const mappedArray = await Promise.all(
      redemptionData.map(async (item: any) => {
        // console.log("test",item.createdAt);
        item.createdAt = item.createdAt
          ? // new Date((item.createAt- (25567 + 1)) * 86400 * 1000).toLocaleDateString()
          //new Date((item.createdAt - (25567 + 1)) * 86400 * 1000)

          new Date(item.createdAt).toLocaleDateString("en-IN", {
            //timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "numeric",
          })
          : "";
        return item;
      })
    );
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(mappedArray);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "redemption.xlsx");
  };

  const handleExportTemplate = async () => {
    const headers = [
      {
        redemptionid: "",
        status: "",
        transactionID: "",
        details: "",
        paymentDate: 1,
      },
    ];
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(headers);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "redemptionTemplate.xlsx");
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
      backendBulkStatusChangeRedemption(dataArray)
        .then((result) => {
          if (!result.isError) {
            alert("uploaded!");
            router.push("/redemption");
          } else {
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } catch (e) {
      console.log(e, "Error in the Login");
    }
    // const file = event.target.files?.[0];
    // if (file) {
    //   const fileReader = new FileReader();
    //   fileReader.readAsBinaryString(file);
    //   fileReader.onload = async () => {
    //     const workbook = read(fileReader.result, { type: 'binary' });
    //     const data = await utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    //     await backendBulkStatusChangeRedemption(data).then((result) => {
    //       if (!result.isError) {
    //         //router.push('/redemption');
    //       }
    //     }).catch((err) => {

    //     });
    //   }
    // }
  };


  const customerTypeOptions = [
    { value: 'Mechanic', label: 'Mechanic' },
    { value: 'Retailer', label: 'Retailer' },

  ]

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "Home" }}
        secondItem={{ href: "", label: "" }}
        itemlabel="Redemption List"
      />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={3}>
              <h3 className="card-body">
                Redemption List({resPaginateData.totalDocs})
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
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2000}>2000</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3} className="text-end">
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
            </Col>
            <Col md={4} className="text-end">
              {moduleAccess?.canImport ? (
                <Button
                  onClick={handleExportTemplate}
                  className="p-2 pr-2"
                  variant="outline-light"
                >
                  <Download /> Template
                </Button>
              ) : null}
              {moduleAccess?.canExport ? (
                <Button
                  onClick={handleOnExport}
                  className="p-2 pr-2"
                  variant="outline-light"
                >
                  <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
                </Button>
              ) : null}
              {moduleAccess?.canCreate ? (
                <Link href={{ pathname: "/redemption/create" }}>
                  <Button variant="dark">
                    <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />
                    Redemption
                  </Button>
                </Link>
              ) : null}

              {/* <Button className="pr-2" variant="dark"><Image src={IMAGE_URL + WHITE_FILTER_IMAGE} /> Filters</Button> */}
            </Col>
            <Col xl={12} sm={12} xs={12} className="text-end">
              <Accordion defaultActiveKey="0" className="mb-3">
                <CustomToggle eventKey="1"></CustomToggle>
                <Accordion.Collapse eventKey="1">
                  <Card className="text-start prod-p-card bg-white">
                    <Card.Body>
                      <Row>
                        <Col md={4} className="border-end">
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalEmail"
                          >
                            <Form.Label column sm={4}>
                              {" "}
                              Start Date
                            </Form.Label>
                            <Col sm={8}>
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
                              {/* <DatePicker selected={filterData.startDate} onChange={(date: any) => { setFilterData({ ...filterData, startDate: new Date(date) }) }} /> */}
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalEmail"
                          >
                            <Form.Label column sm={4}>
                              {" "}
                              Enf Date
                            </Form.Label>
                            <Col sm={8}>
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
                              {/* <DatePicker selected={filterData.endDate} onChange={(date: any) => { 
                                setFilterData({ ...filterData, endDate: new Date(date) }) }} /> */}
                            </Col>
                          </Form.Group>

                          <Form.Group className="mb-1">
                            <Form.Label htmlFor="User">Customer Type</Form.Label>
                            <Select
                              options={customerTypeOptions}
                              // value={customerTypeOptions.find(option => option.value === filterData?.customerType[0])}
                              value={customerTypeOptions.find(option => option.value === filterData?.customerType?.[0] ?? '')}

                              onChange={(e: any) => {
                                setFilterData({
                                  ...filterData,
                                  customerType: [e.value]  // Directly access value from the selected option
                                });
                              }}
                              isSearchable={false}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="border-end">
                          <div className="p-3">
                            <h5>Mode</h5>
                            <Row className="mt-3 gx-0">
                              {Array.isArray(redeemTypeData) &&
                                redeemTypeData.map((item: any, index) => (
                                  <Col
                                    md={12}
                                    className="form-check mb-2"
                                    key={index}
                                  >
                                    <Form.Check
                                      inline
                                      className="form-check pt-2 pr-4"
                                      type="checkbox"
                                      value={item}
                                      label={item}
                                      onChange={(e) => {
                                        const { value, checked } = e.target;
                                        var types = filterData.type
                                          ? JSON.parse(
                                            JSON.stringify(filterData.type)
                                          )
                                          : [];
                                        if (checked) {
                                          types.push(value);
                                        } else {
                                          types = types.filter(function (
                                            item: string
                                          ) {
                                            return item !== value;
                                          });
                                        }
                                        setFilterData({
                                          ...filterData,
                                          type: Array.from(new Set(types)),
                                        });
                                      }}
                                      defaultChecked={
                                        Array.isArray(filterData.type)
                                          ? filterData.type.some(
                                            (itemtype) => itemtype == item
                                          )
                                          : false
                                      }
                                    />
                                  </Col>
                                ))}
                            </Row>
                          </div>
                        </Col>
                        <Col md={4} className="border-end">
                          <div className="p-3">
                            <h5>Status</h5>
                            <Row className="mt-3 gx-0">
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="coupon_based"
                                  type="checkbox"
                                  value="Pending"
                                  label="Pending"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Pending"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Approved"
                                  label="Approved"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Approved"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Rejected"
                                  label="Rejected"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Rejected"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Success"
                                  label="Success"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Success"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Fail"
                                  label="Fail"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Fail"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                              <Col md={12} className="form-check mb-2">
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="UNDER PROCESS"
                                  label="In Process"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = filterData.status
                                      ? JSON.parse(
                                        JSON.stringify(filterData.status)
                                      )
                                      : [];
                                    if (checked) {
                                      status.push(value);
                                    } else {
                                      status = status.filter(function (
                                        item: string
                                      ) {
                                        return item !== value;
                                      });
                                    }
                                    setFilterData({
                                      ...filterData,
                                      status: Array.from(new Set(status)),
                                    });
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status)
                                      ? filterData.status.some(
                                        (item) => item == "Fail"
                                      )
                                      : false
                                  }
                                />
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Accordion.Collapse>
              </Accordion>
            </Col>
            {moduleAccess?.canImport ? (
              <Col md={6}>
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

                {/* <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={3}>Status Upload</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileInputChange}
                  />
                </Col>
              </Form.Group> */}
              </Col>
            ) : null}
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
                              <th>Mode</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(redemptionData) &&
                              redemptionData.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.refno}</td>
                                    <td>
                                      {" "}
                                      <Link
                                        href={{
                                          pathname: "/redemption/" + item._id,
                                        }}
                                      >
                                        {item.firmName}
                                      </Link>
                                    </td>
                                    <td>
                                      {" "}
                                      <Link
                                        href={{
                                          pathname: "/redemption/" + item._id,
                                        }}
                                      >
                                        {item.contactPerson}
                                      </Link>
                                    </td>
                                    <td>{item.points}</td>
                                    <td>{item.type}</td>
                                    <td>{item.status}</td>
                                    <td>{item.createdAt}</td>
                                    <td>
                                      {moduleAccess?.canUpdate ? (
                                        <Link
                                          className="pt-2"
                                          href={{
                                            pathname: "/redemption/edit",
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
                                      ) : null}
                                      {moduleAccess?.canDelete ? (
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
                                      ) : null}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Card>
            {isLoading ? (
              <Col xl={12} sm={12} xs={12} className="text-center">
                <Spinner animation="border" />
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col xl={12} sm={12} xs={12} className="text-end">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li
                    className={`page-item ${paginationData.currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <a
                      className="page-link"
                      onClick={() => {
                        setPaginationData({
                          ...paginationData,
                          currentPage: paginationData.currentPage - 1,
                        });
                        router.push(
                          `/redemption/?page=${paginationData.currentPage - 1}`
                        );
                      }}
                    >
                      Previous
                    </a>
                  </li>

                  <li
                    className={`page-item ${paginationData.currentPage === resPaginateData.totalPages
                        ? "disabled"
                        : ""
                      }`}
                  >
                    <a
                      className="page-link"
                      onClick={() => {
                        setPaginationData({
                          ...paginationData,
                          currentPage: paginationData.currentPage + 1,
                        });
                        router.push(
                          `/redemption/?page=${paginationData.currentPage + 1}`
                        );
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
