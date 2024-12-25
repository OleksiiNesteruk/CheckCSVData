import React from "react";

type DropdownProps = {
  filters: {
    filterOption: string;
  };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ filters, handleFilterChange }) => {
  return (
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger ">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>
            {filters.filterOption === "all"
              ? "All Characters"
              : "Unique Characters"}
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <a
            href="#"
            className="dropdown-item"
            onClick={() =>
              handleFilterChange({
                target: { value: "all" },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            All Characters
          </a>
          <a
            href="#"
            className="dropdown-item"
            onClick={() =>
              handleFilterChange({
                target: { value: "uniqueCharacters" },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            Unique Characters
          </a>
          <a
            href="#"
            className="dropdown-item"
            onClick={() =>
              handleFilterChange({
                target: { value: "uniqueProfessions" },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            Unique Professions
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
