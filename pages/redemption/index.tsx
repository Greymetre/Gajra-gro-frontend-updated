import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Col,
  Row,
  Table,
  Image,
  Form,
  InputGroup,
  Modal,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import {
  PencilSquare,
  PlusCircle,
  Download,
  Funnel,
  Search,
  Trash,
  Upload,
  X,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import PaginationNav from "../../components/Common/PaginationNav";
import {
  backendGetAllRedemptions,
  backendDeleteRedemption,
  getRedeemTypeList,
  backendBulkStatusChangeRedemption,
} from "../../helpers/backend_helper";
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

// value is what the API stores, label is what the filter shows
const REDEMPTION_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Success", label: "Success" },
  { value: "Fail", label: "Fail" },
  { value: "UNDER PROCESS", label: "In Process" },
];
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
  // Changing a filter starts again from the first page; both updates render together.
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilterValue = (field: "type" | "status", value: string, checked: boolean) => {
    const current: string[] = Array.isArray(filterData[field]) ? (filterData[field] as string[]) : [];
    updateFilterData({
      ...filterData,
      [field]: checked ? Array.from(new Set([...current, value])) : current.filter((item) => item !== value),
    });
  };
  const updateFilterData = (data: typeof filterData) => {
    setFilterData(data);
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
  };
  const [redeemTypeData, setRedeemTypeData] = useState([]);
  // search reloads 400 ms after typing stops
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationData((prev) => (prev.search === searchText ? prev : { ...prev, currentPage: 1, search: searchText }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);
  const [showImport, setShowImport] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "danger" | "info"; text: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
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
    if (!window.confirm("Delete this redemption? This cannot be undone.")) return;
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
    updateFilterData({
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
      if (!dataArray.length) {
        setImportStatus({ type: "danger", text: "Please choose a file first." });
        return;
      }
      setIsImporting(true);
      setImportStatus({ type: "info", text: `Uploading ${dataArray.length} rows…` });
      backendBulkStatusChangeRedemption(dataArray)
        .then((result) => {
          if (!result.isError) {
            setImportStatus({ type: "success", text: `Status update uploaded (${dataArray.length} rows).` });
            setRequestFileData([]);
            fetchRedemptions();
          } else {
            setImportStatus({ type: "danger", text: result.message || "Upload failed." });
          }
        })
        .catch((err) => {
          setImportStatus({ type: "danger", text: err?.response?.data?.message || "Upload failed." });
        })
        .finally(() => setIsImporting(false));
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

  const total = Number(resPaginateData.totalDocs) || 0;
  const perPage = Number(paginationData.recordPerPage) || 100;
  const from = total ? (paginationData.currentPage - 1) * perPage + 1 : 0;
  const to = Math.min(paginationData.currentPage * perPage, total);
  const statusList: string[] = Array.isArray(filterData.status) ? (filterData.status as string[]) : [];
  const typeList: string[] = Array.isArray(filterData.type) ? (filterData.type as string[]) : [];
  const customerTypeList: string[] = Array.isArray(filterData.customerType) ? (filterData.customerType as string[]) : [];
  const statusLabel = (value: string) => REDEMPTION_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;

  const activeFilters: Array<{ key: string; label: string; clear: () => void }> = [];
  if (filterData.startDate || filterData.endDate) {
    activeFilters.push({
      key: "date",
      label: `Date: ${filterData.startDate || "…"} → ${filterData.endDate || "…"}`,
      clear: () => updateFilterData({ ...filterData, startDate: "", endDate: "" }),
    });
  }
  customerTypeList.forEach((value) =>
    activeFilters.push({ key: `ct-${value}`, label: `Customer: ${value}`, clear: () => updateFilterData({ ...filterData, customerType: [] }) }));
  typeList.forEach((value) =>
    activeFilters.push({ key: `ty-${value}`, label: `Mode: ${value}`, clear: () => toggleFilterValue("type", value, false) }));
  if (statusList.length > 1) {
    statusList.forEach((value) =>
      activeFilters.push({ key: `st-${value}`, label: `Status: ${statusLabel(value)}`, clear: () => toggleFilterValue("status", value, false) }));
  }

  const statusTone = (status?: string) => {
    switch (String(status || "")) {
      case "Success": return "success";
      case "Approved": return "info";
      case "UNDER PROCESS": return "primary";
      case "Rejected":
      case "Fail": return "danger";
      case "Pending": return "warning";
      default: return "secondary";
    }
  };

  const formatDate = (value?: any) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return String(value);
    return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Redemptions</h3>
          <div className="text-muted small">
            {total.toLocaleString("en-IN")} redemptions{activeFilters.length || statusList.length || paginationData.search ? " match the current filters" : ""}
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {moduleAccess?.canImport ? (
            <Button className="cd-btn cd-btn-outline" onClick={() => { setImportStatus(null); setShowImport(true); }}>
              <Upload /> Status Import
            </Button>
          ) : null}
          {moduleAccess?.canExport ? (
            <Button className="cd-btn cd-btn-outline" onClick={handleOnExport} title="Exports the rows on this page">
              <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
            </Button>
          ) : null}
          <Button className="cd-btn cd-btn-outline" onClick={() => setShowFilters(true)}>
            <Funnel /> Filters
            {activeFilters.length ? <Badge bg="dark" pill className="ms-2">{activeFilters.length}</Badge> : null}
          </Button>
          {moduleAccess?.canCreate ? (
            <Link href={{ pathname: "/redemption/create" }}>
              <Button variant="dark" className="cd-btn"><PlusCircle /> Redemption</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="tx-card">
        <div className="rd-status-tabs mb-3">
          <button
            type="button"
            className={`rd-status-tab ${statusList.length === 0 ? "active" : ""}`}
            onClick={() => updateFilterData({ ...filterData, status: [] })}
          >
            All
          </button>
          {REDEMPTION_STATUS_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`rd-status-tab ${statusList.length === 1 && statusList[0] === option.value ? "active" : ""}`}
              onClick={() => updateFilterData({ ...filterData, status: [option.value] })}
            >
              <span className={`rd-dot bg-${statusTone(option.value)}`} /> {option.label}
            </button>
          ))}
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <InputGroup className="tx-search">
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoComplete="off"
              placeholder="Search firm, contact person, ref no…"
            />
            {searchText ? (
              <Button variant="outline-secondary" onClick={() => setSearchText("")} title="Clear search"><X /></Button>
            ) : null}
          </InputGroup>
          {activeFilters.map((filter) => (
            <span key={filter.key} className="tx-chip">
              {filter.label}
              <button type="button" onClick={filter.clear} title="Remove filter"><X /></button>
            </span>
          ))}
          {activeFilters.length > 1 ? (
            <Button variant="link" size="sm" className="text-muted" onClick={() => updateFilterData(initialFilterRedemption)}>Clear all</Button>
          ) : null}
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>Ref #</th>
                <th>Customer</th>
                <th className="text-end">Points</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
                {moduleAccess?.canUpdate || moduleAccess?.canDelete ? <th className="text-end">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : Array.isArray(redemptionData) && redemptionData.length ? (
                redemptionData.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="text-muted">{item.refno || "-"}</td>
                    <td>
                      <Link href={{ pathname: "/redemption/" + item._id }} className="tx-firm">{item.firmName || "-"}</Link>
                      {item.contactPerson ? <div className="tx-sub">{item.contactPerson}</div> : null}
                    </td>
                    <td className="text-end">
                      <span className="rd-points">{Number(item.points ?? 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td>{(item as any).type ? <Badge bg="light" text="dark" className="border">{(item as any).type}</Badge> : "-"}</td>
                    <td>
                      <Badge bg={statusTone((item as any).status)} className="rd-status">{statusLabel(String((item as any).status || "-"))}</Badge>
                    </td>
                    <td className="text-nowrap">{formatDate((item as any).createdAt)}</td>
                    {moduleAccess?.canUpdate || moduleAccess?.canDelete ? (
                      <td className="text-end text-nowrap">
                        {moduleAccess?.canUpdate ? (
                          <Link href={{ pathname: "/redemption/edit", query: { id: item._id } }}>
                            <Button size="sm" variant="light" className="tx-icon-btn" title="Edit"><PencilSquare /></Button>
                          </Link>
                        ) : null}
                        {moduleAccess?.canDelete ? (
                          <Button size="sm" variant="light" className="tx-icon-btn text-danger ms-1" title="Delete" onClick={() => handleDeleteItem(item._id)}>
                            <Trash />
                          </Button>
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="text-center text-muted py-5">No redemptions found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <span>Showing {from.toLocaleString("en-IN")}–{to.toLocaleString("en-IN")} of {total.toLocaleString("en-IN")}</span>
            <span className="ms-2">Rows</span>
            <Form.Select
              size="sm"
              style={{ width: 90 }}
              value={paginationData.recordPerPage}
              onChange={(e: any) => setPaginationData({ ...paginationData, currentPage: 1, recordPerPage: e.target.value })}
            >
              {[100, 200, 500, 1000, 2000, 5000, 10000].map((n) => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </div>
          <PaginationNav
            align="end"
            currentPage={paginationData.currentPage}
            totalPages={resPaginateData.totalPages}
            disabled={isLoading}
            onPageChange={(page) => setPaginationData({ ...paginationData, currentPage: page })}
          />
        </div>
      </div>

      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Filters{" "}
            <span className="badge rounded-pill bg-light text-dark border ms-1">{total.toLocaleString("en-IN")}</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Date</Form.Label>
            <Row>
              <Col xs={6}>
                <Form.Label className="small text-muted">From</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  max={filterData.endDate || undefined}
                  onChange={(e) => updateFilterData({ ...filterData, startDate: e.target.value })}
                  value={filterData.startDate}
                  autoComplete="off"
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted">To</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  min={filterData.startDate || undefined}
                  onChange={(e) => updateFilterData({ ...filterData, endDate: e.target.value })}
                  value={filterData.endDate}
                  autoComplete="off"
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="redemptionCustomerType" className="fw-semibold">Customer Type</Form.Label>
            <Select
              inputId="redemptionCustomerType"
              options={customerTypeOptions}
              value={customerTypeOptions.find((option) => option.value === filterData?.customerType?.[0]) || null}
              onChange={(e: any) => updateFilterData({ ...filterData, customerType: e ? [e.value] : [] })}
              isClearable
              isSearchable={false}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold d-block">Mode</Form.Label>
            {Array.isArray(redeemTypeData) &&
              redeemTypeData.map((item: any) => (
                <Form.Check
                  key={item}
                  id={`redemption-mode-${item}`}
                  type="checkbox"
                  className="mb-2"
                  label={item}
                  checked={Array.isArray(filterData.type) && filterData.type.includes(item)}
                  onChange={(e) => toggleFilterValue("type", item, e.target.checked)}
                />
              ))}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold d-block">Status</Form.Label>
            {REDEMPTION_STATUS_OPTIONS.map((option) => (
              <Form.Check
                key={option.value}
                id={`redemption-status-${option.value}`}
                type="checkbox"
                className="mb-2"
                label={option.label}
                checked={statusList.includes(option.value)}
                onChange={(e) => toggleFilterValue("status", option.value, e.target.checked)}
              />
            ))}
          </Form.Group>

          <div className="d-flex gap-2 pt-2">
            <Button variant="outline-secondary" className="flex-fill" onClick={() => updateFilterData(initialFilterRedemption)}>
              Clear all
            </Button>
            <Button variant="dark" className="flex-fill" onClick={() => setShowFilters(false)}>
              Show {total.toLocaleString("en-IN")} redemptions
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showImport} onHide={() => !isImporting && setShowImport(false)} centered>
        <Modal.Header closeButton={!isImporting}>
          <Modal.Title>Redemption Status Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {importStatus ? (
            <Alert variant={importStatus.type} className="py-2">
              {importStatus.type === "info" ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              {importStatus.text}
            </Alert>
          ) : null}
          <div className="small text-muted mb-3">Columns: redemptionid, status, transactionID, details, paymentDate</div>
          <Button size="sm" className="cd-btn-outline mb-3" onClick={handleExportTemplate}><Download /> Template</Button>
          <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} disabled={isImporting} className="mb-2" />
          <Button variant="dark" className="w-100" disabled={isImporting || !requestFileData.length} onClick={handleFileUploadSubmit}>
            {isImporting ? <Spinner animation="border" size="sm" /> : <Upload />} Upload{requestFileData.length ? ` ${requestFileData.length} rows` : ""}
          </Button>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
