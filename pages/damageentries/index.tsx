import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Spinner, Form } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for the date picker
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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] =
  useState<string>("");
 
  
const [resPaginateData, setResPaginateData] =
  useState<ResPaginateInterface>(initialResPaginate);
  const DamageEntriesList = useSelector((state: any) => state?.coupons?.coupons);
   const requestOption = {
     recordPerPage : paginationData.recordPerPage , 
     statusType :status ,
     startDate : startDate ? moment(startDate).format("YYYY-MM-DD") : "" , 
     endDate : endDate? moment(endDate).format("YYYY-MM-DD") : "" , 
     currentPage:paginationData.currentPage,
     search:search

   }
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    await backendGetAllDamageCoupons(requestOption).then((res) => {
      if (!res.isError) {
        setCouponExport(res.data)
      }
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
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='Damage QR List' />
     
      <Row> 
         <Col xl={2} md={12} > 
        
              <Form.Group className="d-flex flex-column gap-1">
                <Form.Label className="p-0 m-0">Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e: any) => {
                    setstatus( e.target.value,);
                  }}
                >
                  <option value="">Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hold">Hold</option>

               
                </Form.Select>
              </Form.Group>
            
          </Col>
          <Col xl={5} lg={12} md={12} > 
          <div className='d-flex gap-3' >
            <div className='d-flex flex-column gap-1 '  >
            <label htmlFor=""> Start Date </label>
          <DatePicker
        selected={startDate}
        //@ts-ignore
        onChange={(date: Date | undefined) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className='form-control'

      />
      </div>
      <div className='d-flex flex-column gap-1 '  >

            <label htmlFor=""> End Date </label>

      <DatePicker
        selected={endDate}
        //@ts-ignore
        onChange={(date: Date | undefined) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className='form-control'
      />
      </div>
      </div>

           </Col>
           <Col xl={2} md={12} > 
        
           <Form.Group className="d-flex flex-column gap-1">
  <Form.Label className="p-0 m-0">Search</Form.Label>
  <Form.Control
    type="search"
    value={search}
    onChange={(e: any) => setSearch(e.target.value)}
  />
</Form.Group>
      


    </Col>
    {/* <Col xl={2} md={12} > 
<Form.Group className="d-flex flex-column gap-1">
  <Form.Label className="p-0 m-0">Search Transection</Form.Label>
  <Form.Control
    type="search"
    value={newpaginationData?.search}
    onChange={(e) => {
      setnewPaginationData({
        ...newpaginationData,
        search: e.target.value,
      });
    }}  />
</Form.Group>   </Col> */}
         </Row>
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4 mt-4">
            <Col md={6}>
              <h3 className="card-body">Damage QR List({Array.isArray(DamageEntriesList) ? DamageEntriesList.length : '0'})</h3>
            </Col>
         
            <Col md={6} className="text-end  mb-3">
              {/* {moduleAccess?.canSearch ? ( */}
                <Link
                  href={{
                    pathname: '/coupons/search',
                  }}
                >
                </Link>
                {/* ) 
                : null} */}
              {/* {moduleAccess?.canExport ? ( */}
                <Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel</Button>
                {/* ) : null} */}
              {/* {moduleAccess?.canCreate ? ( */}
                <Link
                href={{
                  pathname: '/damageentries/create',
                }}
              >
                <Button className="btn btn-dark  "><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} /> Add Entries</Button>
              </Link>
              
              {/* ) : null */}
              {/* } */}
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
                              <th>Date</th>
                              <th>Firm Name</th>
                              <th>Customer Type</th>
                              <th>Status</th>
                              <th>Contact Person</th>
                              <th>Mobile Number</th>
                              <th>COUPON Code (Damage)</th>
                              <th>GG Number</th>
                              <th>Attachement</th>
                              <th>Remark</th>


                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(DamageEntriesList) && DamageEntriesList.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{new Date(item.createdAt).toDateString()}</td>


                                  <td><Link className="mb-3"
                                   href={{
                                    pathname: "/customer/" + item.customerid,
                                  }}
                                  >{item.firmName}</Link></td>
                                     <td>{item.customerType}</td>
                                  <td> 
                                    <button 
                                  disabled={item.statusType == "Approved" || item.statusType == "Rejected"   }
                                  onClick={() =>  { setEntriesData(item) ; setModalShow(true) }  }  
                                  className={`${item.statusType == "Pending" ? "btn-warning" : item.statusType == "Approved" ? "btn-success" : item.statusType == "Hold"  ? 'btn-info'  :"btn-danger" } btn `} > 
                                  {item.statusType} 
                                  </button> 
                                   </td>

                                  <td>{item.contactPerson}</td>
                                  <td>{item.mobile}</td>
                                  <td>{item.couponCode}</td>
                                  <td>{item.couponGg}</td>
                                  <td>
                                    {
                                     item?.couponImage?.map((res:any ,i :any)=>(
                                      <Link  target="_blank"  key={i} 
                                      href={
                                      IMAGE_URL+res } >
                                       <img  src={ IMAGE_URL+res}  alt='attachement image' width={80} className='mx-1' style={{borderRadius:5}}  /> 
                                       </Link>
                                      ))
                                    }
                                  
                                     </td>

                                  <td>{item.remark}</td>
                                  

                                   

                                 
                                </tr>
                              )
                            })}
                          </tbody>
                   
                        </Table>
                      </div>
                    </div>
                  </div>
                </Col>
                {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
              </div>
            </Card>
            
          </Row>
        </Col>
      </Row>
    
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
