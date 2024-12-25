import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import Papa from "papaparse";
import "./App.css";
import ConflictedDataTable from "./components/ConflictedDataTable";
import { CSVRow } from "./types";
import Header from "./components/Header";

const App: React.FC = () => {
  const [tableData, setTableData] = useState<CSVRow[]>([]);
  const [filteredData, setFilteredData] = useState<CSVRow[]>([]);
  const [conflictedCharacters, setConflictedCharacters] = useState<CSVRow[]>(
    []
  );
  const [headers, setHeaders] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    filterOption: "all",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearData = () => {
    localStorage.removeItem("tableData");
    localStorage.removeItem("tableHeaders");
    setTableData([]);
    setHeaders([]);
    setFilteredData([]);
    setConflictedCharacters([]);
    setFilters({ filterOption: "all" });
    setSortConfig(null);
    setSearchQuery("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearConflictedCharacters = () => {
    setConflictedCharacters([]);
  };

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
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, filterOption: e.target.value });
    setSortConfig(null);
    setSearchQuery("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const applyFiltersAndSorting = () => {
    let data = [...tableData];

    // Apply search filter
    if (searchQuery) {
      data = data.filter((row) =>
        headers.some((header) =>
          row[header].toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters.filterOption === "uniqueCharacters") {
      data = Array.from(new Set(data.map((row) => row.name))).map((name) => ({
        name,
        profession: data.find((row) => row.name === name)?.profession || "",
      }));
    }
    if (filters.filterOption === "uniqueProfessions") {
      data = Array.from(new Set(data.map((row) => row.profession))).map(
        (profession) => ({
          profession,
        })
      );
    }

    if (sortConfig) {
      data.sort((a, b) => {
        if (a[sortConfig.key] && b[sortConfig.key]) {
          if (sortConfig.key === "file") {
            const valueA = parseFloat(a[sortConfig.key].split(".")[0]);
            const valueB = parseFloat(b[sortConfig.key].split(".")[0]);
            const comparison = valueA - valueB;
            return sortConfig.direction === "asc" ? comparison : -comparison;
          } else {
            const comparison = a[sortConfig.key].localeCompare(
              b[sortConfig.key]
            );
            return sortConfig.direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    setFilteredData(data);
    setHeaders(() => (data[0] ? Object.keys(data[0]) : []));
  };

  useEffect(() => {
    applyFiltersAndSorting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortConfig, tableData, searchQuery]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const checkSameNamesSameProfessions = () => {
    const professionMap: Record<string, Set<string>> = {};

    tableData.forEach((row) => {
      if (row.name) {
        if (!professionMap[row.name]) {
          professionMap[row.name] = new Set();
        }
        professionMap[row.name].add(row.profession);
      }
    });

    const conflictingNames = Object.keys(professionMap).filter(
      (name) => professionMap[name].size > 1
    );

    if (conflictingNames.length > 0) {
      setConflictedCharacters(
        conflictingNames.map((name) => ({
          name,
          profession: Array.from(professionMap[name]).join(", "),
        }))
      );
    } else {
      alert("Same names have the same professions.");
    }
  };

  return (
    <div className="box" style={{ minWidth: "800px", margin: "0 auto" }}>
      <Header
        handleSearchChange={handleSearchChange}
        tableData={tableData}
        clearData={clearData}
        handleFileChange={handleFileChange}
        filterOption={filters.filterOption}
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
                      style={{
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {header}{" "}
                      {sortConfig?.key === header &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
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
