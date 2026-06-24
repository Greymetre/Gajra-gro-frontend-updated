import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { getRemarkList } from "../../helpers/backend_helper";
import { SelectRemarkInterface } from "../../interfaces/pagination.interface";

const RemarkList = ({
  _id,
  handleInputChange,
}: {
  _id: string;
  handleInputChange: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Array<SelectRemarkInterface>>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>();

  const fetchRemarkList = async () => {
    try {
      const res = await getRemarkList();
      if (!res.isError) {
        setOptions(res.data);
      }
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRemarkList();
  }, []);

  useEffect(() => {
    if (_id) {
      const item = options.find((option) => option._id === _id);
      setSelectedItemId(item?._id);
    }
  }, [_id, options]);
        console.log("xx",_id);


  return (
    <Form.Group className="mb-1">
      {!isLoading && (
        <div className="col-md-4 col-sm-6 col-xs-12">
          <Form.Label htmlFor="Customer">Remark</Form.Label>
          <select
            name="_id"
            value={selectedItemId}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: "_id",
                  value: e.target.value,
                  type: "select",
                },
              })
            }
          >
            <option value="">Select Remark</option>
            {options.map((item) => (
              <option key={item._id} value={item._id}>
                {item.remark}
              </option>
            ))}
          </select>
        </div>
      )}
    </Form.Group>
  );
};

export default RemarkList;
