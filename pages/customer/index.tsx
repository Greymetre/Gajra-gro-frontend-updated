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
  Accordion,
  Spinner,
  InputGroup,
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
  backendCustomerImport,
  backendDeleteCustomer,
  backendGetAllCustomers,
} from "../../helpers/backend_helper";
import Link from "next/link";
import editimg from "../../assets/images/auth/edit-3.svg";
import avatarimg from "../../assets/images/user/avatar-2.jpg";
import InfiniteScroll from "react-infinite-scroll-component";
import * as XLSX from "xlsx";
import { read, utils, writeFile } from "xlsx";
import {
  CUSTOMER_DEMO_IMAGE,
  EDIT_DEMO_IMAGE,
  EXCEL_DEMO_IMAGE,
  IMAGE_URL,
  PROFILE_DEMO_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
} from "../../utils/constant";
import ReactPaginate from "react-paginate";
// import { useRouter } from 'next/router';
import {
  CustomerFilterInterface,
  CustomerProfileViewInterface,
  initialFilterCustomer,
} from "../../interfaces/customer.interface";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import SelectUserList from "../../components/InputFields/SelectUserList";
import {
  PaginationCustomerInterface,
  PaginationInterface,
  ResPaginateInterface,
  initialCustomerPagination,
  initialPagination,
  initialResPaginate,
} from "../../interfaces/pagination.interface";
import { handleExportTemplate } from "../../utils/utility";
import { useRouter } from "next/navigation";
import Select from "react-select";

function CustomToggle(props: any) {
  const { eventKey } = props;
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );

  return (
    <Button className="pr-2" variant="dark" onClick={decoratedOnClick}>
      <Image src={IMAGE_URL + WHITE_FILTER_IMAGE} /> Filters
    </Button>
  );
}
interface KeyValue {
  [key: string]: any;
}
interface customerTypeOptions {
  label: string;
  options: string;
}
const Customer = React.forwardRef((props, ref) => {
  const router = useRouter();
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  const initialCustomer = {
    _id: "",
    firmName: "",
    contactPerson: "",
    mobile: 0,
    phoneCode: "",
    email: "",
    customerType: "",
    address: {
      postalCode: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
    password: "",
  };
  const [isLoading, setIsLoading] = useState(true);
  const [initialCustomerData, setInitialCustomerData] =
    useState(initialCustomer);
  const [paginationData, setPaginationData] =
    useState<PaginationCustomerInterface>(initialCustomerPagination);
  const [resPaginateData, setResPaginateData] =
    useState<ResPaginateInterface>(initialResPaginate);
  const [filterData, setFilterData] = useState<CustomerFilterInterface>(
    initialFilterCustomer
  );
  // Changing a filter starts again from the first page; both updates render together.
  const updateFilterData = (data: typeof filterData) => {
    setFilterData(data);
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };
  const [search, setSearch] = useState("");
  const customerList = useSelector((state: any) => state?.customers?.customers);
  const [customerData, setCustomerData] = useState<
    Array<CustomerProfileViewInterface>
  >([]);
  const [requestFileData, setRequestFileData] = useState<KeyValue[]>([]);
  const dispatch = useDispatch();
  // const fetchCustomers = async () => {
  //   await backendGetAllCustomers({ ...filterData, ...paginationData }).then(
  //     (res) => {
  //       const { docs, paginate } = res.data;
  //       let totalData =
  //         Array.isArray(paginate) && paginate.length && paginate[0].totalDocs;
  //       setResPaginateData({
  //         ...resPaginateData,
  //         totalDocs: totalData,
  //         totalPages: Math.ceil(totalData / paginationData.recordPerPage),
  //       });
  //       setCustomerData(docs);
  //       setIsLoading(false);
  //     }
  //   );
  // };
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchCustomers();
  // }, [paginationData, filterData]);

  const fetchCustomers = async () => {
    await backendGetAllCustomers({ ...filterData, ...paginationData }).then(
      (res) => {
        const { docs, paginate } = res.data;
        let totalData =
          Array.isArray(paginate) && paginate.length && paginate[0].totalDocs;
        setResPaginateData({
          ...resPaginateData,
          totalDocs: totalData,
          totalPages: Math.ceil(totalData / paginationData.recordPerPage),
        });
        setCustomerData(docs);
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    setIsLoading(true);
    fetchCustomers();
  }, [paginationData, filterData]);

  const handleEditCustomer = (user: any) => {
    window.scrollTo(0, 0);
    setInitialCustomerData(user);
    setShowCreateForm(true);
  };
  const handleDeleteItem = (id: string) => {
    backendDeleteCustomer(id)
      .then((result) => {
        if (!result.isError) {
        } else {
        }
      })
      .catch((err) => {});
  };

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(
      customerData.map(async (customer: any) => {
        customer.createdAt = customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "numeric",
            })
          : "";
        // location is stored as { coordinates: [longitude, latitude] }; xlsx can't write objects
        const { location, ...rest } = customer;
        const coordinates = location?.coordinates;
        const hasCoordinates =
          Array.isArray(coordinates) && coordinates.length >= 2 && (coordinates[0] || coordinates[1]);
        return {
          ...rest,
          latitude: hasCoordinates ? Number(coordinates[1]) : "",
          longitude: hasCoordinates ? Number(coordinates[0]) : "",
        };
      })
    );
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "customers.xlsx");
  };
  const handleFilterChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    updateFilterData({
      ...filterData,
      [name]: type === "number" ? parseInt(value) : value,
    });
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
      backendCustomerImport(dataArray)
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
    const headers = [
      {
        firmName: "",
        contactPerson: "",
        mobile: "",
        email: "",
        customerType: "",
        postalCode: "",
        address: "",
        city: "",
        state: "",
        country: "",
        status: "",
        createdBy: "",
        assignUser: "",
      },
    ];
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(headers);
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, "customerTemplate.xlsx");
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
        itemlabel="Customer List"
      />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row className="align-items-center mb-4">
            <Col xl={12} sm={12} xs={12}>
              <div className="cl-toolbar">
                <div className="cl-toolbar-top">
                  <div className="cl-title">
                    <h3 className="mb-0">Customer List</h3>
                    <span className="cl-count">
                      {resPaginateData.totalDocs ?? 0}
                    </span>
                  </div>
                  <div className="cl-actions">
                    {moduleAccess?.canExport ? (
                      <Button
                        onClick={handleOnExport}
                        className="cl-btn-outline"
                        variant="outline-light"
                      >
                        <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel
                      </Button>
                    ) : null}
                    {moduleAccess?.canCreate ? (
                      <Link href={{ pathname: "/customer/create" }}>
                        <Button className="cl-btn-dark" variant="dark">
                          <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add
                          Customer
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div className="cl-toolbar-row">
                  <Form.Control
                    className="cl-search"
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
                    placeholder="Search by name, phone, ref no..."
                  />
                  <Form.Group className="cl-show mb-0">
                    <Form.Label className="mb-0">Show</Form.Label>
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
                      <option value={100}>{100}</option>
                      <option value={200}>{200}</option>
                      <option value={500}>{500}</option>
                      <option value={1000}>{1000}</option>
                      <option value={2000}>{2000}</option>
                      <option value={5000}>5000</option>
                      <option value={10000}>10000</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="cl-import">
                    {moduleAccess?.canImport ? (
                      <Button
                        onClick={handleExportTemplate}
                        className="cl-btn-outline"
                        variant="outline-light"
                      >
                        <Download /> Template
                      </Button>
                    ) : null}
                    <InputGroup className="cl-upload">
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
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={12} sm={12} xs={12} className="text-end">
              <Accordion defaultActiveKey="0" className="mb-3">
                <CustomToggle eventKey="1"></CustomToggle>
                <Accordion.Collapse eventKey="1">
                  <Card className="text-start prod-p-card bg-white">
                    <Card.Body>
                      <Row>
                        <Row>
                          <Col md={4} className="border-end">
                            <Row>
                              <Form.Label> Created Date</Form.Label>
                              <Form.Group
                                as={Row}
                                className="mb-4"
                                controlId="formHorizontalEmail"
                              >
                                <Col sm={6}>
                                  <Form.Label> From</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => {
                                      setPaginationData({
                                        ...paginationData,
                                        currentPage: 1,
                                        startDate: e.target.value,
                                      });
                                    }}
                                    value={paginationData.startDate}
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
                                      setPaginationData({
                                        ...paginationData,
                                        currentPage: 1,
                                        endDate: e.target.value,
                                      });
                                    }}
                                    value={paginationData.endDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="End Date"
                                  />
                                </Col>
                              </Form.Group>
                            </Row>
                          </Col>

                          <Col md={3} className="border-end">
                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalEmail"
                            >
                              <Col sm={6}>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="existing"
                                  type="checkbox"
                                  value="Existing"
                                  label="Existing"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    updateFilterData({
                                      ...filterData,
                                      existing: checked,
                                    });
                                  }}
                                  defaultChecked={filterData.existing}
                                />
                              </Col>

                              <Col sm={6}>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="coupon_based"
                                  type="checkbox"
                                  value="Self"
                                  label="Self"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    updateFilterData({
                                      ...filterData,
                                      self: checked,
                                    });
                                  }}
                                  defaultChecked={filterData.self}
                                />
                              </Col>
                            </Form.Group>
                          </Col>

                          <Col md={3}>
                            <h5>KYC Status</h5>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="Pending"
                                label="Pending"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "Pending"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="Rejected"
                                label="Rejected"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "Rejected"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="Incomplete"
                                label="Incomplete"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "Incomplete"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="Approved"
                                label="Approved"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "Approved"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="All"
                                label="All"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "All"
                                      )
                                    : false
                                }
                              />
                            </Col>
                          </Col>
                          <Col md={3} className="border-end">
                            <SelectUserList
                              handleInputChange={handleFilterChange}
                              fieldname="userid"
                              fieldvalue={filterData.userid}
                            />
                          </Col>

                          <Col md={3} className="border-end">
                          <Form.Group className="mb-1">
      <Form.Label htmlFor="User">Customer Type</Form.Label>
      <Select
  options={customerTypeOptions}
  value={customerTypeOptions.find(option => option.value === filterData?.customerType[0])}
  onChange={(e :any) => {
    updateFilterData({
      ...filterData,
      customerType: [e.value]  // Directly access value from the selected option
    });
  }}
  isSearchable={false}
/>
    </Form.Group>
                          </Col>
                        </Row>
                      </Row>
                    </Card.Body>
                  </Card>
                </Accordion.Collapse>
              </Accordion>
            </Col>
          </Row>
        </Col>

        {/* <Col md={4} className="border-end"> */}
        {/*       <Row>
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
                                        currentPage: 1,
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
                                        currentPage: 1,
                                        endDate: e.target.value,
                                      });
                                    }}
                                    value={paginationData.endDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="End Date"
                                  />
                                </Col>
                              <Col sm={6}>
                                  <Form.Label> From</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => {
                                      updateFilterData({
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
                                      updateFilterData({
                                        ...filterData,
                                        endDate: e.target.value,
                                      });
                                    }}
                                    value={filterData.endDate}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="End Date"
                                  />
                                </Col> 
                              </Form.Group>
                            </Row>
                          </Col>
                          <Col md={4} className="border-end">
                            <h5>KYC Status</h5>
                            <Col className="form-check m-2 ">
                              <Form.Check
                                inline
                                className="form-check pt-1 pr-4"
                                name="condition"
                                type="checkbox"
                                value="Pending"
                                label="Pending"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var condition = paginationData.condition
                                    ? JSON.parse(
                                        JSON.stringify(paginationData.condition)
                                      )
                                    : [];
                                  if (checked) {
                                    condition.push(value);
                                  } else {
                                    condition =condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.pointType)
                                    ? paginationData.pointType.some(
                                        (item) => item == "Pending"
                                      )
                                    : false
                                }
                              />
                            </Col>
                            <Col className="form-check m-2">
                              <Form.Check
                                inline
                                className="form-check pt-2 pr-4"
                                name="pointType"
                                type="checkbox"
                                value="Gajra Gro Loyalty Program"
                                label="Gajra Gro Loyalty Program"
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  var pointType = filterData.pointType
                                    ? JSON.parse(
                                        JSON.stringify(filterData.pointType)
                                      )
                                    : [];
                                  if (checked) {
                                    pointType.push(value);
                                  } else {
                                    pointType = pointType.filter(function (
                                      item: string
                                    ) {
                                      return item !== value;
                                    });
                                  }
                                  updateFilterData({
                                    ...filterData,
                                    pointType: Array.from(new Set(pointType)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(filterData.pointType)
                                    ? filterData.pointType.some(
                                        (item) =>
                                          item == "Gajra Gro Loyalty Program"
                                      )
                                    : false
                                }
                              />
                            </Col>{" "}
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
                                    currentPage: 1,
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
                                    condition = condition.paginationData(
                                      function (item: string) {
                                        return item !== value;
                                      }
                                    );
                                  }
                                  setPaginationData({
                                    ...paginationData,
                                    currentPage: 1,
                                    condition: Array.from(new Set(condition)),
                                  });
                                }}
                                defaultChecked={
                                  Array.isArray(paginationData.condition)
                                    ? paginationData.condition.some(
                                        (item) => item == "Approved"
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
                              name="condition"
                              type="checkbox"
                              value="All"
                              label="All"
                              onChange={(e) => {
                                const { value, checked } = e.target;
                                var condition = paginationData.condition
                                  ? JSON.parse(
                                      JSON.stringify(paginationData.condition)
                                    )
                                  : [];
                                if (checked) {
                                  pointType.push(value);
                                } else {
                                  condition = condition.paginationData(
                                    function (item: string) {
                                      return item !== value;
                                    }
                                  );
                                }
                                setPaginationData({
                                  ...paginationData,
                                  currentPage: 1,
                                  condition: Array.from(new Set(condition)),
                                });
                              }}
                              defaultChecked={
                                Array.isArray(paginationData.condition)
                                  ? paginationData.condition.some(
                                      (item) => item == "All"
                                    )
                                  : false
                              }
                            />
                          </Col>{" "} */}

        {/* <Accordion defaultActiveKey="0" className="mb-3">
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
                              className="mb-3"
                              controlId="formHorizontalEmail"
                            >
                              <Col sm={6}>
                                <Form.Label> From</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="startDate"
                                  onChange={(e) => {
                                    updateFilterData({
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
                                    updateFilterData({
                                      ...filterData,
                                      endDate: e.target.value,
                                    });
                                  }}
                                  value={filterData.endDate}
                                  required={true}
                                  autoComplete="off"
                                  placeholder="End Date"
                                />
                              </Col>
                            </Form.Group>
                          </Row>
                        </Col>
                        <Col md={4} className="border-end">
                          <Row>
                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalEmail"
                            >
                              <Col sm={6}>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="existing"
                                  type="checkbox"
                                  value="Existing"
                                  label="Existing"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    updateFilterData({
                                      ...filterData,
                                      existing: checked,
                                    });
                                  }}
                                  defaultChecked={filterData.existing}
                                />
                              </Col>

                              <Col sm={6}>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="coupon_based"
                                  type="checkbox"
                                  value="Self"
                                  label="Self"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    updateFilterData({
                                      ...filterData,
                                      self: checked,
                                    });
                                  }}
                                  defaultChecked={filterData.self}
                                />
                              </Col>
                             
                            </Form.Group>
                          </Row>
                        {/* <Row className="border-top">
                             <Form.Label>KYC Status</Form.Label>
                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalEmail"
                            > */}
        {/* <Col sm={7}>
                                <h6>All</h6>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name=""
                                  type="checkbox"
                                  label="All"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      updateFilterData({
                                        ...filterData,
                                        Pending: "",
                                      });
                                    }
                                  }}
                                  // value={filterData.}
                                />
                              </Col>

                              <Col sm={7}>
                                Pending<br/>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="Pending"
                                  type="checkbox"
                                  label="Pending"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      updateFilterData({
                                        ...filterData,
                                        Pending: "Pending",
                                      });
                                    }
                                  }}
                                  value={filterData.Pending}
                                />
                              </Col>
                              <Col sm={5}>
                                Rejected
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="Rejected"
                                  type="checkbox"
                                  label="Rejected"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      updateFilterData({
                                        ...filterData,
                                        Rejected: "Rejected",
                                      });
                                    }
                                  }}
                                  value={filterData.Rejected}
                                />
                                 <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="status"
                                  type="checkbox"
                                  value="Rejected"
                                  label="Rejected"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      const types = filterData.Pending;
                                      types.push(value);
                                      updateFilterData({
                                        ...filterData,
                                        Pending: types,
                                      });
                                    } else {
                                      const types =
                                        await filterData.Pending.filter(
                                          (e: string) => e !== value
                                        );
                                      updateFilterData({
                                        ...filterData,
                                        Pending: types,
                                      });
                                    }
                                  }}
                                  defaultChecked={filterData.Pending.includes(
                                    "Rejected"
                                  )}
                                /> 
                              </Col>
                              <Col sm={7}>
                                Incomplete
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="Incomplete"
                                  type="checkbox"
                                  // value="Incomplete"
                                  label="Incomplete"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      // const types = filterData.Incomplete;
                                      // types.push(value);
                                      updateFilterData({
                                        ...filterData,
                                        Incomplete: "Incomplete",
                                      });
                                    }
                                    // else {
                                    //   const types =
                                    //     await filterData.Incomplete.filter(
                                    //       (e: string) => e !== value
                                    //     );
                                    //   updateFilterData({
                                    //     ...filterData,
                                    //     Incomplete: types,
                                    //   });
                                    // }
                                  }}
                                  // onChange={(e) => {
                                  //   updateFilterData({
                                  //     ...filterData,
                                  //     Incomplete: e.target.value,
                                  //   });
                                  // }}
                                  value={filterData.Incomplete}
                                  defaultChecked={filterData.Incomplete}
                                />
                                {/* <Form.Control
                                  //inline
                                  className="form- pt-2 pr-4"
                                  name="Incomplete"
                                  type="text"
                                  onChange={(e) => {
                                    updateFilterData({
                                      ...filterData,
                                      Incomplete: e.target.value,
                                    });
                                  }}
                                  value={filterData.Incomplete}
                                /> 
                              </Col>
                              <Col sm={5}>
                                Approved
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="Approved"
                                  type="checkbox"
                                  label="Approved"
                                  onChange={async (e) => {
                                    const { value, checked } = e.target;
                                    if (checked) {
                                      // const types = filterData.Incomplete;
                                      // types.push(value);
                                      updateFilterData({
                                        ...filterData,
                                        Approved: "Approved",
                                      });
                                    }
                                  }}
                                  value={filterData.Approved}
                                  // value="Approved"
                                  // onChange={
                                  //   //async
                                  //   (e) => {
                                  //     const { value, checked } = e.target;
                                  //   }
                                  // }
                                  //   if (checked) {
                                  //     const types = filterData.Approved;
                                  //     types.push(value);
                                  //     updateFilterData({
                                  //       ...filterData,
                                  //       status: types,
                                  //     });
                                  //   } else {
                                  //     const types =
                                  //       await filterData.Approved.filter(
                                  //         (e: string) => e !== value
                                  //       );
                                  //     updateFilterData({
                                  //       ...filterData,
                                  //       Pending: types,
                                  //     });
                                  //   }
                                  // }}
                                  // defaultChecked={
                                  //   filterData.Approved
                                  //   // .includes("Approved")
                                  // }
                                />
                              </Col>
                           </Row>
                           </Col>
                            </Form.Group>
                          </Row>
                          {/* <Row>
                            <Form.Label>Points</Form.Label>
                            <Form.Range />
                          </Row> 
                        </Col>*/}

        {/* <div className="p-3">
                            <h5>Existing</h5>
                            <Row className='mt-3 gx-0'>
                              <Col md={12} className='form-check mb-2'>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  name="coupon_based"
                                  type="checkbox"
                                  value="Pending"
                                  label="Pending"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = (filterData.status) ? JSON.parse(JSON.stringify(filterData.status)) : [];
                                    if (checked) {
                                      status.push(value);
                                    }
                                    else {
                                      status = status.filter(function (item: string) {
                                        return item !== value
                                      })
                                    }
                                    updateFilterData({ ...filterData, status: Array.from(new Set(status)) })
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status) ? filterData.status.some((item) => item == "Pending") : false
                                  }
                                />
                              </Col>
                              <Col md={12} className='form-check mb-2'>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Approved"
                                  label="Approved"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = (filterData.status) ? JSON.parse(JSON.stringify(filterData.status)) : [];
                                    if (checked) {
                                      status.push(value);
                                    }
                                    else {
                                      status = status.filter(function (item: string) {
                                        return item !== value
                                      })
                                    }
                                    updateFilterData({ ...filterData, status: Array.from(new Set(status)) })
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status) ? filterData.status.some((item) => item == "Approved") : false
                                  }
                                />
                              </Col>
                              <Col md={12} className='form-check mb-2'>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Reject"
                                  label="Reject"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = (filterData.status) ? JSON.parse(JSON.stringify(filterData.status)) : [];
                                    if (checked) {
                                      status.push(value);
                                    }
                                    else {
                                      status = status.filter(function (item: string) {
                                        return item !== value
                                      })
                                    }
                                    updateFilterData({ ...filterData, status: Array.from(new Set(status)) })
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status) ? filterData.status.some((item) => item == "Reject") : false
                                  }
                                />
                              </Col>
                              <Col md={12} className='form-check mb-2'>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Success"
                                  label="Success"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = (filterData.status) ? JSON.parse(JSON.stringify(filterData.status)) : [];
                                    if (checked) {
                                      status.push(value);
                                    }
                                    else {
                                      status = status.filter(function (item: string) {
                                        return item !== value
                                      })
                                    }
                                    updateFilterData({ ...filterData, status: Array.from(new Set(status)) })
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status) ? filterData.status.some((item) => item == "Success") : false
                                  }
                                />
                              </Col>
                              <Col md={12} className='form-check mb-2'>
                                <Form.Check
                                  inline
                                  className="form-check pt-2 pr-4"
                                  type="checkbox"
                                  value="Fail"
                                  label="Fail"
                                  onChange={(e) => {
                                    const { value, checked } = e.target;
                                    var status = (filterData.status) ? JSON.parse(JSON.stringify(filterData.status)) : [];
                                    if (checked) {
                                      status.push(value);
                                    }
                                    else {
                                      status = status.filter(function (item: string) {
                                        return item !== value
                                      })
                                    }
                                    updateFilterData({ ...filterData, status: Array.from(new Set(status)) })
                                  }}
                                  defaultChecked={
                                    Array.isArray(filterData.status) ? filterData.status.some((item) => item == "Fail") : false
                                  }
                                />
                              </Col>
                            </Row>
                          </div> */}

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
        {Array.isArray(customerData) &&
          customerData.map((item, index) => {
            return (
              <Col xl={4} md={6} sm={6} xs={12} key={index} className="mb-4">
                <Card className="cl-card h-100">
                  <Card.Body>
                    <div className="cl-card-head">
                      <Link
                        className="cl-card-identity"
                        href={{
                          pathname: "/customer/" + item._id,
                        }}
                      >
                        <Image
                          src={
                            item.avatar
                              ? IMAGE_URL + item.avatar
                              : IMAGE_URL + PROFILE_DEMO_IMAGE
                          }
                          alt="User image"
                          className="cl-avatar"
                        />
                        <div className="cl-card-name">
                          <h6 className="mb-1">{item?.firmName}</h6>
                          <div className="cl-card-tags">
                            {item.customerType ? (
                              <span className="cl-badge">
                                {item.customerType}
                              </span>
                            ) : null}
                            <span className="cl-ref">
                              Ref No: {item.refno}
                            </span>
                          </div>
                        </div>
                      </Link>
                      {moduleAccess?.canUpdate ? (
                        <Link
                          href={{
                            pathname: "/customer/create",
                            query: { id: item._id },
                          }}
                        >
                          <Button
                            className="cl-edit"
                            variant="outline-light"
                            title="Edit customer"
                          >
                            <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                          </Button>
                        </Link>
                      ) : null}
                    </div>

                    <div className="cl-login">
                      Login At:{" "}
                      <span>
                        {item.loginAt
                          ? new Date(item.loginAt).toLocaleString()
                          : "Never"}
                      </span>
                    </div>

                    <div className="cl-fields">
                      <div className="cl-field">
                        <label>Contact Person</label>
                        <span>{item.contactPerson || "-"}</span>
                      </div>
                      <div className="cl-field">
                        <label>Phone</label>
                        <span>{item.mobile || "-"}</span>
                      </div>
                      <div className="cl-field">
                        <label>Email</label>
                        <span>{item.email || "-"}</span>
                      </div>
                      <div className="cl-field">
                        <label>State</label>
                        <span>{item?.state || "-"}</span>
                      </div>
                      <div className="cl-field">
                        <label>Created By</label>
                        <span>{item.createdBy || "-"}</span>
                      </div>
                      <div className="cl-field">
                        <label>Assigned User</label>
                        <span>{item.assignUser || "-"}</span>
                      </div>
                      <div className="cl-field cl-field-full">
                        <label>Address</label>
                        <span>
                          {[item?.address, item?.city, item?.state, item?.postalCode]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        {isLoading ? (
          <Col xl={12} sm={12} xs={12} className="mb-3 text-center">
            <Spinner animation="border" />
          </Col>
        ) : null}
      </Row>
    </Layout>
  );
});
export default Customer;
