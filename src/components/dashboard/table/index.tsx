"use client";
import { useState, useEffect } from "react";
import TableRow from "./row";
import { api } from "../../../utils/apiInterceptor";
import CircularLoader from "../../common/circularLoader";
import { LogStats } from "../../../types/ui";
import { getSocket } from "../../../utils/socket";
import { toastMessage } from "../../../utils/helper";

const TableReact = () => {
  const [logStats, setLogStats] = useState<LogStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogStats = async () => {
    setLoading(true);
    const { data } = await api.get<LogStats[]>("/api/v1/stats", {
      showToast: false,
    });

    setLogStats(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogStats();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("job-progress", (data: { result: { data: LogStats[] } }) => {
      const updatedData = data?.result?.data?.[0];
      if (updatedData && updatedData.jobId) {
        setLogStats((prevLogStats) => {
          const existingIndex = prevLogStats.findIndex(
            (item) => item.jobId === updatedData.jobId
          );
  
          if (existingIndex !== -1) {
            const updatedLogStats = [...prevLogStats];
            updatedLogStats[existingIndex] = updatedData;
            return updatedLogStats;
          } else {
            return [updatedData, ...prevLogStats];
          }
        });
  
        setTimeout(() => {
          toastMessage({
            message: `Log stats updated for job: ${updatedData.jobId}`,
            type: "success",
          });
        }, 100);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="w-full md:overflow-auto  max-w-7xl 2xl:max-w-none">
        <table className="table-auto overflow-y-scroll md:overflow-auto w-full text-left font-inter border ">
          <thead
            className={`rounded-lg text-base text-white font-semibold w-full ${
              logStats?.length > 0 ? "border-b-0" : "border-b-2 border-black"
            }`}
          >
            <tr className="bg-[#222E3A]/[6%] border-x-2 border-t-2 border-black">
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Job ID
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                File Name
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Errors
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Keywords
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Unique IPs
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Processed At
              </th>
              <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody
            className={`border-x-2 border-black border-b-2 max-w-full ${
              loading || logStats?.length === 0 ? "h-[200px]" : ""
            }`}
          >
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <CircularLoader />
                </td>
              </tr>
            ) : logStats?.length > 0 ? (
              logStats.map((log, index) => (
                <TableRow
                  log={log}
                  index={index}
                  rowsLength={logStats.length}
                  key={log.jobId}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <PaginationComponent
        list={logStats}
        currentPage={currentPage}
        totalPage={totalPage}
        rowsLimit={rowsLimit}
        previousPage={previousPage}
        nextPage={nextPage}
        changePage={changePage}
        customPagination={customPagination}
      /> */}
    </>
  );
};
export default TableReact;
