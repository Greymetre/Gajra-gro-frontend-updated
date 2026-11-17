import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Col,
  Dropdown,
  Row,
  Table,
  Image,
  Spinner,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  ArrowLeftRight,
  Download,
  FileEarmarkArrowUp,
  PencilSquare,
  PlusCircle,
  QrCode,
  Search,
  Trash,
  Upload,
  X,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
  backendGetAllCoupons,
  backendDeleteCoupon,
  backendSearchCoupons,
  backendGetExportAllCoupons,
  backendPostImportQrUpdate,
  replacePackageNumber
} from "../../helpers/backend_helper";
import * as XLSX from "xlsx";
import {
  EDIT_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
  EXCEL_DEMO_IMAGE,
  WHITE_TRASH_IMAGE,
} from "../../utils/constant";
import { ModuleAccessInterface } from "../../interfaces/setting.interface";
import debounce from "lodash.debounce";

import { ScanCoupon } from "../../interfaces/coupon.interface";
import { date } from "yup";

export default function Coupons() {
  const router = useRouter();
  // const [couponExport, setCouponExport] = useState([])
  const [couponExport, setCouponExport] = useState<ScanCoupon[]>([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState("");
  const [oldPackageSlip, setOldPackageSlip] = useState("");
  const [newPackageSlip, setNewPackageSlip] = useState("");
  const qrUpdateFileInputRef = useRef<HTMLInputElement>(null);
  const [isQrUpdateLoading, setIsQrUpdateLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  // today in IST (toISOString alone gives yesterday before 5:30 am IST)
  const today: string = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: today,
    endDate: today,
  });
  const permissionData = useSelector(
    (state: any) => state?.permission?.permission,
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "coupons.read":
          return { ...acc, canRead: true };
        case "coupons.update":
          return { ...acc, canUpdate: true };
        case "coupons.delete":
          return { ...acc, canDelete: true };
        case "coupons.create":
          return { ...acc, canCreate: true };
        case "coupons.export":
          return { ...acc, canExport: true };
        case "coupons.import":
          return { ...acc, canImport: true };
        case "coupons.search":
          return { ...acc, canSearch: true };
        default:
          return acc;
      }
    }, {});

  const [data, setData] = useState(null);
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  const couponList = useSelector((state: any) =>
    state?.coupons?.coupons.filter(
      (item: any, index: any, self: any) =>
        index === self.findIndex((i: any) => i.profileName == item.profileName),
    ),
  );

  const dispatch = useDispatch();
  const fetchCustomers = async (
    startDate?: string,
  endDate?: string,
   searchValue?: string) => {
    setIsLoading(true);
    try {
      // Always send current start/end date filter keys (backend expects startDate, endDate)
      const res = await backendGetAllCoupons({
        startDate: startDate ?? dateFilter.startDate, // ✅ always latest
        endDate: endDate ?? dateFilter.endDate, // ✅ always latest
        search: searchValue ?? search, // ✅ always latest

      });

      if (!res?.isError) {
        setCouponExport(res.data);
        dispatch({
          type: "GET_COUPONS",
          payload: res.data,
        });
      } else {
        // Backend responded with isError=true (e.g. "Data Not Found") – show empty list, no crash
        setCouponExport([]);
        dispatch({
          type: "GET_COUPONS",
          payload: [],
        });
      }
    } catch (error) {
      // For HTTP 500 / network errors, just show empty list instead of unhandled runtime error
      console.error("Error fetching coupons list", error);
      setCouponExport([]);
      dispatch({
        type: "GET_COUPONS",
        payload: [],
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
     
    fetchCustomers();
    
  }, []);


 
const debouncedFetch = useMemo(
  () =>
    debounce((startDate:string, endDate:string, searchValue: string) => {
      fetchCustomers(startDate, endDate, searchValue);
    }, 500),
  []
);

useEffect(() => {
  debouncedFetch(dateFilter.startDate , dateFilter.endDate , search);

  return () => {
    debouncedFetch.cancel();
  };
}, [search]);


  const handleApplyDateFilter = () => {
    fetchCustomers(dateFilter.startDate, dateFilter.endDate);
  };

  const handleResetDateFilter = () => {
    const t = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
    const reset = { startDate: t, endDate: t };
    setDateFilter(reset);
    // fetch with reset dates (handled safely inside fetchCustomers)
    fetchCustomers(reset.startDate, reset.endDate);
  };

  const [showReplace, setShowReplace] = useState(false);
  const [replaceStatus, setReplaceStatus] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [showInvoiceUpdate, setShowInvoiceUpdate] = useState(false);

  // quick date ranges (IST dates as yyyy-mm-dd)
  const istDay = (offsetDays = 0) => new Date(Date.now() + 330 * 60000 - offsetDays * 86400000).toISOString().slice(0, 10);
  const applyRange = (startDate: string, endDate: string) => {
    setDateFilter({ startDate, endDate });
    fetchCustomers(startDate, endDate);
  };
  const quickRanges = [
    { label: "Today", start: istDay(0), end: istDay(0) },
    { label: "Last 7 days", start: istDay(6), end: istDay(0) },
    { label: "Last 30 days", start: istDay(29), end: istDay(0) },
    { label: "This month", start: `${istDay(0).slice(0, 8)}01`, end: istDay(0) },
  ];

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("Delete this QR code batch? Its coupons will be removed.")) return;
    backendDeleteCoupon(id)
      .then((result) => {
        if (!result.isError) {
          fetchCustomers();
        } else {
        }
      })
      .catch((err) => {});
  };

  const handleReplacePackageSlip = () => {
    if (!window.confirm(`Replace packing slip "${oldPackageSlip}" with "${newPackageSlip}" on all its QR codes?`)) return;
    setIsReplacing(true);
    setReplaceStatus(null);
    replacePackageNumber({ oldPackingSlip: oldPackageSlip.trim(), newPackingSlip: newPackageSlip.trim() })
      .then((result) => {
        if (!result.isError) {
          setReplaceStatus({ type: "success", text: result.message || `Packing slip ${oldPackageSlip} replaced with ${newPackageSlip}.` });
          setOldPackageSlip("");
          setNewPackageSlip("");
          fetchCustomers();
        } else {
          setReplaceStatus({ type: "danger", text: result.message || "Packing slip could not be replaced." });
        }
      })
      .catch((err) => {
        setReplaceStatus({ type: "danger", text: err?.response?.data?.message || "Packing slip could not be replaced." });
      })
      .finally(() => setIsReplacing(false));
  };


  

  // const handleOnExport = async () => {
  //   var wb = XLSX.utils.book_new(),
  //     ws = XLSX.utils.json_to_sheet(couponExport)
  //   XLSX.utils.book_append_sheet(wb, ws, "mysheet1");
  //   XLSX.writeFile(wb, "coupons.xlsx");
  // }

  /// interface for excel row
  interface ExcelRow {
    _id: string;
    profileName: string;
    couponCount: number;
    customerType: string;
    productName: string;
    productNo: string;
    categoryName: string;
    categoryid: string;
    createdAt: string;
  }

  const handleOnExport = async () => {
    // Create a new workbook
    var wb = XLSX.utils.book_new();

    // Prepare data for the new sheet
    const exportData: ExcelRow[] = couponExport.map((coupon) => {
      // Create an object for each coupon
      const row: ExcelRow = {
        _id: coupon._id || "",
        profileName: coupon.profileName,
        couponCount: coupon.couponCount,
        customerType: coupon.customerType.join(", "),
        productName: coupon.productName,
        productNo: coupon.productNo,
        categoryName: coupon.categoryName,
        categoryid: coupon.categoryid,
        createdAt: coupon.createdAt,
      };
      return row; // Return the constructed row
    });

    // Convert the prepared data to a worksheet
    var ws = XLSX.utils.json_to_sheet(exportData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "mysheet1");

    // Write the workbook to a file
    XLSX.writeFile(wb, "coupons.xlsx");
  };

  const handleOnExportAll = async () => {
    setIsLoading(true);
    try {
      const res = await backendGetExportAllCoupons({
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate,
      });

      if (!res?.isError && res.data) {
        // Flatten the data: one row per coupon code
        const exportData: any[] = [];
        res.data.forEach((profile: any) => {
          if (profile.coupons && Array.isArray(profile.coupons)) {
            profile.coupons.forEach((coupon: any) => {
              const isMechanic = coupon.customerType === "Mechanic";
              const isRetailer = coupon.customerType === "Retailer";

              exportData.push({
                _id: profile._id,
                profileName: profile.profileName,
                categoryName: profile.categoryName,
                MDES: profile.model,
                PDES: profile.name,
                OEPARTNO: profile.partNo,
                "Year/Month Pkd": profile.createdAt
                  ? new Date(profile.createdAt).toISOString().slice(0, 7)
                  : "",
                MRP: profile.mrp,
                GG: profile.productNo,
                MPoints: profile.points,
                MCoupons: isMechanic ? coupon.coupon : "",
                "M Scan Status":
                  coupon.mScanStatus || profile.mScanStatus || "N",
                RPoints: profile.rPoints,
                RCoupons: isRetailer ? coupon.coupon : "",
                "R Scan Status":
                  coupon.rScanStatus || profile.rScanStatus || "N",
                "PACKING SLIP NO": profile.packingList || "",
                "INVOICE NO":
                  profile.invoiceNo || profile.invoiceNumber || "",
                "INVOICE DATE":
                  profile.invoiceDate || "",
                "DEALER CODE":
                  profile.dealerCode || profile.distributorCode || "",
                "DEALER NAME":
                  profile.dealerName || profile.distributorName || "",
                City: profile.city || "",
                State: profile.state || "",
              });
            });
          }
        });

        if (exportData.length === 0) {
          alert("No coupon data found for the selected range.");
          return;
        }

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "All Coupons");
        XLSX.writeFile(
          wb,
          `all_coupons_${dateFilter.startDate}_to_${dateFilter.endDate}.xlsx`,
        );
      } else {
        alert("Failed to fetch coupon details for export.");
      }
    } catch (error) {
      console.error("Error exporting all coupons", error);
      alert("An error occurred during export.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQrUpdateTemplate = () => {
    try {
      const headings = [
        "Packing Slip No",
        "Invoice No",
        "Invoice Date (DD/MM/YYYY)",
        "Dealer Code",
        "Dealer Name",
        "State",
        "City",
      ];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([headings]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Update");
      XLSX.writeFile(workbook, "qr_update_template.xlsx");
    } catch (error) {
      console.error("Error downloading QR update template", error);
      alert("Unable to download the invoice update template.");
    }
  };

  const handleImportQrUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsQrUpdateLoading(true);
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(
        firstSheet,
        { header: 1, defval: "", raw: true },
      );

      if (sheetRows.length < 2) {
        alert("The selected file does not contain any data.");
        return;
      }

      const requiredColumns = [
        "Packing Slip No",
        "Invoice No",
        "Invoice Date (DD/MM/YYYY)",
        "Dealer Code",
        "Dealer Name",
        "State",
        "City",
      ];

      const normalizeHeading = (value: unknown) =>
        String(value ?? "")
          .replace(/\u00a0/g, " ")
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[.:]+$/g, "")
          .toLowerCase();

      const headingAliases: Record<string, string> = {
        "packing slip no": "Packing Slip No",
        "packing slip number": "Packing Slip No",
        "packing no": "Packing Slip No",
        "invoice no": "Invoice No",
        "invoice number": "Invoice No",
        "invoice date (dd/mm/yyyy)": "Invoice Date (DD/MM/YYYY)",
        "invoice date": "Invoice Date (DD/MM/YYYY)",
        "invoicedate": "Invoice Date (DD/MM/YYYY)",
        "dealer code": "Dealer Code",
        code: "Dealer Code",
        "dealer name": "Dealer Name",
        name: "Dealer Name",
        state: "State",
        city: "City",
      };

      const canonicalHeadings = sheetRows[0].map(
        (heading) => headingAliases[normalizeHeading(heading)] || "",
      );
      const missingColumns = requiredColumns.filter(
        (column) => !canonicalHeadings.includes(column),
      );

      if (missingColumns.length) {
        alert(`Missing required columns: ${missingColumns.join(", ")}`);
        return;
      }

      const rows = sheetRows
        .slice(1)
        .filter((row) => row.some((value) => String(value ?? "").trim() !== ""))
        .map((row) =>
          canonicalHeadings.reduce<Record<string, unknown>>(
            (record, heading, index) => {
              if (heading) record[heading] = row[index] ?? "";
              return record;
            },
            {},
          ),
        );

      if (!rows.length) {
        alert("The selected file does not contain any data.");
        return;
      }

      const res = await backendPostImportQrUpdate({ data: rows });
      const responseData = res?.data || res;
      const missingPackingSlips =
        responseData?.missingPackingSlips ||
        responseData?.missingPackingSlipNos ||
        responseData?.missingValues ||
        responseData?.notFound;

      if (
        res?.isError ||
        (Array.isArray(missingPackingSlips) && missingPackingSlips.length)
      ) {
        const missingMessage =
          Array.isArray(missingPackingSlips) && missingPackingSlips.length
            ? ` Missing Packing Slip No: ${missingPackingSlips
                .map((value: unknown) =>
                  typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value),
                )
                .join(", ")}. No records were updated.`
            : "";
        alert(
          `${res?.message || "Invoice details could not be updated."}${missingMessage}`,
        );
        return;
      }

      alert(res?.message || "Invoice details updated successfully.");
      fetchCustomers();
    } catch (error) {
      console.error("Error importing QR invoice updates", error);
      const apiError = (error as any)?.response?.data;
      const errorData = apiError?.data || apiError;
      const missingPackingSlips =
        errorData?.missingPackingSlips ||
        errorData?.missingPackingSlipNos ||
        errorData?.missingValues ||
        errorData?.notFound;
      const missingMessage =
        Array.isArray(missingPackingSlips) && missingPackingSlips.length
          ? ` Missing Packing Slip No: ${missingPackingSlips
              .map((value: unknown) =>
                typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value),
              )
              .join(", ")}. No records were updated.`
          : "";
      alert(
        `${apiError?.message || "Unable to import the file. Please use the provided template."}${missingMessage}`,
      );
    } finally {
      event.target.value = "";
      setIsQrUpdateLoading(false);
    }
  };

  const list: any[] = Array.isArray(couponList) ? couponList : [];
  const totalCoupons = list.reduce((sum, item) => sum + (Number(item.couponCount) || 0), 0);
  const rangeLabel = dateFilter.startDate === dateFilter.endDate
    ? dateFilter.startDate
    : `${dateFilter.startDate} → ${dateFilter.endDate}`;
  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">QR Codes</h3>
          <div className="text-muted small">
            {list.length.toLocaleString("en-IN")} batches · {totalCoupons.toLocaleString("en-IN")} coupons · {rangeLabel}
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {moduleAccess?.canSearch ? (
            <Link href={{ pathname: "/coupons/search" }}>
              <Button className="cd-btn cd-btn-outline"><Search /> Get Coupon</Button>
            </Link>
          ) : null}
          {moduleAccess?.canExport ? (
            <Dropdown>
              <Dropdown.Toggle className="cd-btn cd-btn-outline" id="qr-export">
                <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleOnExport}>This list (batches)</Dropdown.Item>
                <Dropdown.Item onClick={handleOnExportAll}>All coupons in the date range</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : null}
          <Dropdown>
            <Dropdown.Toggle className="cd-btn cd-btn-outline" id="qr-tools">Tools</Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => { setReplaceStatus(null); setShowReplace(true); }}>
                <ArrowLeftRight className="me-2" /> Replace packing slip no.
              </Dropdown.Item>
              {moduleAccess?.canImport ? (
                <Dropdown.Item onClick={() => setShowInvoiceUpdate(true)}>
                  <FileEarmarkArrowUp className="me-2" /> Update invoice details
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
          {moduleAccess?.canCreate ? (
            <Link href={{ pathname: "/coupons/create" }}>
              <Button variant="dark" className="cd-btn"><PlusCircle /> Generate QR Code</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="tx-card">
        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div className="flex-grow-1" style={{ minWidth: 260, maxWidth: 420 }}>
            <Form.Label className="small text-muted mb-1">Search</Form.Label>
            <InputGroup>
              <InputGroup.Text><Search /></InputGroup.Text>
              <Form.Control
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                autoComplete="off"
                placeholder="Packing slip / GG No / customer type"
              />
              {search ? <Button variant="outline-secondary" onClick={() => setSearch("")} title="Clear search"><X /></Button> : null}
            </InputGroup>
          </div>
          <div>
            <Form.Label className="small text-muted mb-1">From</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter.startDate}
              max={dateFilter.endDate || undefined}
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
            />
          </div>
          <div>
            <Form.Label className="small text-muted mb-1">To</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter.endDate}
              min={dateFilter.startDate}
              onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
            />
          </div>
          <div className="d-flex gap-2">
            <Button variant="dark" onClick={handleApplyDateFilter}>Apply</Button>
            <Button variant="outline-secondary" onClick={handleResetDateFilter}>Reset</Button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {quickRanges.map((range) => (
            <button
              type="button"
              key={range.label}
              className={`rd-status-tab ${dateFilter.startDate === range.start && dateFilter.endDate === range.end ? "active" : ""}`}
              onClick={() => applyRange(range.start, range.end)}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Profile Name</th>
                <th className="text-end">Coupons</th>
                <th>GG No</th>
                <th>Customer Type</th>
                <th>Packing Slip No</th>
                <th>Date</th>
                {moduleAccess?.canUpdate || moduleAccess?.canDelete ? <th className="text-end">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : list.length ? (
                list.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <Link href={{ pathname: "/coupons/" + item._id }} className="tx-firm d-inline-flex align-items-center gap-2">
                        <QrCode /> {item.profileName || "-"}
                      </Link>
                      {item.categoryName ? <div className="tx-sub">{item.categoryName}</div> : null}
                    </td>
                    <td className="text-end"><span className="rd-points">{Number(item.couponCount || 0).toLocaleString("en-IN")}</span></td>
                    <td>{item.productNo || "-"}</td>
                    <td>
                      {(Array.isArray(item.customerType) ? item.customerType : item.customerType ? [item.customerType] : []).map((type: string) => (
                        <Badge key={type} bg={type === "Mechanic" ? "primary" : "info"} className="me-1 rd-status">{type}</Badge>
                      ))}
                      {!item.customerType || (Array.isArray(item.customerType) && !item.customerType.length) ? "-" : null}
                    </td>
                    <td className="tx-mono">{item.packingList || "-"}</td>
                    <td className="text-nowrap">{formatDate(item.createdAt)}</td>
                    {moduleAccess?.canUpdate || moduleAccess?.canDelete ? (
                      <td className="text-end text-nowrap">
                        {moduleAccess?.canUpdate ? (
                          <Link href={{ pathname: "/coupons/create", query: { id: item._id } }}>
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
                <tr><td colSpan={8} className="text-center text-muted py-5">No QR codes for {rangeLabel}. Try another date range.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showReplace} onHide={() => !isReplacing && setShowReplace(false)} centered>
        <Modal.Header closeButton={!isReplacing}>
          <Modal.Title>Replace Packing Slip No.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {replaceStatus ? <Alert variant={replaceStatus.type} className="py-2">{replaceStatus.text}</Alert> : null}
          <Form.Group className="mb-3">
            <Form.Label>Old packing slip no.</Form.Label>
            <Form.Control value={oldPackageSlip} onChange={(e) => setOldPackageSlip(e.target.value)} autoComplete="off" placeholder="e.g. PS-1023" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New packing slip no.</Form.Label>
            <Form.Control value={newPackageSlip} onChange={(e) => setNewPackageSlip(e.target.value)} autoComplete="off" placeholder="e.g. PS-1024" />
          </Form.Group>
          <Button
            variant="dark"
            className="w-100"
            onClick={handleReplacePackageSlip}
            disabled={isReplacing || !oldPackageSlip.trim() || !newPackageSlip.trim()}
          >
            {isReplacing ? <Spinner animation="border" size="sm" /> : <ArrowLeftRight />} Replace
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showInvoiceUpdate} onHide={() => !isQrUpdateLoading && setShowInvoiceUpdate(false)} centered>
        <Modal.Header closeButton={!isQrUpdateLoading}>
          <Modal.Title>Update Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="small text-muted mb-3">
            Adds invoice no., invoice date and dealer to the QR codes of each packing slip.
            Columns: Packing Slip No, Invoice No, Invoice Date (DD/MM/YYYY), Dealer Code, Dealer Name, State, City.
          </div>
          <Button size="sm" className="cd-btn-outline mb-3" onClick={handleDownloadQrUpdateTemplate} disabled={isQrUpdateLoading}>
            <Download /> Template
          </Button>
          <input ref={qrUpdateFileInputRef} type="file" accept=".xlsx,.xls" onChange={handleImportQrUpdate} className="d-none" />
          <Button variant="dark" className="w-100" disabled={isQrUpdateLoading} onClick={() => qrUpdateFileInputRef.current?.click()}>
            {isQrUpdateLoading ? <Spinner animation="border" size="sm" /> : <Upload />} Choose file and upload
          </Button>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
