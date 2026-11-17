import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Badge, Button, Card, Col, Row, Table, Image, Spinner, Form, InputGroup } from 'react-bootstrap'
import { CheckCircle, PlusCircle, Search, X } from 'react-bootstrap-icons'
import PaginationNav from '../../components/Common/PaginationNav'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer, IconButton, Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Layout from '../../components/Layout'
import { backendGetAllCoupons, backendDeleteCoupon, backendSearchCoupons, backendGetAllDamageCoupons, backendGetAllTransactions } from '../../helpers/backend_helper'
import {
    PaginationTransInterface,
    ResPaginateInterface,
    initialPagination,
    initialResPaginate,
    initialTransPagination,
  } from "../../interfaces/pagination.interface";
import * as XLSX from 'xlsx';
import { EDIT_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, EXCEL_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import { ModuleAccessInterface } from '../../interfaces/setting.interface';

import { DamageEntriesInterface } from '../../interfaces/coupon.interface';
import moment from 'moment';
import ApprovedModal from './modal';
import {
  TransFilterInterface,
  TransactionDetailViewInterface,
  TransactionScanInterface,
  initialFilterTrans,
} from "../../interfaces/transaction.interface";


interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  if (!value && value !== 0) return null;

  return (
    <Col sm={6} className="mb-2">
      <div className="d-flex flex-column">
        <span className="text-muted small fw-semibold">{label}</span>
        <span className="fw-semibold">{value}</span>
      </div>
    </Col>
  );
};

export default function DamageEntries() {
  
  const router = useRouter()
  // const [couponExport, setCouponExport] = useState([])
  const [couponExport, setCouponExport] = useState<DamageEntriesInterface[]>([]);
 const [transactionData, setTransactionData] = useState<
    Array<TransactionDetailViewInterface>
  >([]);
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [updateAPI, setUpdateAPI] = useState(0)
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  

  // const permissionData = useSelector((state: any) => state?.permission?.permission);
  // const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
  //   switch (item) {
  //     case 'coupons.read':
  //       return { ...acc, canRead: true };
  //     case 'coupons.update':
  //       return { ...acc, canUpdate: true };
  //     case 'coupons.delete':
  //       return { ...acc, canDelete: true };
  //     case 'coupons.create':
  //       return { ...acc, canCreate: true };
  //     case 'coupons.export':
  //       return { ...acc, canExport: true };
  //     case 'coupons.import':
  //       return { ...acc, canImport: true };
  //     case 'coupons.search':
  //       return { ...acc, canSearch: true };
  //     default:
  //       return acc;
  //   }
  // }, {});

  const [data, setData] = useState(null)
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }

  const [paginationData, setPaginationData] =
  useState<PaginationTransInterface>(initialTransPagination);


  const [newpaginationData, setnewPaginationData] =
  useState<PaginationTransInterface>(initialTransPagination);

  const [status, setstatus] =
  useState<string>("");
  // dates as yyyy-mm-dd (native date inputs)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [search, setSearch] =
  useState<string>("");
  // search box text; the list reloads 400 ms after typing stops
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);
  const [totalDocs, setTotalDocs] = useState<number>(0);
 
  
const [resPaginateData, setResPaginateData] =
  useState<ResPaginateInterface>(initialResPaginate);
  const DamageEntriesList = useSelector((state: any) => state?.coupons?.coupons);
   const requestOption = {
     recordPerPage : paginationData.recordPerPage , 
     statusType :status ,
     startDate : startDate || "" ,
     endDate : endDate || "" , 
     currentPage:paginationData.currentPage,
     search:search

   }
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    setIsLoading(true)
    await backendGetAllDamageCoupons(requestOption).then((res) => {
      if (!res.isError) {
        setCouponExport(res.data)
      }
      setTotalDocs(Number(res?.data?.[0]?.paginate?.[0]?.totalDocs) || 0)
      dispatch({
        type: 'GET_COUPONS',
        payload: res.data[0]?.docs
      })
      setIsLoading(false)  
      setUpdateAPI(0)
    })
  }
  useEffect(() => {
    fetchCustomers()
  }, [status , startDate , endDate , paginationData, updateAPI,search])
  // a new filter starts again from page 1
  useEffect(() => {
    setPaginationData((prev) => (prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }))
  }, [status, startDate, endDate, search])









  const handleOnExport = () => {
    // Create a new workbook and a new worksheet
    const wb = XLSX.utils.book_new();
    
    // Define the header
    const header = [
      'Date',
      'Firm Name',
      'Contact Person',
      'Mobile Number',
      'COUPON Code (Damage)',
      'GG Number',
      'Status',
      'Remark',
    ];
  
    // Prepare data for the worksheet
    const wsData = [
      header, 
      ...DamageEntriesList.map((item: any) => [
        new Date(item.createdAt).toDateString(),
        item.firmName,
        item.contactPerson,
        item.mobile,
        item.couponCode,
        item.couponGg,
        item.statusType,
        item.remark,
      ])
    ];
  
    // Create a worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(wsData);
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Export the workbook
    XLSX.writeFile(wb, 'ExportedData.xlsx');
  };
  
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [entriesData, setEntriesData] = useState<Object>({});
  const [searchTransaction , setSearchTransaction] = useState('')
    const fetchTransactions = async () => {
   
      await backendGetAllTransactions(newpaginationData).then((res) => {
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
      if(newpaginationData?.search.length > 2 ) {

        fetchTransactions();
      }
    }, [newpaginationData]);

  return (
    <>
     {/* {!open && (
              <div
                style={{
                  position: "fixed",
                  top: "30%",
                  right: 0,
                  transform: "translateY(-50%)",
                  width: "24px",
                  height: "100px",
                  backgroundColor: "#1976d2", // Blue stripe
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  zIndex: 1300,
                  cursor: "pointer",
                }}
                onClick={toggleDrawer}
              >
                <ChevronLeft style={{ color: "white" }} />
              </div>
            )} */}
      
            {/* <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer}
              PaperProps={{
                sx: {
                  width: "500px",
                 
                },
              }}
            >
              <IconButton
                onClick={toggleDrawer}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-11px",
                  transform: "translateY(-50%)",
                  backgroundColor: "#1976d2",
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  color: "white",
                  zIndex: 1400,
                }}
              >
                <ChevronRight />
              </IconButton>
      
              <Box p={2}>
             {Array.isArray(transactionData) &&
        transactionData?.map((item, index) => (
          <Col xl={12} key={index}>
            <Card className="prod-p-card bg-white shadow-lg mb-4">
              <Card.Body>
                <h5 className="mb-3 fw-bold text-black">Customer Details</h5>
                <Row>
                  <InfoItem label="Reference No." value={item?.refno} />
                  <InfoItem label="Firm Name" value={item?.firmName} />
                  <InfoItem label="Contact Person" value={item?.contactPerson} />
                  <InfoItem label="Customer Type" value={item?.customerType} />
                  <InfoItem label="Mobile" value={item?.mobile} />
                  <InfoItem label="City" value={item?.city} />
                  <InfoItem label="State" value={item?.state} />
                  <InfoItem label="Points" value={item?.points} />
                  <InfoItem label="Redeem Balance" value={item?.redemBalance} />
                  <InfoItem label="Point Type" value={item?.pointType} />
                  <InfoItem label="Created At" value={item?.createdAt} />
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}

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
                                            setnewPaginationData({
                                              ...newpaginationData,
                                              currentPage:
                                                newpaginationData.currentPage - 1,
                                            });
                                            
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
                                            setnewPaginationData({
                                              ...newpaginationData,
                                              currentPage:
                                                newpaginationData.currentPage + 1,
                                            });
                                           
                                          }}
                                        >
                                          Next
                                        </a>
                                      </li>
                                    </ul>
                                  </nav>
                                </Col>
              </Box>
            </Drawer> */}
    <Layout>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">Damage QR Entries</h3>
          <div className="text-muted small">
            {totalDocs.toLocaleString('en-IN')} entries{status || startDate || endDate || search ? ' match the current filters' : ''}
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <Button className="cd-btn cd-btn-outline" onClick={handleOnExport} title="Exports the rows on this page">
            <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export
          </Button>
          <Link href={{ pathname: '/damageentries/create' }}>
            <Button variant="dark" className="cd-btn"><PlusCircle /> Add Entry</Button>
          </Link>
        </div>
      </div>

      <div className="tx-card">
        <div className="rd-status-tabs mb-3">
          {[
            { value: '', label: 'All', tone: '' },
            { value: 'Pending', label: 'Pending', tone: 'warning' },
            { value: 'Hold', label: 'Hold', tone: 'info' },
            { value: 'Approved', label: 'Approved', tone: 'success' },
            { value: 'Rejected', label: 'Rejected', tone: 'danger' },
          ].map((option) => (
            <button
              type="button"
              key={option.label}
              className={`rd-status-tab ${status === option.value ? 'active' : ''}`}
              onClick={() => setstatus(option.value)}
            >
              {option.tone ? <span className={`rd-dot bg-${option.tone}`} /> : null} {option.label}
            </button>
          ))}
        </div>

        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div className="flex-grow-1" style={{ minWidth: 260, maxWidth: 420 }}>
            <Form.Label className="small text-muted mb-1">Search</Form.Label>
            <InputGroup>
              <InputGroup.Text><Search /></InputGroup.Text>
              <Form.Control
                type="text"
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                autoComplete="off"
                placeholder="Firm, contact person, mobile, coupon, GG no…"
              />
              {searchText ? <Button variant="outline-secondary" onClick={() => setSearchText('')} title="Clear search"><X /></Button> : null}
            </InputGroup>
          </div>
          <div>
            <Form.Label className="small text-muted mb-1">From</Form.Label>
            <Form.Control type="date" value={startDate} max={endDate || undefined} onChange={(e: any) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Form.Label className="small text-muted mb-1">To</Form.Label>
            <Form.Control type="date" value={endDate} min={startDate || undefined} onChange={(e: any) => setEndDate(e.target.value)} />
          </div>
          {startDate || endDate ? (
            <Button variant="link" className="text-muted" onClick={() => { setStartDate(''); setEndDate('') }}>Clear dates</Button>
          ) : null}
        </div>

        <div className="tx-table-wrap">
          <Table hover className="mb-0 tx-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Coupon (Damage)</th>
                <th>GG No</th>
                <th>Photos</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
              ) : Array.isArray(DamageEntriesList) && DamageEntriesList.length ? (
                DamageEntriesList.map((item: any, index: number) => {
                  const canReview = item.statusType === 'Pending' || item.statusType === 'Hold'
                  const tone = item.statusType === 'Pending' ? 'warning'
                    : item.statusType === 'Approved' ? 'success'
                      : item.statusType === 'Hold' ? 'info' : 'danger'
                  return (
                    <tr key={item._id || index}>
                      <td className="text-muted">{(paginationData.currentPage - 1) * Number(paginationData.recordPerPage) + index + 1}</td>
                      <td className="text-nowrap">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td>
                        <Link href={{ pathname: '/customer/' + item.customerid }} className="tx-firm">{item.firmName || '-'}</Link>
                        <div className="tx-sub">
                          {[item.contactPerson, item.mobile].filter(Boolean).join(' · ')}
                          {item.customerType ? <Badge bg={item.customerType === 'Mechanic' ? 'primary' : 'info'} className="ms-2 rd-status">{item.customerType}</Badge> : null}
                        </div>
                      </td>
                      <td className="text-nowrap">
                        <Badge bg={tone} text={tone === 'warning' ? 'dark' : undefined} className="rd-status">{item.statusType || '-'}</Badge>
                        {canReview ? (
                          <Button
                            size="sm"
                            variant="dark"
                            className="ms-2 py-0 px-2"
                            onClick={() => { setEntriesData(item); setModalShow(true) }}
                          >
                            <CheckCircle /> Review
                          </Button>
                        ) : null}
                      </td>
                      <td className="tx-mono">{item.couponCode || '-'}</td>
                      <td>{item.couponGg || '-'}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {(item?.couponImage || []).map((res: any, i: any) => (
                            <Link target="_blank" key={i} href={IMAGE_URL + res}>
                              <img src={IMAGE_URL + res} alt="damage photo" className="dm-thumb" />
                            </Link>
                          ))}
                          {!(item?.couponImage || []).length ? <span className="text-muted">-</span> : null}
                        </div>
                      </td>
                      <td className="tx-ellipsis" title={item.remark}>{item.remark || '-'}</td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan={8} className="text-center text-muted py-5">No damage entries found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <span>
              Showing {totalDocs ? ((paginationData.currentPage - 1) * Number(paginationData.recordPerPage) + 1).toLocaleString('en-IN') : 0}–
              {Math.min(paginationData.currentPage * Number(paginationData.recordPerPage), totalDocs).toLocaleString('en-IN')} of {totalDocs.toLocaleString('en-IN')}
            </span>
            <span className="ms-2">Rows</span>
            <Form.Select
              size="sm"
              style={{ width: 90 }}
              value={paginationData.recordPerPage}
              onChange={(e: any) => setPaginationData({ ...paginationData, currentPage: 1, recordPerPage: e.target.value })}
            >
              {[10, 50, 100, 200, 500, 1000, 2000].map((n) => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </div>
          <PaginationNav
            align="end"
            currentPage={paginationData.currentPage}
            totalPages={Math.ceil(totalDocs / (Number(paginationData.recordPerPage) || 10))}
            disabled={isLoading}
            onPageChange={(page) => setPaginationData({ ...paginationData, currentPage: page })}
          />
        </div>
      </div>
    </Layout>
      <ApprovedModal
      approveshow={modalShow}
      setShow={() => setModalShow(false)}
      data={entriesData!}
      update={() => setUpdateAPI(1)}

    />
    </>
    
  )
}
