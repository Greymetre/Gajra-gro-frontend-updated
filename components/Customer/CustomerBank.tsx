import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Row,
  Table,
  Image,
  Form,
  Tabs,
  Tab,
  ProgressBar,
} from "react-bootstrap";
import {
  backendCustomersBankInfo,
  backendCustomersBankVerified,
  backendCustomersUpiVerified,
  backendCustomersClearBank,
  backendCustomersClearUpi,
  backendCustomerkycVerified,
  backendCustomerkycRejected,
  backendCustomerKycUpload,
  backendGetCustomerInfo,
} from "../../helpers/backend_helper";
import {
  CustomerBankDetailInterface,
  initialBankDetail,
  initialKycData,
} from "../../interfaces/customer.interface";
import {
  IMAGE_URL,
  CUSTOMER_DEMO_IMAGE,
  WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { Formik, FormikHelpers, useFormik, useFormikContext } from "formik";
import * as yup from "yup";
import { objectAppendIntoformData } from "../../utils/utility";
import KycImageViewer, {
  KycViewerField,
  KycViewerImage,
} from "./KycImageViewer";
const schema = yup.object().shape({
  // gstinNo: yup.string().optional().matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z1-9]{1})?$/, 'Invalid GSTIN'),
  gstinNo: yup.string().optional(),
  panNo: yup
    .string()
    .optional()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN number"),
  aadharNo: yup
    .string()
    .nullable()
    .matches(/^[0-9]{12}$/, "Invalid Aadhaar No"),
  otherNo: yup.string().optional(),
  otherName: yup.string().optional(),
  accountNo: yup
    .string()
    .nullable()
    .matches(/^\d{9,18}$/, "Invalid Bank Account No"),
  // ifsc: yup.string().nullable().matches(/^[A-Za-z]{4}\d{7}$/, 'Invalid IFSC Code'),
  ifsc: yup.string().nullable(),
  holderName: yup.string().nullable(),
  bankName: yup.string().nullable(),
  upiNumber: yup
    .string()
    .nullable()
    ,


    upi_number : yup.string().nullable(),

});

const CustomerBank = ({
  customerid,
  customerInfo,
}: {
  customerid: any;
  customerInfo: any;
}) => {
  const router = useRouter();
  const [customerBankInfo, setCustomerBankInfo] =
    useState<CustomerBankDetailInterface>(initialBankDetail);
  const [gstinFile, setGstinFile] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
  const [passbookFile, setPassbookFile] = useState<File | null>(null);
  const [upiFile, setUpiFile] = useState<File | null>(null);

  const [aadharImage, setAadharImage] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<string | null>(null);
  const [gstinImage, setGstinImage] = useState<string | null>(null);
  const [otherImage, setOtherImage] = useState<string | null>(null);
  const [passbookImage, setPassBookImage] = useState<string | null>(null);

  const [upiImage, setUpiImage] = useState<string | null>(null);


  const [aadharBackImage, setAadharBackImage] = useState<string | null>(null);
  // Fresh customer record, refetched after verify/reject so the page reflects
  // the new status without a browser refresh. Falls back to the parent prop.
  const [liveInfo, setLiveInfo] = useState<any>(null);
  const kyc = liveInfo || customerInfo;

  // Only refreshes status flags; keeps any unsaved edits in the form.
  const refreshKycStatus = async () => {
    await backendGetCustomerInfo(customerid).then((res) => {
      if (!res.isError) {
        setLiveInfo(res.data);
        setCustomerBankInfo(res.data);
      }
    });
  };

  const fetchCustomerBankDetail = async () => {
    await backendGetCustomerInfo(customerid).then((res) => {
      console.log("resresresresresresresres" , res)
      if (!res.isError) {
        console.log( "0-0-0-0-0-0-0-0-" , res.data);
        setCustomerBankInfo(res.data);
        setLiveInfo(res.data);
        for (const [key, value] of Object.entries(res.data)) {
          if (initialKycData.hasOwnProperty(key)) {
            formik.setFieldValue(key, value);

            console.log("this are the key val;ue" , key, value)
          }
          if (key === "gstinImage" && typeof value === "string") {
            setGstinImage(value ? IMAGE_URL + value : null);
          }
          if (key === "panImage" && typeof value === "string") {
            setPanImage(value ? IMAGE_URL + value : null);
          }
          if (key === "aadharFrontImage" && typeof value === "string") {
            setAadharImage(value ? IMAGE_URL + value : null);
          }
          if (key === "aadharBackImage" && typeof value === "string") {
            setAadharBackImage(value ? IMAGE_URL + value : null);
          }
          if (key === "otherFrontImage" && typeof value === "string") {
            setOtherImage(value ? IMAGE_URL + value : null);
          }
          if (key === "passbookImage" && typeof value === "string") {
            setPassBookImage(value ? IMAGE_URL + value : null);
          }
          if (key === "upiImage" && typeof value === "string") {
            setUpiImage(value ? IMAGE_URL + value : null);
          }
        }
      }
    });
    // await backendCustomersBankInfo({ customerid: customerid }).then((res) => {
    //     if (res.isError == false) {
    //         setCustomerBankInfo(res.data)
    //         for (const [key, value] of Object.entries(res.data)) {
    //             if (initialKycData.hasOwnProperty(key)) {
    //               formik.setFieldValue(key, value);
    //             }
    //           }
    //     }
    // })
  };
  useEffect(() => {
    if (customerid) {
      fetchCustomerBankDetail();
      formik.setFieldValue("customerid", customerid);
    }
  }, [customerid]);
console.log("customeridcustomerid" , customerid)
  const handelCustomerBankVerified = async () => {
    if (window.confirm("Are you sure to verified this bankinfo?")) {
      await backendCustomersBankVerified({ customerid: customerid }).then(
        (res) => {
          if (res.isError == false) {
            setCustomerBankInfo(res.data);
          }
        }
      );
    }
  };

  const handelCustomerUpiVerified = async () => {
    if (window.confirm("Are you sure to verified this upi?")) {
      await backendCustomersUpiVerified({
        customerid: customerid,
        upiNumber: customerBankInfo.upiNumber,
      }).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };



  const handelCustomerUpiClear = async () => {
    if (window.confirm("Are you sure to clear this upi?")) {
      await backendCustomersClearUpi({ customerid: customerid }).then((res) => {
        if (res.isError == false) {
          setCustomerBankInfo(res.data);
        }
      });
    }
  };

  const handelCustomerBankClear = async () => {
    if (window.confirm("Are you sure to clear this bank info?")) {
      await backendCustomersClearBank({ customerid: customerid }).then(
        (res) => {
          if (res.isError == false) {
            setCustomerBankInfo(res.data);
          }
        }
      );
    }
  };

  // Both return true on success so the image viewer can update its status.
  const handelCustomerkycVerified = async (iData: any) => {
    if (window.confirm("Are you sure to verified this kyc?")) {
      const ok = await backendCustomerkycVerified(iData).then(
        (res) => res.isError == false
      );
      if (ok) await refreshKycStatus();
      return ok;
    }
    return false;
  };
  const handelCustomerkycRejected = async (iData: any) => {
    if (window.confirm("Are you sure to reject this kyc?")) {
      const ok = await backendCustomerkycRejected(iData).then(
        (res) => res.isError == false
      );
      // Reject clears the document number/image on the backend, so reload all.
      if (ok) await fetchCustomerBankDetail();
      return ok;
    }
    return false;
  };
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;
    console.log("this is a ba;le" ,  name, "0-0-" , value, "0-0-" ,  type , "-0-0-0")
    formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
  };
  console.log("hello bro 8888888888888888888888")
// console.log(formik.values , "909090909090909")
  const handleFormSubmit = async () => {
    try {
      formik.setSubmitting(true);
      const formData = new FormData();
      console.log("this is a formdata" , formData)
      const iData = await objectAppendIntoformData(formData, formik.values, "");
      if (aadharFile) {
        await iData.append("aadharimage", aadharFile);
      }
      if (gstinFile) {
        await iData.append("gstinimage", gstinFile);
      }
      if (panFile) {
        await iData.append("panimage", panFile);
      }
      if (otherFile) {
        await iData.append("otherimage", otherFile);
      }
      if (aadharBackFile) {
        await iData.append("aadharBackImage", aadharBackFile);
      }
      if (passbookFile) {
        await iData.append("passbookImage", passbookFile);
      }
      if (upiFile) {
        await iData.append("upiImage", upiFile);
      }
      const formDataObject = Object.fromEntries(iData.entries());
      console.log("Form Data as Object:", formDataObject);
      




      backendCustomerKycUpload(iData)
        .then((result) => {
          if (!result.isError) {
            // router.reload();
            router.push("/customer");
          } else {
          }
        })
        .catch((err) => {});





    } catch (e) {
      console.log(e, "Error in the Login");
    }
  };

  const formik = useFormik({
    initialValues: initialKycData,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: handleFormSubmit,
  });
  // Plain render helpers (called as functions, not components) so the
  // uncontrolled switches / file inputs are not remounted on re-render.
  const pickImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File) => void,
    setPreview: (src: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStatus = (verified?: boolean) => (
    <span
      className={`cd-badge ${verified ? "cd-badge-success" : "cd-badge-warn"}`}
    >
      {verified ? "Verified" : "Not Verified"}
    </span>
  );

  const renderVerifyControls = (
    verifiedTo: string,
    kycdocs: string,
    defaultChecked?: boolean
  ) => (
    <div className="kyc-controls">
      <Form.Check
        type="switch"
        label="Verified"
        onChange={(e) => {
          const { value, checked } = e.target;
          if (checked) {
            handelCustomerkycVerified({
              customerid: customerid,
              verifiedTo: verifiedTo,
            });
          }
        }}
        checked={!!defaultChecked}
      />
      <Form.Check
        className="text-danger"
        type="switch"
        label="Reject"
        checked={false}
        onChange={(e) => {
          const { value, checked } = e.target;
          if (checked) {
            handelCustomerkycRejected({
              customerid: customerid,
              kycdocs: kycdocs,
            });
          }
        }}
      />
    </div>
  );

  type KycDocKey = "gstin" | "pan" | "aadhar" | "other" | "bank" | "upi";
  const [viewer, setViewer] = useState<{ doc: KycDocKey; index: number } | null>(
    null
  );
  const customerName =
    kyc?.contactPerson || kyc?.firmName || "";
  const kycDocs: Record<
    KycDocKey,
    {
      title: string;
      images: KycViewerImage[];
      fields: KycViewerField[];
      verifiedTo: string;
      verified?: boolean;
      canVerify: boolean;
    }
  > = {
    gstin: {
      title: "GSTIN",
      images: [{ src: gstinImage || "", label: "GSTIN" }],
      fields: [
        { label: "GSTIN No", value: formik.values.gstinNo },
        { label: "Firm Name", value: kyc?.firmName },
      ],
      verifiedTo: "verified.gstinVerified",
      verified: kyc?.gstinVerified,
      canVerify: !!(kyc?.gstinImage || kyc?.gstinNo),
    },
    pan: {
      title: "PAN",
      images: [{ src: panImage || "", label: "PAN" }],
      fields: [
        { label: "PAN No", value: formik.values.panNo },
        { label: "Customer Name", value: customerName },
        { label: "Firm Name", value: kyc?.firmName },
      ],
      verifiedTo: "verified.panVerified",
      verified: kyc?.panVerified,
      canVerify: !!(kyc?.panImage || kyc?.panNo),
    },
    aadhar: {
      title: "Aadhar",
      images: [
        { src: aadharImage || "", label: "Front" },
        { src: aadharBackImage || "", label: "Back" },
      ],
      fields: [
        { label: "Aadhar No", value: formik.values.aadharNo },
        { label: "Customer Name", value: customerName },
        {
          label: "Address on Record",
          value: [kyc?.address, kyc?.city, kyc?.state]
            .filter(Boolean)
            .join(", "),
        },
      ],
      verifiedTo: "verified.aadharVerified",
      verified: kyc?.aadharVerified,
      canVerify: !!(kyc?.aadharFrontImage || kyc?.aadharNo),
    },
    other: {
      title: "Other Document",
      images: [{ src: otherImage || "", label: "Other" }],
      fields: [
        { label: "Other Doc No", value: formik.values.otherNo },
        { label: "Customer Name", value: customerName },
      ],
      verifiedTo: "verified.otherVerified",
      verified: kyc?.otherVerified,
      canVerify: !!(kyc?.otherFrontImage || kyc?.otherNo),
    },
    bank: {
      title: "Bank / Passbook",
      images: [{ src: passbookImage || "", label: "Passbook" }],
      fields: [
        { label: "Account No", value: formik.values.accountNo },
        { label: "Account Holder Name", value: formik.values.holderName },
        { label: "Bank Name", value: formik.values.bankName },
        { label: "IFSC", value: formik.values.ifsc },
        { label: "Customer Name", value: customerName },
      ],
      verifiedTo: "verified.bankVerified",
      verified: kyc?.bankVerified,
      canVerify: true,
    },
    upi: {
      title: "UPI",
      images: [{ src: upiImage || "", label: "UPI" }],
      fields: [
        { label: "UPI Number", value: formik.values.upiNumber },
        { label: "Customer Name", value: customerName },
        { label: "Mobile", value: kyc?.mobile },
      ],
      verifiedTo: "verified.upiVerified",
      verified: kyc?.upiVerified,
      canVerify: true,
    },
  };
  const openViewer = (doc: KycDocKey, src: string | null) => {
    const images = kycDocs[doc].images.filter((i) => i.src);
    const index = Math.max(
      0,
      images.findIndex((i) => i.src === src)
    );
    setViewer({ doc, index });
  };
  const activeDoc = viewer ? kycDocs[viewer.doc] : null;

  const renderUpload = (
    doc: KycDocKey,
    label: string,
    preview: string | null,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="kyc-upload">
      <div className="kyc-preview">
        {preview ? (
          <button
            type="button"
            className="kyc-preview-btn"
            title="Click to view & verify"
            onClick={() => openViewer(doc, preview)}
          >
            <Image src={preview} />
            <span className="kyc-preview-hint">🔍 Click to view</span>
          </button>
        ) : (
          <span>No image</span>
        )}
      </div>
      <Form.Label className="kyc-upload-label">{label}</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        size="sm"
        onChange={onChange}
      />
    </div>
  );

  const renderTextField = (
    name: keyof typeof formik.values,
    label: string,
    placeholder: string
  ) => (
    <Form.Group className="form-group mb-3">
      <Form.Label htmlFor={String(name)}>{label}</Form.Label>
      <Form.Control
        type="text"
        name={String(name)}
        onChange={handleInputChange}
        value={formik.values[name] as any}
        onBlur={formik.handleBlur}
        required={true}
        autoComplete="off"
        placeholder={placeholder}
      />
      {formik.errors[name] && (
        <div className="text-danger small">{formik.errors[name] as any}</div>
      )}
    </Form.Group>
  );

  return (
    <div className="kyc-wrap">
      <div className="cd-tab-toolbar">
        <div>
          <h5 className="mb-0">KYC Documents</h5>
          <p className="cd-muted-note mb-0">
            Upload or update documents, then click Upload to save.
          </p>
        </div>
        <Button
          className="btn btn-dark cd-btn"
          disabled={!formik.isValid}
          onClick={() => {
            if (formik.isValid) {
              formik.handleSubmit();
            } else {
              console.log("is invalid", !formik.isValid);
            }
          }}
        >
          <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Upload{" "}
        </Button>
      </div>

      {/* GSTIN */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>GSTIN</h6>
            {(kyc?.gstinImage || kyc?.gstinNo) &&
              renderStatus(kyc?.gstinVerified)}
          </div>
          {(kyc?.gstinImage || kyc?.gstinNo) &&
            renderVerifyControls(
              "verified.gstinVerified",
              "gstin",
              kyc?.gstinVerified
            )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("gstin", "GSTIN Image", gstinImage, (event) =>
              pickImage(event, setGstinFile, setGstinImage)
            )}
          </Col>
          <Col lg={4} md={6} xs={12}>
            {renderTextField("gstinNo", "GSTIN No", "GSTIN No")}
          </Col>
        </Row>
      </div>

      {/* PAN */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>PAN</h6>
            {(kyc?.panImage || kyc?.panNo) &&
              renderStatus(kyc?.panVerified)}
          </div>
          {(kyc?.panImage || kyc?.panNo) &&
            renderVerifyControls(
              "verified.panVerified",
              "pan",
              kyc?.panVerified
            )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("pan", "PAN Image", panImage, (event) =>
              pickImage(event, setPanFile, setPanImage)
            )}
          </Col>
          <Col lg={4} md={6} xs={12}>
            {renderTextField("panNo", "PAN No", "PAN No")}
          </Col>
        </Row>
      </div>

      {/* Aadhar */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>Aadhar</h6>
            {(kyc?.aadharFrontImage || kyc?.aadharNo) &&
              renderStatus(kyc?.aadharVerified)}
          </div>
          {(kyc?.aadharFrontImage || kyc?.aadharNo) &&
            renderVerifyControls(
              "verified.aadharVerified",
              "aadhar",
              kyc?.aadharVerified
            )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("aadhar", "Aadhar Front", aadharImage, (event) =>
              pickImage(event, setAadharFile, setAadharImage)
            )}
          </Col>
          <Col lg={4} md={6} xs={12}>
            {renderUpload("aadhar", "Aadhar Back", aadharBackImage, (event) =>
              pickImage(event, setAadharBackFile, setAadharBackImage)
            )}
          </Col>
          <Col lg={4} md={12} xs={12}>
            {renderTextField("aadharNo", "Aadhar No", "Aadhar No")}
          </Col>
        </Row>
      </div>

      {/* Other */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>Other Document</h6>
            {(kyc?.otherFrontImage || kyc?.otherNo) &&
              renderStatus(kyc?.otherVerified)}
          </div>
          {(kyc?.otherFrontImage || kyc?.otherNo) &&
            renderVerifyControls(
              "verified.otherVerified",
              "other",
              kyc?.otherVerified
            )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("other", "Other Image", otherImage, (event) =>
              pickImage(event, setOtherFile, setOtherImage)
            )}
          </Col>
          <Col lg={4} md={6} xs={12}>
            {renderTextField("otherNo", "Other Doc No", "Other Doc No")}
          </Col>
        </Row>
      </div>

      {/* Bank */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>Bank / Passbook</h6>
            {renderStatus(kyc?.bankVerified)}
          </div>
          {renderVerifyControls(
            "verified.bankVerified",
            "bank",
            kyc?.bankVerified
          )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("bank", "Passbook / Cheque Image", passbookImage, (event) =>
              pickImage(event, setPassbookFile, setPassBookImage)
            )}
          </Col>
          <Col lg={8} md={6} xs={12}>
            <Row>
              <Col md={6} xs={12}>
                {renderTextField("accountNo", "Account No", "Account No")}
              </Col>
              <Col md={6} xs={12}>
                {renderTextField(
                  "holderName",
                  "Account Holder Name",
                  "Account Holder Name"
                )}
              </Col>
              <Col md={6} xs={12}>
                {renderTextField("bankName", "Bank Name", "Bank Name")}
              </Col>
              <Col md={6} xs={12}>
                {renderTextField("ifsc", "IFSC", "IFSC")}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* UPI */}
      <div className="kyc-section">
        <div className="kyc-section-head">
          <div className="kyc-section-title">
            <h6>UPI</h6>
            {renderStatus(kyc?.upiVerified)}
          </div>
          {renderVerifyControls(
            "verified.upiVerified",
            "upi",
            kyc?.upiVerified
          )}
        </div>
        <Row className="g-3">
          <Col lg={4} md={6} xs={12}>
            {renderUpload("upi", "UPI Image", upiImage, (event) =>
              pickImage(event, setUpiFile, setUpiImage)
            )}
          </Col>
          <Col lg={4} md={6} xs={12}>
            {renderTextField("upiNumber", "UPI Number", "Enter UPI Number")}
          </Col>
        </Row>
      </div>

      {customerBankInfo.accountNo ? (
        <div className="kyc-section mb-0">
          <div className="kyc-section-head">
            <div className="kyc-section-title">
              <h6>Saved Bank Account</h6>
              {renderStatus(customerBankInfo.verified)}
            </div>
            <div className="kyc-controls">
              <Form.Check
                type="switch"
                label="Verified"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerBankVerified();
                  }
                }}
                defaultChecked={customerBankInfo.verified}
              />
              <Form.Check
                className="text-danger"
                type="switch"
                label="Reject"
                onChange={(e) => {
                  const { value, checked } = e.target;
                  if (checked) {
                    handelCustomerBankClear();
                  }
                }}
              />
            </div>
          </div>
          <div className="cd-grid">
            <div className="cd-field">
              <label>Account No</label>
              <span>{customerBankInfo.accountNo}</span>
            </div>
            <div className="cd-field">
              <label>Holder Name</label>
              <span>{customerBankInfo.holderName || "-"}</span>
            </div>
            <div className="cd-field">
              <label>Bank Name</label>
              <span>{customerBankInfo.bankName || "-"}</span>
            </div>
            <div className="cd-field">
              <label>Account Type</label>
              <span>{customerBankInfo.accountType || "-"}</span>
            </div>
            <div className="cd-field">
              <label>IFSC</label>
              <span>{customerBankInfo.ifsc || "-"}</span>
            </div>
          </div>
        </div>
      ) : null}

      <KycImageViewer
        show={!!viewer}
        onHide={() => setViewer(null)}
        title={activeDoc?.title || ""}
        images={activeDoc ? activeDoc.images.filter((i) => i.src) : []}
        initialIndex={viewer?.index || 0}
        fields={activeDoc?.fields || []}
        verified={activeDoc?.verified}
        canVerify={!!activeDoc?.canVerify}
        onVerify={() =>
          handelCustomerkycVerified({
            customerid: customerid,
            verifiedTo: activeDoc?.verifiedTo,
          })
        }
        onReject={() =>
          handelCustomerkycRejected({
            customerid: customerid,
            kycdocs: viewer?.doc,
          })
        }
      />
    </div>
  );
};

export default CustomerBank;
