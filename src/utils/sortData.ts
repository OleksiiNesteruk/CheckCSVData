import { CSVRow } from "../types";

export const sortData = (
  data: CSVRow[],
  config: { key: string; direction: "asc" | "desc" } | null
): CSVRow[] => {
  if (!config) return data;
  return data.sort((a, b) => {
    const valueA = a[config.key] || "";
    const valueB = b[config.key] || "";
    let comparison = 0;
    if (valueA.length === 0 && valueB.length > 0) return 1;
    if (valueB.length === 0 && valueA.length > 0) return -1;
    const numA = valueA?.split(".")[0];
    const numB = valueB?.split(".")[0];
    const parsedNumA = Number(numA);
    const parsedNumB = Number(numB);
    if (!isNaN(parsedNumA) && !isNaN(parsedNumB)) {
      comparison = parsedNumA - parsedNumB;
    } else {
      comparison = valueA.localeCompare(valueB);
    }
    return config.direction === "asc" ? comparison : -comparison;
  });
};
