import React, { useState } from "react";
//import Loader from './Loader';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Catalogue = () => {
  const [scale, setScale] = useState(1.0);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  function onDocumentLoadSuccess(numPages: any) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch("/docs/catalogue.pdf").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "/docs/catalogue.pdf";
        alink.click();
      });
    });
  };

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };
  const goToLastPage = (numPages: any) => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e: any) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  return (
    <>
      <div className="p-3" style={{ background: "grey" }}>
        <div className="control-panel p-3  d-flex align-items-baseline justify-content-between">
          <span className="text-white m-r-29">
            <input
              name="pageNumber"
              type="number"
              min={1}
              max={numPages || 1}
              className="p-0 pl-1 mx-2"
              value={pageNumber}
              onChange={onPageChange}
            />
          </span>
          <i
            className={`fas fa-forward mx-3 ${lastPageClass}`}
            onClick={goToNextPage}
          />
          <i
            className={`fas fa-fast-forward mx-3 ${lastPageClass}`}
            onClick={goToLastPage}
          />

          <></>

          <button className="  btn btn-dark " onClick={onButtonClick}>
            Download PDF
          </button>
        </div>
        <div className="d-flex flex-column align-items-center w-100">
          <Document
            file="/docs/Catalogue.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((page) => (
              <Page className="m-t-30" pageNumber={page} />
            ))}
            {/* <Page pageNumber={pageNumber} /> */}
          </Document>
        </div>
      </div>
    </>
  );
};
export default Catalogue;
