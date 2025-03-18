import React from "react";

const CustomInput = ({
  name,
  type,
  placeholder,
  value,
  className,
  onChange,
}: {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      name={name}
      className={`w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomInput;
