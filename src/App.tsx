import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import Papa from "papaparse";
import "./App.css";
import ConflictedDataTable from "./components/ConflictedDataTable";
import { CSVRow, FilterOptions } from "./types";
import Header from "./components/Header";

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
    const selectedValue = e.target.value as FilterOptions;
    setSelectedFilter(selectedValue);
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

    // Apply filter
    if (selectedFilter === FilterOptions.UniqueCharacters) {
      data = Array.from(new Set(data.map((row) => row.name))).map((name) => ({
        name,
        profession: data.find((row) => row.name === name)?.profession || "",
      }));
    }
    if (selectedFilter === FilterOptions.UniqueProfessions) {
      data = Array.from(new Set(data.map((row) => row.profession))).map(
        (profession) => ({
          profession,
        })
      );
    }

    if (sortConfig) {
      data.sort((a, b) => {
        const valueA = a[sortConfig.key] || "";
        const valueB = b[sortConfig.key] || "";
        let comparison = 0;

        if (valueA.length === 0 && valueB.length > 0) {
          return 1; // valueA is empty, move it to the end
        }
        if (valueB.length === 0 && valueA.length > 0) {
          return -1; // valueB is empty, move it to the end
        }

        const numA = valueA?.split(".")[0];
        const numB = valueB?.split(".")[0];

        const parsedNumA = Number(numA);
        const parsedNumB = Number(numB);

        if (!isNaN(parsedNumA) && !isNaN(parsedNumB)) {
          comparison = parsedNumA - parsedNumB;
        } else {
          comparison = valueA.localeCompare(valueB);
        }

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    setFilteredData(data);
    setHeaders(() => (data[0] ? Object.keys(data[0]) : []));
  };

  useEffect(() => {
    applyFiltersAndSorting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, sortConfig, tableData, searchQuery]);

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

  const handleCharacterClick = (name: string) => {
    if (!name) return;

    setSelectedCharacters((prevSelected) => {
      if (prevSelected.includes(name)) {
        return prevSelected.filter((selectedName) => selectedName !== name);
      } else {
        return [...prevSelected, name];
      }
    });
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
                      style={{
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
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
                    if (event.metaKey) {
                      handleCharacterClick(row.name);
                    }
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
