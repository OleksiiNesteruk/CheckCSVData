import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import Papa from "papaparse";
import "./App.css";
import ConflictedDataTable from "./components/ConflictedDataTable";
import { CSVRow, FilterOptions } from "./types";
import Header from "./components/Header";
import { sortData } from "./utils/sortData";
import { filterBySearchQuery } from "./utils/filterBySearchQuery";
import { filterBySelectedFilter } from "./utils/filterBySelectedFilter";
import { checkSameNamesSameProfessions as checkConflicts } from "./utils/checkSameNamesSameProfessions";

const App: React.FC = () => {
  const [tableData, setTableData] = useState<CSVRow[]>([]);
  const [filteredData, setFilteredData] = useState<CSVRow[]>([]);
  const [conflictedCharacters, setConflictedCharacters] = useState<CSVRow[]>(
    []
  );
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>(
    FilterOptions.All
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearData = () => {
    localStorage.removeItem("tableData");
    localStorage.removeItem("tableHeaders");
    setTableData([]);
    setHeaders([]);
    setFilteredData([]);
    setConflictedCharacters([]);
    setSelectedFilter(FilterOptions.All);
    setSortConfig(null);
    setSearchQuery("");
    setSelectedCharacters([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearConflictedCharacters = () => setConflictedCharacters([]);

  useEffect(() => {
    const savedData = localStorage.getItem("tableData");
    const savedHeaders = localStorage.getItem("tableHeaders");
    if (savedData && savedHeaders) {
      const parsedData = JSON.parse(savedData);
      setTableData(parsedData);
      setHeaders(JSON.parse(savedHeaders));
      setFilteredData(parsedData);
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      Papa.parse<CSVRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data.length > 0) {
            clearData();
            const parsedData = result.data;
            const parsedHeaders = Object.keys(parsedData[0]);
            localStorage.setItem("tableData", JSON.stringify(parsedData));
            localStorage.setItem("tableHeaders", JSON.stringify(parsedHeaders));
            setHeaders(parsedHeaders);
            setTableData(parsedData);
            setFilteredData(parsedData);
          } else {
            console.warn("Uploaded CSV contains no data.");
          }
        },
        error: (error) => console.error("Error parsing CSV:", error.message),
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as FilterOptions;
    setSelectedFilter(newFilter);
    setSortConfig(null);
    setSearchQuery("");
    updateFilteredData(tableData, newFilter, null, "");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    updateFilteredData(tableData, selectedFilter, sortConfig, newQuery);
  };

  const updateFilteredData = (
    data: CSVRow[],
    filter: FilterOptions,
    config: { key: string; direction: "asc" | "desc" } | null,
    query: string
  ) => {
    let filteredData = [...data];
    filteredData = filterBySearchQuery(filteredData, query, headers);
    filteredData = filterBySelectedFilter(filteredData, filter);
    filteredData = sortData(filteredData, config);
    setFilteredData(filteredData);
    setHeaders(() => (filteredData[0] ? Object.keys(filteredData[0]) : []));
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    updateFilteredData(tableData, selectedFilter, newSortConfig, searchQuery);
  };

  const checkSameNamesSameProfessions = () => {
    const conflicts = checkConflicts(tableData);
    setConflictedCharacters(conflicts);
  };

  const handleCharacterClick = (name: string) => {
    if (!name) return;
    setSelectedCharacters((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((selectedName) => selectedName !== name)
        : [...prevSelected, name]
    );
  };

  return (
    <div className="box" style={{ minWidth: "800px", margin: "0 auto" }}>
      <Header
        handleSearchChange={handleSearchChange}
        tableData={tableData}
        clearData={clearData}
        handleFileChange={handleFileChange}
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        checkSameNamesSameProfessions={checkSameNamesSameProfessions}
        fileInputRef={fileInputRef}
        clearConflictedCharacters={
          conflictedCharacters.length > 0
            ? clearConflictedCharacters
            : undefined
        }
      />
      {conflictedCharacters.length > 0 && (
        <ConflictedDataTable conflictedCharacters={conflictedCharacters} />
      )}
      {filteredData.length > 0 && (
        <div className="table-container">
          <table className="table is-bordered is-striped is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                {headers.map((header, index) => (
                  <th key={index} title="Click to sort">
                    <div
                      onClick={() => handleSort(header)}
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                    >
                      {header.replace(/_/g, " ")}{" "}
                      {sortConfig?.key === header &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`is-clickable ${
                    selectedCharacters.includes(row.name) ? "is-selected" : ""
                  }`}
                  onClick={(event) => {
                    if (event.metaKey) handleCharacterClick(row.name);
                  }}
                >
                  <td>{rowIndex + 1}</td>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex}>{row[header] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
