import React from "react";

const SelectElement = ({ className, onChange, defaultValue, children }) => {
  return (
    <select
      className={className}
      onChange={onChange}
      defaultValue={defaultValue}
    >
      {children}
    </select>
  );
};

export default SelectElement;
