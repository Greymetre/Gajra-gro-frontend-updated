import React, { useState, useEffect } from "react";
import Router from "next/router";
import { Row, Col, Form } from "react-bootstrap";
import { backendCustomersDropDownList } from "../../helpers/backend_helper";
import Select from "react-select";
import { SelectDropDownInterface } from "../../interfaces/pagination.interface";
import { type } from "os";

const SelectCustomerList = ({
  handleInputChange,
  customerid,
}: {
  handleInputChange: any;

  customerid: string | undefined;
}) => {
  const [customerData, setCustomerData] = useState<
    Array<SelectDropDownInterface>
  >([]);
  const [selectedItem, setSelectedItem] = useState<SelectDropDownInterface>();

  const fetchCustomerData = async () => {
    await backendCustomersDropDownList({}).then((res) => {
      if (!res.isError) {
        setCustomerData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchCustomerData();
  }, []);

  // aadharVerified: false;
  // bankVerified: false;
  // label: "Vijay Garage-Bermo_7739566053";
  // otherVerified: false;
  // panVerified: false;
  // totalRedemption: 0;
  useEffect(() => {
    if (customerid) {
      const item = customerData.find((type) => type.value == customerid);
      setSelectedItem(item);
    }

    // if(aadharVerified == )
  }, [customerid]);

  return (
    <Col md={4} sm={6} xs={12}>
      <Form.Group className="mb-1">
        <Form.Label htmlFor="Customer">Customer</Form.Label>
        <Select
          options={customerData}
          name="customerid"
          value={selectedItem}
          onChange={(e: any) =>
            handleInputChange({
              target: {
                name: "customerid",
                value: e.value,
                type: "select",
              },
            })
          }
          required={true}
          isSearchable
        />
      </Form.Group>
    </Col>
  );
};

export default SelectCustomerList;
