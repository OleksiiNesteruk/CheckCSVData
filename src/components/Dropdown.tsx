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
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger ">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>
            {options.find((option) => option.value === selectedFilter)?.label}
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {options.map((option) => (
            <a
              key={option.value}
              href="#"
              className="dropdown-item"
              onClick={() =>
                handleFilterChange({
                  target: { value: option.value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
