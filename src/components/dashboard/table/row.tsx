"use client";
import React from "react";
import { LogStats } from "../../../types/ui";
const TableRow = ({log, index, rowsLength}: {log: LogStats, index: number, rowsLength: number}) => {
  return (
    <tr
      className={`${index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"} max-w-full`}
    >
      <td
        className={`py-2 px-3 font-normal text-base ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } overflow-x-scroll scrollbar-hidden`}
      >
        {log?.jobId}
      </td>
      <td
        className={`py-2 px-3 font-normal text-base ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } whitespace-nowrap overflow-x-scroll scrollbar-hidden`}
      >
        {log?.filename?.split("/")[1]}
      </td>
      <td
        className={`py-2 px-3 font-normal text-base ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } overflow-x-scroll scrollbar-hidden`}
      >
        {log?.errorCount}
      </td>
      <td
        className={`py-2 px-3 text-base  font-normal ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } whitespace-nowrap overflow-x-scroll scrollbar-hidden`}
      >
        {Object.entries(log?.keywordCounts || {}).map(([keyword, count]) => (
          <div key={keyword}>
            {keyword}: {count}
          </div>
        ))}
      </td>
      <td
        className={`py-2 px-3 text-base font-normal max-w-[100px] ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } whitespace-nowrap overflow-x-scroll scrollbar-hidden`}
      >
        {log?.uniqueIPs?.join(", ")}
      </td>
      <td
        className={`py-5 px-4 text-base  font-normal ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        }`}
      >
        {new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
          hour12: false,
          fractionalSecondDigits: 3,
        }).format(new Date(log?.processedAt))}
      </td>
      <td
        className={`py-5 px-4 text-base  font-normal ${
          index == 0
            ? "border-t-2 border-black"
            : index == rowsLength
            ? "border-y"
            : "border-t"
        } overflow-x-scroll scrollbar-hidden`}
      >
        {log?.processingStatus}
      </td>
    </tr>
  );
};

export default TableRow;
