import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { backendCustomersAllTransaction } from "../../helpers/backend_helper";
import { TransactionDetailViewInterface } from "../../interfaces/transaction.interface";
import { Button, Col, Row, Table, Image } from "react-bootstrap";
import Link from "next/link";
import {
  EDIT_DEMO_IMAGE,
  EXCEL_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
} from "../../utils/constant";
import {
  PaginationInterface,
  ResPaginateInterface,
  initialPagination,
  initialResPaginate,
} from "../../interfaces/pagination.interface";
import * as XLSX from "xlsx";
import { EmptyRow, StatusBadge, formatTabDate } from "./customerTabHelpers";
const CustomerTransactionList = ({ customerid }: { customerid: any }) => {
  const router = useRouter();
  const [transactionData, setTransactionData] = useState<
    Array<TransactionDetailViewInterface>
  >([]);
  const [paginationData, setPaginationData] =
    useState<PaginationInterface>(initialPagination);
  const [resPaginateData, setResPaginateData] =
    useState<ResPaginateInterface>(initialResPaginate);
  const fetchCustomerBankDetail = async () => {
    await backendCustomersAllTransaction({ customerid: customerid }).then(
      (res) => {
        if (res.isError == false) {
          setTransactionData(res.data);
        }
      }
    );
  };
  useEffect(() => {
    if (customerid) fetchCustomerBankDetail();
  }, [customerid]);

  const handleOnExport = async () => {
    const mappedArray = await Promise.all(
      transactionData.map(async (redemption: any) => {
        redemption.createdAt = redemption.createdAt
          ? new Date(redemption.createdAt).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "numeric",
            })
          : "";
        return redemption;
      })
    );
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(mappedArray);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "transaction.xlsx");
  };
  return (
    <div className="cd-tab-pane">
      <div className="cd-tab-toolbar">
        <div>
          <h5 className="mb-0">Transactions</h5>
          <p className="cd-muted-note mb-0">
            {Array.isArray(transactionData) ? transactionData.length : 0}{" "}
            records
          </p>
        </div>
        <Button
          onClick={handleOnExport}
          className="cd-btn cd-btn-outline"
          variant="outline-light"
        >
          <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel
        </Button>
      </div>
      <div className="table-responsive cd-table-wrap">
        <Table className="cd-table mb-0" hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Coupon</th>
              <th className="text-end">Points</th>
              <th>Category</th>
              <th>Point Type</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactionData) && transactionData.length ? (
              transactionData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="cd-cell-ref">{item.refno}</td>
                    <td className="text-nowrap">
                      {formatTabDate(item.createdAt)}
                    </td>
                    <td>{item.coupon || "-"}</td>
                    <td className="text-end cd-cell-points">{item.points}</td>
                    <td>{item.categoryName || "-"}</td>
                    <td>
                      <StatusBadge value={item.pointType} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyRow colSpan={6} text="No transactions found" />
            )}
          </tbody>
        </Table>
      </div>
      <nav aria-label="Page navigation" className="cd-pager">
        <ul className="pagination justify-content-end mb-0">
          <li
            className={`page-item ${
              paginationData.currentPage === 1 ? "disabled" : ""
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
                  `/transaction/?page=${paginationData.currentPage - 1}`
                );
              }}
            >
              Previous
            </a>
          </li>
          <li
            className={`page-item ${
              paginationData.currentPage === resPaginateData.totalPages
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
                  `/transaction/?page=${paginationData.currentPage + 1}`
                );
              }}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomerTransactionList;
