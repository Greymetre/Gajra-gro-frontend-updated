import React, { useEffect, useState } from "react";
// import Router, { useRouter } from 'next/router';
import Select from "react-select";

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
  Spinner,
  InputGroup,
  Modal,
  Offcanvas,
} from "react-bootstrap";
import {
  Download,
  Funnel,
  PencilSquare,
  PlusCircle,
  Search,
  Trash,
  Upload,
  X,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
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
  // search box: the list reloads 400 ms after typing stops instead of on every key
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationData((prev) => (prev.search === searchText ? prev : { ...prev, currentPage: 1, search: searchText }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);
  const [showImport, setShowImport] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "danger" | "info"; text: string } | null>(null);
  const [isImporting, setIsImporting] = useState<"" | "coupon" | "other">("");
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
    if (!window.confirm("Delete this transaction? The customer's points will change.")) return;
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
      if (!dataArray.length) {
        setImportStatus({ type: "danger", text: "Please choose a Coupon Scan file first." });
        return;
      }
      setIsImporting("coupon");
      setImportStatus({ type: "info", text: `Uploading ${dataArray.length} coupon rows…` });
      backendImportCouponsToScan(dataArray)
        .then((result) => {
          if (!result.isError) {
            setImportStatus({ type: "success", text: `Coupon Scan uploaded (${dataArray.length} rows).` });
            setRequestFileData([]);
            fetchTransactions();
          } else {
            setImportStatus({ type: "danger", text: result.message || "Coupon Scan upload failed." });
          }
        })
        .catch((err) => {
          setImportStatus({ type: "danger", text: err?.response?.data?.message || "Coupon Scan upload failed." });
        })
        .finally(() => setIsImporting(""));
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
      if (!dataArray.length) {
        setImportStatus({ type: "danger", text: "Please choose an Other Transaction file first." });
        return;
      }
      setIsImporting("other");
      setImportStatus({ type: "info", text: `Uploading ${dataArray.length} transaction rows…` });
      backendImportTransactions(dataArray)
        .then((result) => {
          if (!result.isError) {
            setImportStatus({ type: "success", text: `Other Transaction uploaded (${dataArray.length} rows).` });
            setRequestTransactionFileData([]);
            fetchTransactions();
          } else {
            setImportStatus({ type: "danger", text: result.message || "Transaction upload failed." });
          }
        })
        .catch((err) => {
          setImportStatus({ type: "danger", text: err?.response?.data?.message || "Transaction upload failed." });
        })
        .finally(() => setIsImporting(""));
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

  const total = Number(resPaginateData.totalDocs) || 0;
  const perPage = Number(paginationData.recordPerPage) || 10;
  const from = total ? (paginationData.currentPage - 1) * perPage + 1 : 0;
  const to = Math.min(paginationData.currentPage * perPage, total);
  const activeFilters: Array<{ key: string; label: string; clear: () => void }> = [];
  if (paginationData.startDate || paginationData.endDate) {
    activeFilters.push({
      key: "date",
      label: `Date: ${paginationData.startDate || "…"} → ${paginationData.endDate || "…"}`,
      clear: () => setPaginationData({ ...paginationData, currentPage: 1, startDate: "", endDate: "" }),
    });
  }
  if (paginationData.customerType?.length) {
    activeFilters.push({
      key: "ctype",
      label: `Customer: ${paginationData.customerType.join(", ")}`,
      clear: () => setPaginationData({ ...paginationData, currentPage: 1, customerType: [] }),
    });
  }
  (paginationData.pointType || []).forEach((type: string) => {
    activeFilters.push({
      key: `pt-${type}`,
      label: type === "all" ? "All credits (Cr)" : type,
      clear: () => setPaginationData({
        ...paginationData,
        currentPage: 1,
        pointType: (paginationData.pointType || []).filter((t: string) => t !== type),
      }),
    });
  });

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return value;
    return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Transactions</h3>
          <div className="text-muted small">{total.toLocaleString("en-IN")} transactions{activeFilters.length || paginationData.search ? " match the current filters" : ""}</div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {moduleAccess?.canImport && (
            <Button className="cd-btn cd-btn-outline" onClick={() => { setImportStatus(null); setShowImport(true); }}>
              <Upload /> Import
            </Button>
          )}
          {moduleAccess?.canExport && (
            <Button className="cd-btn cd-btn-outline" onClick={handleOnExport} title="Exports the rows on this page">
              <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
            </Button>
          )}
          <Button className="cd-btn cd-btn-outline" onClick={() => setShowFilters(true)}>
            <Funnel /> Filters
            {activeFilters.length ? <Badge bg="dark" pill className="ms-2">{activeFilters.length}</Badge> : null}
          </Button>
          {moduleAccess?.canCreate && (
            <Link href={{ pathname: "/transaction/create" }}>
              <Button variant="dark" className="cd-btn"><PlusCircle /> Transaction</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <InputGroup className="tx-search">
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoComplete="off"
              placeholder="Search firm, contact person, coupon…"
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
            <Button variant="link" size="sm" className="text-muted" onClick={clearAllFilters}>Clear all</Button>
          ) : null}
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>Ref #</th>
                <th>Customer</th>
                <th className="text-end">Points</th>
                <th>Coupon</th>
                <th>GG No</th>
                <th>Category</th>
                <th>Point Type</th>
                <th>Packing Slip</th>
                <th>Date</th>
                <th>Created By</th>
                {moduleAccess?.canUpdate || moduleAccess?.canDelete ? <th className="text-end">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={11} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : Array.isArray(transactionData) && transactionData.length ? (
                transactionData.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="text-muted">{item.refno || "-"}</td>
                    <td>
                      <Link href={{ pathname: "/transaction/" + item._id }} className="tx-firm">{item.firmName || "-"}</Link>
                      {item.contactPerson ? <div className="tx-sub">{item.contactPerson}</div> : null}
                    </td>
                    <td className="text-end">
                      <span className={`tx-points ${item.transactionType === "Dr" ? "dr" : "cr"}`}>
                        {item.transactionType === "Dr" ? "−" : "+"}{Number(item.points ?? 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="tx-mono">{item.coupon || "-"}</td>
                    <td>{item.productNo || "-"}</td>
                    <td className="tx-ellipsis" title={item.categoryName}>{item.categoryName || "-"}</td>
                    <td className="tx-ellipsis" title={item.pointType}>{item.pointType || "-"}</td>
                    <td>{item.packingList || "-"}</td>
                    <td className="text-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="text-nowrap">{item.creadtedByContactPerson || "-"}</td>
                    {moduleAccess?.canUpdate || moduleAccess?.canDelete ? (
                      <td className="text-end text-nowrap">
                        {moduleAccess?.canUpdate && (
                          <Link href={{ pathname: "/transaction/create", query: { id: item._id } }}>
                            <Button size="sm" variant="light" className="tx-icon-btn" title="Edit"><PencilSquare /></Button>
                          </Link>
                        )}
                        {moduleAccess?.canDelete && (
                          <Button size="sm" variant="light" className="tx-icon-btn text-danger ms-1" title="Delete" onClick={() => handleDeleteItem(item._id)}>
                            <Trash />
                          </Button>
                        )}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={11} className="text-center text-muted py-5">No transactions found</td></tr>
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
              {[10, 50, 100, 200, 500, 1000, 2000, 5000, 10000].map((n) => <option key={n} value={n}>{n}</option>)}
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
              onChange={(e: any) => setPaginationData({ ...paginationData, currentPage: 1, customerType: e ? [e.value] : [] })}
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
              value={(pointTypeOptions || []).filter((option) => (paginationData.pointType || []).includes(option.value))}
              onChange={(selected: any) =>
                setPaginationData({ ...paginationData, currentPage: 1, pointType: (selected || []).map((option: any) => option.value) })
              }
            />
            <Form.Text className="text-muted">Schemes come from Loyalty Scheme, plus every type already used</Form.Text>
          </Form.Group>

          <div className="d-flex gap-2 pt-2">
            <Button variant="outline-secondary" className="flex-fill" onClick={clearAllFilters}>Clear all</Button>
            <Button variant="dark" className="flex-fill" onClick={() => setShowFilters(false)}>
              Show {total.toLocaleString("en-IN")} transactions
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showImport} onHide={() => !isImporting && setShowImport(false)} centered size="lg">
        <Modal.Header closeButton={!isImporting}>
          <Modal.Title>Import Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {importStatus ? (
            <Alert variant={importStatus.type} className="py-2">
              {importStatus.type === "info" ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              {importStatus.text}
            </Alert>
          ) : null}
          <Row className="g-3">
            <Col md={6}>
              <div className="tx-import-box">
                <div className="fw-semibold mb-1">Coupon Scan</div>
                <div className="small text-muted mb-3">Columns: coupon, customerid</div>
                <Button size="sm" className="cd-btn-outline mb-3" onClick={handleCouponExportTemplate}><Download /> Template</Button>
                <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} disabled={!!isImporting} className="mb-2" />
                <Button variant="dark" className="w-100" disabled={!!isImporting || !requestFileData.length} onClick={handleFileUploadSubmit}>
                  {isImporting === "coupon" ? <Spinner animation="border" size="sm" /> : <Upload />} Upload{requestFileData.length ? ` ${requestFileData.length} rows` : ""}
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <div className="tx-import-box">
                <div className="fw-semibold mb-1">Other Transaction</div>
                <div className="small text-muted mb-3">Columns: points, customerid, pointType</div>
                <Button size="sm" className="cd-btn-outline mb-3" onClick={handleExportTemplate}><Download /> Template</Button>
                <Form.Control type="file" accept=".xlsx" onChange={handleTransactionFileChange} disabled={!!isImporting} className="mb-2" />
                <Button variant="dark" className="w-100" disabled={!!isImporting || !requestTransactionFileData.length} onClick={handleFileUploadTransactionSubmit}>
                  {isImporting === "other" ? <Spinner animation="border" size="sm" /> : <Upload />} Upload{requestTransactionFileData.length ? ` ${requestTransactionFileData.length} rows` : ""}
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Layout>
  );
});
export default Transaction;
