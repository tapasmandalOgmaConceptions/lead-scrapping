import React from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { useField, useFormikContext } from "formik";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormikSelectProps {
  name: string;
  options: SelectOption[];
  isMulti?: boolean;
}

const FormikReactSelect: React.FC<FormikSelectProps> = ({ name, options, isMulti }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [field] = useField(name);

  const getValue = () => {
    if (isMulti) {
      if (!field.value || field.value.length === 0) return [];
      return options.filter((opt) => field.value.includes(opt.value));
    }
    return options.find((option) => option.value === field.value) || null;
  };

  const handleChange = (
    selected: MultiValue<SelectOption> | SingleValue<SelectOption>
  ) => {
    if (isMulti) {
      const values = (selected as MultiValue<SelectOption>).map(
        (item) => item.value
      );
      setFieldValue(name, values);
    } else {
      setFieldValue(name, (selected as SingleValue<SelectOption>)?.value || "");
    }
    setFieldTouched(name, true, true);
  };

  const handleBlur = () => {
    setFieldTouched(name, true, true);
  };

  return (
    <Select
      options={options}
      isMulti={isMulti}
      value={getValue()}
      onChange={handleChange}
      onBlur={handleBlur}
      classNamePrefix="react-select"
    />
  );
};

export default FormikReactSelect;
