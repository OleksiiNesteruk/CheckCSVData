import React from "react";
import { CSVRow } from "../types";
import Dropdown from "./Dropdown";

type HeaderProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tableData: CSVRow[];
  clearData: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  filterOption: string;
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
  filterOption,
  handleFilterChange,
  checkSameNamesSameProfessions,
  fileInputRef,
  clearConflictedCharacters,
}) => {
  return (
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
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Choose a file…</span>
            </span>
          </label>
        </div>

        <div className="buttons">
          {clearConflictedCharacters && (
            <button
              className="button is-danger "
              onClick={clearConflictedCharacters}
            >
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
              filters={{ filterOption }}
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
};

export default Header;
