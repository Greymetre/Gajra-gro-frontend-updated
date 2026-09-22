import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { backendParentCustomersDropDownList } from "../../helpers/backend_helper";

interface ParentOption {
  value: string; // parent customer id, empty for a typed name
  label: string;
  parentName: string; // set only for typed names
}

// Parent customer: pick an existing parent or type a new name
const SelectParentCustomer = ({
  handleInputChange,
  parentid,
  parentName,
  parentLabel,
}: {
  handleInputChange: any;
  parentid?: string;
  parentName?: string;
  parentLabel?: string; // name of the saved parent, used until options load
}) => {
  const [options, setOptions] = useState<Array<ParentOption>>([]);
  // Text typed but not picked; saved on blur so Save works without pressing Enter
  const typedText = useRef("");

  useEffect(() => {
    backendParentCustomersDropDownList({}).then((res: any) => {
      if (!res.isError && Array.isArray(res.data)) {
        setOptions(res.data);
      }
    });
  }, []);

  const setParent = (id: string, name: string) => {
    handleInputChange({ target: { name: "parentid", value: id, type: "select" } });
    handleInputChange({ target: { name: "parentName", value: name, type: "select" } });
  };

  let selected: ParentOption | null = null;
  if (parentid) {
    selected = options.find((o) => o.value === parentid) || {
      value: parentid,
      label: parentLabel || parentid,
      parentName: "",
    };
  } else if (parentName) {
    selected = { value: "", label: parentName, parentName };
  }

  return (
    <Form.Group className="mb-1">
      <Form.Label>Parent Customer</Form.Label>
      <CreatableSelect
        options={options}
        name="parentid"
        value={selected}
        isClearable
        isSearchable
        placeholder="Select or type parent customer"
        formatCreateLabel={(input: string) => `Add "${input}"`}
        getOptionValue={(o: ParentOption) => o.value || `name:${o.label}`}
        onInputChange={(text: string, meta: any) => {
          if (meta.action === "input-change") typedText.current = text;
        }}
        onBlur={() => {
          const text = typedText.current.trim();
          typedText.current = "";
          if (!text) return;
          const match = options.find(
            (o) => o.label.toLowerCase() === text.toLowerCase()
          );
          if (match) setParent(match.value, match.parentName || "");
          else setParent("", text);
        }}
        onChange={(o: any) => {
          typedText.current = "";
          if (!o) return setParent("", "");
          if (o.__isNew__) return setParent("", o.value.trim());
          setParent(o.value, o.parentName || "");
        }}
      />
    </Form.Group>
  );
};

export default SelectParentCustomer;
