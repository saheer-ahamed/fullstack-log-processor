"use client";
import React, { Suspense } from "react";
import AddLogFiles from "./addLogs";
import dynamic from "next/dynamic";
import CircularLoader from "../common/circularLoader";

const TableReact = dynamic(() => import("./table"));

const DashboardComponent = () => {
  return (
    <React.Fragment>
      <Suspense
        fallback={
          <div className="text-center py-4">
            <CircularLoader />
          </div>
        }
      >
        <div>
          <h1 className="text-2xl font-medium">Logs Tracking Table</h1>
        </div>
        <div className="flex justify-end items-center gap-3 bg-[#222E3A]/[6%]  px-2  mt-2 py-2 border-2 border-b-0 border-black">
          <AddLogFiles />
        </div>

        <TableReact />
      </Suspense>
    </React.Fragment>
  );
};

export default DashboardComponent;
