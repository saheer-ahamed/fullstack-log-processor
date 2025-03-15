import React from "react";
import { signInWithGithub } from "@/utils/serverActions/auth";
import Link from "next/link";
import Login from "./login";
import Signup from "./signup";

const AuthComponent = ({
  type,
}: {
  type: "login" | "signup";
}) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {type === "login" ? "Login" : "Sign up"}
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  onClick={signInWithGithub}
                  className="cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow hover:bg-indigo-200 focus:shadow-sm focus:shadow-outline mt-5"
                >
                  <div className="bg-white p-1 rounded-full">
                    <svg className="w-6" viewBox="0 0 32 32">
                      <path
                        fillRule="evenodd"
                        d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">
                    {type === "login"
                      ? "Login with GitHub"
                      : "Sign up with GitHub"}
                  </span>
                </button>
              </div>
              <div className="relative my-6 grid place-items-center">
                <div className="overflow-hidden leading-none z-1 px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white">
                  Or {type === "login" ? "Sign up" : "Login"} with e-mail
                </div>
                <hr className="absolute left-[50%] top-[50%] transform translate-y-[-50%] translate-x-[-50%] w-full" />
              </div>
              {type === "login" ? <Login /> : <Signup />}
              <div className="flex justify-center items-center">
                <p className="text-sm font-light text-gray-900">
                  {type === "login"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <Link
                    href={type === "login" ? "/signup" : "/login"}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    {" "}
                    {type === "login" ? "Sign up" : "Login"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
