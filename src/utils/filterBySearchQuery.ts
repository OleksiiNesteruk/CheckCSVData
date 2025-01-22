import { CSVRow } from "../types";

export const filterBySearchQuery = (data: CSVRow[], query: string, headers: string[]): CSVRow[] => {
  if (!query) return data;
  return data.filter((row) =>
    headers.some((header) => row[header].toLowerCase().includes(query.toLowerCase()))
  );
};
