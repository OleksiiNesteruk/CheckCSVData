import { CSVRow } from "../types";

export const checkSameNamesSameProfessions = (tableData: CSVRow[]): CSVRow[] => {
  const professionMap: Record<string, Set<string>> = {};
  tableData.forEach((row) => {
    if (row.name) {
      if (!professionMap[row.name]) {
        professionMap[row.name] = new Set();
      }
      professionMap[row.name].add(row.profession);
    }
  });
  const conflictingNames = Object.keys(professionMap).filter((name) => professionMap[name].size > 1);
  if (conflictingNames.length > 0) {
    return conflictingNames.map((name) => ({
      name,
      profession: Array.from(professionMap[name]).join(", "),
    }));
  } else {
    alert("Same names have the same professions.");
    return [];
  }
};
