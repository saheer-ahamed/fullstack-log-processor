import React from "react";

const loading = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <div className="w-40 h-8 bg-gray-300 rounded-md animate-pulse" />
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs h-12 bg-gray-300 rounded-lg animate-pulse mt-5" />
              </div>
              <div className="relative my-6 grid place-items-center">
                <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse" />
              </div>
              <div className="mx-auto max-w-xs">
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse mt-5" />
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse mt-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
