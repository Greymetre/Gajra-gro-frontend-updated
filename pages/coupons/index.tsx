import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Image,
  Spinner,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
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
  const today: string = new Date().toISOString().slice(0, 10);
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
    const t = new Date().toISOString().slice(0, 10);
    const reset = { startDate: t, endDate: t };
    setDateFilter(reset);
    // fetch with reset dates (handled safely inside fetchCustomers)
    fetchCustomers(reset.startDate, reset.endDate);
  };

  const handleDeleteItem = (id: string) => {
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
    replacePackageNumber({ oldPackingSlip: oldPackageSlip, newPackingSlip: newPackageSlip })
      .then((result) => {
        if (!result.isError) {
          fetchCustomers();
        } else {
        }
      })
      .catch((err) => {});
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
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        firstSheet,
        { defval: "" },
      );

      if (!rows.length) {
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
      const missingColumns = requiredColumns.filter(
        (column) => !Object.prototype.hasOwnProperty.call(rows[0], column),
      );

      if (missingColumns.length) {
        alert(`Missing required columns: ${missingColumns.join(", ")}`);
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

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "Home" }}
        secondItem={{ href: "", label: "" }}
        itemlabel="QRcode List"
      />

      <Row className="align-items-center">
        <Col md={4}>
          <h3 className="card-body">
            QRcode List({Array.isArray(couponList) ? couponList.length : "0"})
          </h3>
        </Col>
        <Col md={3}>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              autoComplete="off"
              placeholder="Search by packing slip / or GG NO / customer type"
            />
          </Form.Group>
        </Col>
        <Col md={5} className="text-end mb-3">
          <Card
            className="d-inline-block p-2 me-2 border-0"
            style={{ background: "transparent" }}
          >
            <Form>
              <Row className="g-2 align-items-end justify-content-end">
                <Col xs={12} sm="auto" className="text-start">
                  <Form.Label className="mb-1 small text-muted">
                    From
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) =>
                      setDateFilter({
                        ...dateFilter,
                        startDate: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col xs={12} sm="auto" className="text-start">
                  <Form.Label className="mb-1 small text-muted">To</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFilter.endDate}
                    min={dateFilter.startDate}
                    onChange={(e) =>
                      setDateFilter({ ...dateFilter, endDate: e.target.value })
                    }
                  />
                </Col>
                <Col xs={12} sm="auto" className="text-end">
                  <InputGroup>
                    <Button variant="dark" onClick={handleApplyDateFilter}>
                      Apply
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleResetDateFilter}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row className=" mb-4">
        <Col md={6}>
        <Row>
          <Col span={5}>
           <Form.Group className="form-group">
            <Form.Control
              type="text"
              onChange={(e) => { setOldPackageSlip(e.target.value) }}
              value={oldPackageSlip}
              autoComplete="off"
              placeholder="Enter Old Packing Slip No."
            />
          </Form.Group>
          </Col>
          <Col span={5}>
           <Form.Group className="form-group">
            <Form.Control
              type="text"
              onChange={(e) => { setNewPackageSlip(e.target.value) }}
              value={newPackageSlip}
              autoComplete="off"
              placeholder="Enter New Packing Slip No."
            />
          </Form.Group>
          </Col>
          <Col span={2}>
          <Button
  className="btn btn-dark"
  onClick={handleReplacePackageSlip}
  disabled={!oldPackageSlip || !newPackageSlip}
>
  Replace
</Button>

          </Col>



        </Row>
         

         

        </Col>

        <Col md={6} className="text-end">
          {moduleAccess?.canImport ? (
            <>
              <input
                ref={qrUpdateFileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportQrUpdate}
                className="d-none"
              />
              <Button
                onClick={handleDownloadQrUpdateTemplate}
                disabled={isQrUpdateLoading}
                className="p-2 me-2"
                variant="outline-light"
              >
                Download Invoice Template
              </Button>
              <Button
                onClick={() => qrUpdateFileInputRef.current?.click()}
                disabled={isQrUpdateLoading}
                className="p-2 me-2"
                variant="outline-light"
              >
                {isQrUpdateLoading ? (
                  <Spinner animation="border" size="sm" className="me-1" />
                ) : null}
                Update Packing Slip Invoice
              </Button>
            </>
          ) : null}
          {moduleAccess?.canSearch ? (
            <Link
              href={{
                pathname: "/coupons/search",
              }}
            >
              <Button className="btn btn-dark">
                <Search /> Get Coupon
              </Button>
            </Link>
          ) : null}
          {moduleAccess?.canExport ? (
            <>
              <Button
                onClick={handleOnExport}
                className="p-2 pr-2 me-2"
                variant="outline-light"
              >
                <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel
              </Button>
              <Button
                onClick={handleOnExportAll}
                className="p-2 pr-2"
                variant="outline-light"
              >
                <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export All Coupons
              </Button>
            </>
          ) : null}
          {moduleAccess?.canCreate ? (
            <Link
              href={{
                pathname: "/coupons/create",
              }}
            >
              <Button className="btn btn-dark">
                <Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />
                Generate QRcode
              </Button>
            </Link>
          ) : null}
        </Col>
      </Row>

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
                        <th>Profile Name</th>
                        <th>Coupons</th>
                        <th>Date</th>
                        <th>GG NO</th>
                        <th>Customer Type</th>
                        <th>PACKING SLIP NO</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(couponList) &&
                        couponList.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Link
                                  className="mb-3"
                                  href={{
                                    pathname: "/coupons/" + item._id,
                                  }}
                                >
                                  {item.profileName}
                                </Link>
                              </td>
                              <td>{item.couponCount}</td>
                              <td>{new Date(item.createdAt).toDateString()}</td>
                              <td>{item.productNo}</td>
                              {/* <td>{item.customerType?.join(', ')}</td>                             */}
                              <td>
                                {Array.isArray(item.customerType)
                                  ? item.customerType.join(", ")
                                  : item.customerType || "-"}
                              </td>
                              <td>{item.packingList}</td>
                              <td>
                                {moduleAccess?.canUpdate ? (
                                  <Link
                                    href={{
                                      pathname: "/coupons/create",
                                      query: { id: item._id },
                                    }}
                                  >
                                    <Image src={IMAGE_URL + EDIT_DEMO_IMAGE} />
                                  </Link>
                                ) : null}
                                {moduleAccess?.canDelete ? (
                                  <Button
                                    className="btn p-0 btn-icon"
                                    onClick={() => {
                                      handleDeleteItem(item._id);
                                    }}
                                  >
                                    <Image src={IMAGE_URL + RED_TRASH_IMAGE} />
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
          {isLoading ? (
            <Col xl={12} sm={12} xs={12} className="mb-3 text-center">
              <Spinner animation="border" />
            </Col>
          ) : null}
        </div>
      </Card>
    </Layout>
  );
}
