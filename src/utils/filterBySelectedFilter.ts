import { CSVRow, FilterOptions } from "../types";

export const filterBySelectedFilter = (data: CSVRow[], filter: FilterOptions): CSVRow[] => {
  if (filter === FilterOptions.UniqueCharacters) {
    return Array.from(new Set(data.map((row) => row.name))).map((name) => ({
      name,
      profession: data.find((row) => row.name === name)?.profession || "",
    }));
  }
  if (filter === FilterOptions.UniqueProfessions) {
    return Array.from(new Set(data.map((row) => row.profession))).map((profession) => ({
      profession,
    }));
  }
  return data;
};
