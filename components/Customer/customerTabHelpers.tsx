import React from "react";

export const formatTabDate = (value: any) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toneFor = (value: string) => {
  const v = value.toLowerCase();
  if (/(success|approv|verif|complete|paid|credit|^cr$|done|connected)/.test(v))
    return "cd-badge-success";
  if (/(reject|fail|cancel|declin|^dr$|debit)/.test(v)) return "cd-badge-danger";
  if (/(pending|process|hold|wait|follow)/.test(v)) return "cd-badge-warn";
  return "cd-badge-muted";
};

export const StatusBadge = ({ value }: { value?: any }) =>
  value ? (
    <span className={`cd-badge ${toneFor(String(value))}`}>{value}</span>
  ) : (
    <>-</>
  );

export const EmptyRow = ({ colSpan, text }: { colSpan: number; text: string }) => (
  <tr>
    <td colSpan={colSpan} className="cd-empty">
      {text}
    </td>
  </tr>
);
