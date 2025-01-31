import React from "react";
import { CSVRow, FilterOptions } from "../types";
import Dropdown from "./Dropdown";

type HeaderProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tableData: CSVRow[];
  clearData: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  selectedFilter: FilterOptions;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  checkSameNamesSameProfessions: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  clearConflictedCharacters?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  handleSearchChange,
  tableData,
  clearData,
  handleFileChange,
  searchQuery,
  selectedFilter,
  handleFilterChange,
  checkSameNamesSameProfessions,
  fileInputRef,
  clearConflictedCharacters,
}) => (
  <header className="header">
    <div className="is-flex is-justify-content-space-between is-align-items-center">
      <div className="file mb-0">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="resume"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <span className="file-cta">
            <span className="file-label">
              Choose a {tableData.length > 0 ? "new" : ""} CSV file…
            </span>
          </span>
        </label>
      </div>

      <div className="buttons">
        {clearConflictedCharacters && (
          <button className="button is-danger" onClick={clearConflictedCharacters}>
            Close Conflicts Table
          </button>
        )}
        {tableData.length > 0 && (
          <button className="button is-danger" onClick={clearData}>
            Clear Data
          </button>
        )}
      </div>
    </div>

    {tableData.length > 0 && (
      <>
        <div className="is-flex is-justify-content-space-between mb-5 mt-5">
          <input
            type="text"
            className="input mr-2"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Dropdown
            selectedFilter={selectedFilter}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <button
          className="button is-primary is-fullwidth mb-5"
          onClick={checkSameNamesSameProfessions}
        >
          Find Name and Profession Conflicts
        </button>
      </>
    )}
  </header>
);

export default Header;
