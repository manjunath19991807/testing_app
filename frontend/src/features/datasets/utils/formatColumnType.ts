import { ColumnType } from "../../../types/common";

export function formatColumnType(type: ColumnType) {
  if (type === "number") {
    return "Numeric column";
  }

  if (type === "date") {
    return "Date column";
  }

  return "Text column";
}
