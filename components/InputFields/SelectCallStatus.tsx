import React, { useState, useEffect } from "react";
import Router from "next/router";
import { Row, Col, Form } from "react-bootstrap";
import { backendGetCallStatus } from "../../helpers/backend_helper";
import Select from "react-select";
import { SelectDropDownInterface } from "../../interfaces/pagination.interface";

const SelectCallStatus = ({
  handleInputChange,
  callStatus,
}: {
  handleInputChange: any;
  callStatus: string;
}) => {
  const [options, setOptions] = useState<Array<SelectDropDownInterface>>([]);
  const fetchOptionsData = async () => {
    await backendGetCallStatus().then((res) => {
      if (!res.isError) {
        setOptions(res.data);
      }
    });
  };
  useEffect(() => {
    fetchOptionsData();
  }, []);
  const [selectedItem, setSelectedItem] = useState<SelectDropDownInterface>();
  useEffect(() => {
    if (callStatus) {
      const item = options.find((option) => option.value == callStatus);
      setSelectedItem(item);
    }
  }, [callStatus]);

  return (
    <Form.Group className="mb-1">
      <Form.Label htmlFor="User">Call Status</Form.Label>
      <Select
        options={options}
        name="callStatus"
        value={selectedItem}
        onChange={(e: any) =>
          handleInputChange({
            target: {
              name: "callStatus",
              value: e.value,
              type: "select",
            },
          })
        }
        isSearchable
      />
    </Form.Group>
  );
};

export default SelectCallStatus;
