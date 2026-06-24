import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { backendGetAllDamageCouponsProject, backendGetAllTransactions, backendGetApprovedQR, backendSearchCoupons } from '../../helpers/backend_helper';
import Select from 'react-select';
import {
  EDIT_DEMO_IMAGE,
  EXCEL_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
  WHITE_TRASH_IMAGE,
} from "../../utils/constant";
import { Card, Col, Image, Row, Spinner, Table } from 'react-bootstrap';
import ImageManipulator from './imageZoom';
import ImageViewer from './imageZoom';
import { CouponSearchFilterInterface, CouponSearchInterface, initialFilterCouponSearch } from '../../interfaces/coupon.interface';
import { TransactionDetailViewInterface } from '../../interfaces/transaction.interface';
import { initialResPaginate, initialTransPagination, PaginationTransInterface, ResPaginateInterface } from '../../interfaces/pagination.interface';
import Link from 'next/link';
import { useSelector } from 'react-redux';

interface MyVerticallyCenteredModalProps {
  approveshow: boolean;
  setShow: () => void;
  update: () => void;
  data: any
}

interface ProductValue {  
  _id: string;
  product: string;
  productid: string;
  points: number;
  GgNumber: string;
  pointType: string;
  description:string;
  categoryName:string;
  partNo:string;
}

interface ProductIdOption {  
  value: string;
  label: string;
}

const ApprovedModal: React.FC<MyVerticallyCenteredModalProps> = ({ approveshow, setShow, data, update  }) => {
  useEffect(() => {
    setCoupnCode(!data?.couponCode  || data?.couponCode != "undefined" ? data?.couponCode : '');
    setGGNumber(!data?.couponGg  || data?.couponGg != "undefined" ? data?.couponGg : '');

    setLoading(true);
    setImage(data?.couponImage || [])
  }, [data]);
  console.log(data , "data")

  const [couponCode, setCoupnCode] = useState<string>('');
  const [images, setImage] = useState<any[]>([]);
    const [search, setSearch] = useState('')
    const [couponData, setCouponData] = useState<Array<CouponSearchInterface>>([])

  const [loading, setLoading] = useState<boolean>(false);
  const [ggNumber, setGGNumber] = useState<string>("");
  const [status, setStatus] = useState<string>('');
  const [productId, setProductId] = useState<ProductIdOption | null>(null);
  const [description, setDescription] = useState<string>('');
  const [productList, setProductList] = useState<ProductValue[]>([]);
  const [errorShow, setErrorShow] = useState<boolean >(false);
  const [errorPopUpBtnShow, SetErrorPopUpBtnShow] = useState<boolean >(false);
  const [  submitbtndisabled, setSubmitBtnDisabled] = useState<boolean >(false);
  const [transactionData, setTransactionData] = useState<
    Array<TransactionDetailViewInterface>
  >([]);
    const [resPaginateData, setResPaginateData] =
      useState<ResPaginateInterface>(initialResPaginate);
  
    const [paginationData, setPaginationData] =
      useState<PaginationTransInterface>(initialTransPagination);
  const [message, setMessage] = useState<string >("");
  const [searchPoints, setSearchPoints] = useState<string >("");
  const [searchPartNo, setSearchPartNo] = useState<string >("");
  const [searchProductDesc, setSearchProductDesc] = useState<string >("");
  const [searchGGNo, setSearchGGNo] = useState<string >("");
    const [filterData, setFilterData] = useState<CouponSearchFilterInterface>(initialFilterCouponSearch)

  const [isLoading, setIsLoading] = useState(true)

      const [searchCoupon, setSearchCoupon] = useState('')
      // const [isLoading, setIsLoading] = useState(false)
      const fetchSearchCoupons = async () => {
          await backendSearchCoupons({ ...filterData,  search: searchCoupon }).then((res) => {
              if (!res.isError) {
                  setCouponData(res.data)
                  setIsLoading(false)
              }
          })
      }
      useEffect(() => {
          if (searchCoupon.length >= 3) {
              setIsLoading(true)
              fetchSearchCoupons()
          }
      }, [searchCoupon, filterData])

  const [error, setError] = useState("");
  const resetSearch = () => {
    setSearchPoints("")
    setSearchPartNo("")
    setSearchProductDesc("")
    setSearchGGNo("")
  }  
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
      if(paginationData?.search.length > 2)
      fetchTransactions();
    }, [paginationData]);
  const handleSetValues = (data :any) => {
    setGGNumber(data?.GgNumber)
    setProductId({
      value: data.productid,
      label: data.product,
    })
    handleSelectProduct({  value: data.productid,
      label: data.product})
  }


  const [otherProductValue, setOtherProductValue] = useState({
    schemeid: "null",
    point: 0,
    pointType: ""
  });

  const requestOption: { 
    invalidCouponid: string | undefined, 
    pointSearch?: string | number, 
    numberSearch?: string, 
    descriptionSearch?: string 
    partNumberSearch?:string
  } = {
    invalidCouponid: data?._id
  };
  
  // Conditionally add pointSearch if searchPoints has a value
  if (searchPoints) {
    requestOption.pointSearch = searchPoints;
  }
  
  // Conditionally add numberSearch if searchPartNo has a value
  if (searchGGNo) {
    requestOption.numberSearch = searchGGNo;
  }
  
  // Conditionally add descriptionSearch if searchProductDesc has a value
  if (searchProductDesc) {
    requestOption.descriptionSearch = searchProductDesc;
  }
   
  // Conditionally add descriptionSearch if searchProductDesc has a value
  if (searchPartNo) {
    requestOption.partNumberSearch = searchPartNo;
  }
  const fetchProduct = async () => {
    try {
      const res = await backendGetAllDamageCouponsProject(requestOption);
      if (!res.isError) {
        setProductList(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false); // Make sure to stop loading if there's an error
    }
  };
  useEffect(() => {
    if (data?._id) {
      fetchProduct();
    }
  }, [data?._id , searchPartNo ,searchPoints ,searchProductDesc ,searchGGNo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     // Check if the coupon code is exactly 8 characters long
     if (couponCode.length != 8) {
      setError("Coupon code must be exactly 8 characters long.");
      } else {
        setSubmitBtnDisabled(true)
        const sendRequestOption = {
          couponCode: couponCode,
          invalidCouponid: data?._id,
          productid: productId?.value,
          customerid: data?.customerid,
          points: otherProductValue?.point,
          ...(status == "Approved" && { schemeid: otherProductValue?.schemeid }), // Include schemeid only if status is "Approved"
          statusType: status,
          remark: description,
          pointType: otherProductValue?.pointType
        };
    try {
      const res = await backendGetApprovedQR(sendRequestOption);

      if (!res.isError) {
        setSubmitBtnDisabled(false)

        update();
        setShow();
        setCoupnCode('');
        setGGNumber('');
        setStatus('');
        setProductId(null);
        setDescription('');
        setOtherProductValue({
          schemeid: "null",
          point: 0,
          pointType: ""
        });
        setErrorShow(true)
        setMessage(res?.data?.message)
        resetSearch()

      } else {
              setErrorShow(true)
              setSubmitBtnDisabled(false)
              resetSearch()

      }
    } catch (error:any) {
      setSubmitBtnDisabled(false)
     setMessage(error?.response?.data?.message)
     setShow()
     setTimeout(() => {
      setErrorShow(true);
      SetErrorPopUpBtnShow(true)
    }, 1000);
      console.error("Error in fetching data:", error);
    }
  }
  };


  const handleReject = async (e: React.FormEvent  , type:string) => {
    e.preventDefault();
    const sendRequestOption = {
      statusType: type,
      couponCode: couponCode,
      invalidCouponid: data?._id,
      productid: productId?.value,
      customerid: data?.customerid,
      points: otherProductValue?.point,
      schemeid: otherProductValue?.schemeid,
      remark: description,
      pointType: otherProductValue?.pointType


    };

    try {
      const res = await backendGetApprovedQR(sendRequestOption);

      if (!res.isError) {
        setErrorShow(false)
        SetErrorPopUpBtnShow(false)
        update();
        setShow();
        setCoupnCode('');
        setGGNumber('');
        setStatus('');
        setProductId(null);
        setDescription('');
        setOtherProductValue({
          schemeid: "null",
          point: 0,
          pointType: ""
        });
      } 
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };
const [searchTransaction , setSearchTransaction] = useState('');
  const productDropdownOptions = productList?.map((res) => ({
    value: res.productid,
    label: res.product,
  }));

  const handleSelectProduct = (selectedOption: ProductIdOption | null) => {
    if (selectedOption) {
      let selectedProduct = productList.find((element) => element.productid === selectedOption.value);
      if (selectedProduct) {
        setOtherProductValue({
          schemeid: selectedProduct._id,
          point: selectedProduct.points,
          pointType: selectedProduct.pointType,
        });
      }
    }
    setProductId(selectedOption); // Update productId state with the selected option
  };
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

  return (
    <>
    <Modal
      show={approveshow}
      onHide={() => {setShow() ;  setProductId(null) ; resetSearch() ; SetErrorPopUpBtnShow(false)}}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='damageentries_modal'
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Damage Entries
        </Modal.Title>
      </Modal.Header>
      {loading && 
        <Modal.Body>
          <Row xl={12}>

            <Col xl={3} sm={3} xs={3} className="text-start">
                            <Form.Group className="form-group">
                                <Form.Label>QR Coupon</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => { setSearchCoupon(e.target.value) }}
                                    value={searchCoupon}
                                    autoComplete='off'
                                    placeholder='Search'
                                    />
                            </Form.Group>
                         
                        </Col>
                        <Col xl={3} sm={3} xs={3} className="text-start">
                        <Form.Group className="form-group">
                                <Form.Label>Transaction</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => {   setPaginationData({
                                      ...paginationData,
                                      search: e.target.value,
                                    }); }}
                                    value={paginationData?.search}
                                    autoComplete='off'
                                    placeholder='Search'
                                />
                            </Form.Group>
                         </Col>
                        
                                    </Row>
          <Form onSubmit={handleSubmit}>
          <Row> 
            <Col lg={6} >
            <Row> 
            <Col lg={3} >
            <p>Firm Name :- </p>
            </Col>
            <Col lg={8} >
            <p> <strong> {data?.firmName} </strong></p>
            </Col>
            </Row>
            <Row className='mb-2' > 
            <Col lg={3} >
            <p>Contact No. :- </p>
            </Col>
            <Col lg={8} >
            <p><strong> {data?.mobile} </strong></p>
            </Col>
            </Row>
            <Row> 
            <Col lg={6} >
            <Form.Group controlId="formInput1">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCoupnCode(e.target.value)}
                required={status == "Approved"}
                min={8}
                max={8}
              />
            </Form.Group>
              {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
            </Col>
            <Col lg={6} >

            <Form.Group controlId="formInput2">
              <Form.Label>GG Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter GG Number"
                value={ggNumber}
                onChange={(e) => setGGNumber(e.target.value)}
              />
            </Form.Group>
            </Col>
            <Col lg={6} >

            <label htmlFor="" className='my-1'>Select Product</label>
            <Select
              value={productId}
              onChange={handleSelectProduct}
              options={productDropdownOptions}
              isSearchable
              required={status == "Approved"}
            />
            </Col>
            <Col lg={6} >

            <Form.Group controlId="formDropdown">
              <Form.Label>Select Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Approved">Approved</option>
                {/* <option value="Pending">Pending</option> */}
                <option value="Rejected">Rejected</option>
                <option value="Hold">Hold</option>

              </Form.Control>
            </Form.Group>
            </Col>
            <Col lg={12} >

            <Form.Group controlId="formDescription">
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required={status === "Hold" }
              />
            </Form.Group>
            </Col>
            </Row>
            </Col>
            <Col lg={6} >
            <div className='my-3  d-flex justify-content-center  ' style={{  position:"relative"}}  >
            <ImageViewer src={images[0]} />
            </div>
            </Col>
            </Row>






            <Row className='my-2' >
              <Col lg={3} > 
              <Form.Group controlId="formInput2">
              <Form.Label>GG No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter GG No."
                value={searchGGNo}
                onChange={(e) => setSearchGGNo(e.target.value)}
              />
            </Form.Group>
              </Col>
              <Col lg={3} > 
              <Form.Group controlId="formInput2">
              <Form.Label>Product Disc.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Disc"
                value={searchProductDesc}
                onChange={(e) => setSearchProductDesc(e.target.value)}
              />
            </Form.Group>
              </Col> <Col lg={3} > 
              <Form.Group controlId="formInput2">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter points"
                value={searchPoints}
                onChange={(e) => setSearchPoints(e.target.value)}
              />
            </Form.Group>
              </Col>
              <Col lg={3} > 
              <Form.Group controlId="formInput2">
              <Form.Label>Part No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Part No."
                value={searchPartNo}
                onChange={(e) => setSearchPartNo(e.target.value)}
              />
            </Form.Group>
              </Col>
            </Row>
            <Card className="flat-card p-0">
              <div className="row-table">
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive damage_modal_table_cont ">
                        <Table>
                          <thead>
                            <tr>
                              <th>GG No.</th>
                              <th>Part No.</th>
                              <th>Points</th>
                              <th>Category</th>
                              <th>Product Desc.</th>
                            

                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(productList) && productList.map((item, index) => {
                              return (
                                <tr key={index} onClick={() => handleSetValues(item)} >
                                  
                                  <td>{item.GgNumber}</td>
                                  <td>{item.partNo}</td>
                                  <td>{item.points}</td>
                                  <td>{item.categoryName}</td>
                                  <td>{item.description}</td>
                                
                                  

                                   

                                 
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
   <Card className="flat-card p-0 mt-5">
                            <div className="row-table">
                              <h3>QR Coupon Details</h3>
                                <Col sm={12} md={12}>
                                    <div className="card1">
                                        <div className="table-border-style">
                                            <div className="table-responsive damage_modal_table_cont ">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Coupons</th>
                                                            <th>Date</th>
                                                            <th>GG NO</th>
                                                            <th>Product Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(couponData) && couponData.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.coupon}</td>
                                                                    <td>{new Date(item.createdAt).toDateString()}</td>
                                                                    <td>{item?.productsData?.productNo}</td>
                                                                    <td>{item?.productsData?.name}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                {/* {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null} */}
                            </div>
                        </Card>




  <Card className="flat-card p-0">
              <div className="row-table">
                <h3>Transaction Detail</h3>
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive damage_modal_table_cont">
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
                              <th>Date</th>
                              {/* <th>Action</th> */}
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
                                    <td>{item.createdAt}</td>
                                    {/* <td>
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
                                    </td> */}
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


            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={setShow} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitbtndisabled} >
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      }
    </Modal>


{/* // already scanned error message oe Success Message   */}
<Modal
show={errorShow}
onHide={() => {setErrorShow(false) ; SetErrorPopUpBtnShow(false)}}
size="sm"
aria-labelledby="contained-modal-title-vcenter"
centered
className='damageentries_modal'
>
<Modal.Header closeButton>
  <Modal.Title id="contained-modal-title-vcenter">
    Damage Entries
  </Modal.Title>
</Modal.Header>
{loading && 
  <Modal.Body>

       <p> {message} </p>
       {
        errorPopUpBtnShow && 
        <>
       
       <Form.Group controlId="formDescription">
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={(e) => handleReject(e,"Pending")}  className="me-2">
          Pending 
        </Button>
        <Button variant="primary" onClick={(e) => handleReject(e,"Rejected")}   type="submit">
          Reject
        </Button>
      </div>
      </>
}
 
  </Modal.Body>
}
</Modal>
</>
  );
};

export default ApprovedModal;
