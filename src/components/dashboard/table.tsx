"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
);

interface LogStats {
  jobId: string;
  filename: string;
  errorCount: number;
  keywordCounts: Record<string, number>;
  uniqueIPs: string[];
  processedAt: string;
  processingStatus: string;
}

const CHUNK_SIZE = 5 * 1024 * 1024;

const TableReact = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [logStats, setLogStats] = useState<LogStats[]>([]);
  const [jobStatuses, setJobStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/v1/stats")
      .then((res) => res.json())
      .then((data) => setLogStats(data));

    socket.on("job_progress", (update) => {
      setJobStatuses((prev) => ({
        ...prev,
        [update.jobId]: update.status,
      }));
    });

    return () => {
      socket.off("job_progress");
    };
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        await handleUpload(file);
      }
    }
  };

  const handleUpload = async (file: File) => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        toast.error("Please select a file first!");
        return;
      }

      const allowedTypes = [
        "text/plain",
        "application/json",
        "text/csv",
        "text/log",
        "text/x-log",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please select a valid log file.");
        return;
      }

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let uploadedChunks = 0;
      const fileId = `${file.name}-${Date.now()}`;

      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const chunk = file.slice(start, start + CHUNK_SIZE);
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("filename", file.name);
        formData.append("fileId", fileId);
        formData.append(
          "chunkIndex",
          Math.floor(start / CHUNK_SIZE).toString()
        );
        formData.append("totalChunks", totalChunks.toString());

        let response = await fetch("/api/v1/upload-logs", {
          method: "POST",
          body: formData,
        });
        let data = await response.json();

        if (data.status === 200) {
          uploadedChunks++;
          setUploadProgress((uploadedChunks / totalChunks) * 100);
        } else {
          toast.error(data.error);
          reject(new Error(data.error));
        }
      }

      resolve(true);
    });
  };

  return (
    <div className="min-h-screen h-full bg-white flex  items-center justify-center pt-10 pb-14 text-black">
      <div className="w-full max-w-5xl px-2">
        <div>
          <h1 className="text-2xl font-medium">Logs Tracking Table</h1>
        </div>
        <div className="flex justify-end items-center gap-3 bg-[#222E3A]/[6%]  px-2  mt-2 py-2 border-2 border-b-0 border-black">
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Logs
            </button>
            <input
              type="file"
              accept=".log, .txt, .json"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <progress value={uploadProgress} max="100"></progress>
            {uploadProgress === 100 && <p>Upload Complete!</p>}
          </div>
          {/* <div className="px-2 bg-white py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2741 9.05133C11.1214 7.89518 11.5009 6.46176 11.3366 5.03784C11.1724 3.61391 10.4766 2.3045 9.38841 1.37157C8.30022 0.438638 6.8999 -0.0490148 5.4676 0.0061742C4.0353 0.0613632 2.67666 0.655324 1.66348 1.66923C0.650303 2.68313 0.0573143 4.0422 0.00315019 5.47454C-0.0510139 6.90687 0.437641 8.30685 1.37135 9.39437C2.30506 10.4819 3.61497 11.1768 5.03901 11.34C6.46305 11.5032 7.8962 11.1227 9.05174 10.2746H9.05087C9.07712 10.3096 9.10512 10.3428 9.13662 10.3752L12.5054 13.744C12.6694 13.9081 12.892 14.0004 13.1241 14.0005C13.3562 14.0006 13.5789 13.9085 13.7431 13.7444C13.9072 13.5803 13.9995 13.3578 13.9996 13.1256C13.9997 12.8935 13.9076 12.6709 13.7435 12.5067L10.3747 9.13796C10.3435 9.10629 10.3098 9.07704 10.2741 9.05046V9.05133ZM10.4999 5.68783C10.4999 6.31982 10.3754 6.94562 10.1335 7.5295C9.89169 8.11338 9.5372 8.6439 9.09032 9.09078C8.64344 9.53767 8.11291 9.89215 7.52903 10.134C6.94515 10.3759 6.31936 10.5003 5.68737 10.5003C5.05538 10.5003 4.42959 10.3759 3.84571 10.134C3.26183 9.89215 2.7313 9.53767 2.28442 9.09078C1.83754 8.6439 1.48305 8.11338 1.2412 7.5295C0.999349 6.94562 0.87487 6.31982 0.87487 5.68783C0.87487 4.41148 1.3819 3.1874 2.28442 2.28488C3.18694 1.38236 4.41102 0.875332 5.68737 0.875332C6.96372 0.875332 8.1878 1.38236 9.09032 2.28488C9.99284 3.1874 10.4999 4.41148 10.4999 5.68783Z"
                  fill="black"
                />
              </svg>
              <input
                type="text"
                className="max-w-[150px] text-sm bg-transparent focus:ring-0 border-transparent outline-none placeholder:text-black text-black w-[85%]"
                placeholder="Keyword Search"
                onChange={(e) => searchProducts(e.target.value)}
                value={searchValue}
              />
              <svg
                stroke="currentColor"
                fill="black"
                className={`text-black cursor-pointer ${
                  searchValue?.length > 0 ? "visible" : "invisible"
                }`}
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                onClick={clearData}
              >
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
              </svg>
            </div>
          </div> */}
        </div>
        <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
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
            <tbody className="border-x-2 border-black border-b-2">
              {logStats.map((log, index) => (
                <tr
                  className={`${
                    index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                  }`}
                  key={log?.jobId}
                >
                  <td
                    className={`py-2 px-3 font-normal text-base ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                  >
                    {log?.jobId}
                  </td>
                  <td
                    className={`py-2 px-3 font-normal text-base ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                  >
                    {log?.filename}
                  </td>
                  <td
                    className={`py-2 px-3 font-normal text-base ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                  >
                    {log?.errorCount}
                  </td>
                  <td
                    className={`py-2 px-3 text-base  font-normal ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    }`}
                  >
                    {Object.entries(log?.keywordCounts || {}).map(
                      ([keyword, count]) => (
                        <div key={keyword}>
                          {keyword}: {count}
                        </div>
                      )
                    )}
                  </td>
                  <td
                    className={`py-2 px-3 text-base max-w-[200px] font-normal ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
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
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    }`}
                  >
                    {log?.processedAt}
                  </td>
                  <td
                    className={`py-5 px-4 text-base  font-normal ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == logStats?.length
                        ? "border-y"
                        : "border-t"
                    }`}
                  >
                    {jobStatuses[log?.jobId] || log?.processingStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div
          className={`w-full justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2.5 px-1 items-center ${
            productList?.length > 0 ? "flex" : "hidden"
          }`}
        >
          <div className="text-lg">
            Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
            {currentPage == totalPage - 1
              ? productList?.length
              : (currentPage + 1) * rowsLimit}{" "}
            of {productList?.length} entries
          </div>
          <div className="flex">
            <ul
              className="flex justify-center items-center gap-x-[10px] z-30"
              role="navigation"
              aria-label="Pagination"
            >
              <li
                className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                  currentPage == 0
                    ? "bg-[#cccccc] pointer-events-none"
                    : " cursor-pointer"
                }`}
                onClick={previousPage}
              >
                <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
              </li>
              {customPagination?.map((data, index) => (
                <li
                  className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                    currentPage == index
                      ? "text-blue-600  border-sky-500"
                      : "border-[#E4E4EB] "
                  }`}
                  onClick={() => changePage(index)}
                  key={index}
                >
                  {index + 1}
                </li>
              ))}
              <li
                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                  currentPage == totalPage - 1
                    ? "bg-[#cccccc] pointer-events-none"
                    : " cursor-pointer"
                }`}
                onClick={nextPage}
              >
                <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
              </li>
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default TableReact;
