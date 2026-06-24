import React, { useState, useEffect } from "react";
import Router from "next/router";
import { Row, Col, Form } from "react-bootstrap";
import { backendUsersDropDownList } from "../../helpers/backend_helper";
import Select from "react-select";
import { SelectDropDownInterface } from "../../interfaces/pagination.interface";

const SelectUserList = ({
  handleInputChange,
  fieldname,
  fieldvalue,
}: {
  handleInputChange: any;
  fieldname: string;
  fieldvalue: string;
}) => {
  const [userData, setUserData] = useState<Array<SelectDropDownInterface>>([]);
  const fetchUserData = async () => {
    await backendUsersDropDownList({}).then((res) => {
      if (!res.isError) {
        setUserData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const [selectedItem, setSelectedItem] = useState<SelectDropDownInterface>();
  useEffect(() => {
    if (fieldvalue) {
      const item = userData.find((type) => type.value == fieldvalue);
      setSelectedItem(item);

      console.log("eee id", fieldvalue);
    }
  }, [fieldvalue]);

  return (
    <Form.Group className="mb-1">
      <Form.Label htmlFor="User">User</Form.Label>
      <Select
        options={userData}
        name={fieldname}
        value={selectedItem}
        onChange={(e: any) =>
          handleInputChange({
            target: {
              name: fieldname,
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

export default SelectUserList;
