import React from "react";
import { FilterOptions } from "../types";

type DropdownProps = {
  selectedFilter: FilterOptions;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  selectedFilter,
  handleFilterChange,
}) => {
  const options = [
    { value: FilterOptions.All, label: "All Characters" },
    { value: FilterOptions.UniqueCharacters, label: "Unique Characters" },
    { value: FilterOptions.UniqueProfessions, label: "Unique Professions" },
  ];

  return (
    <div className="select ">
      <select value={selectedFilter} onChange={handleFilterChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
