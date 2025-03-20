"use client";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { login } from "@/src/utils/serverActions/auth";
import { UserContext } from "../context";
import CustomInput from "../common/customInput";
import { useRouter } from "next/navigation";
import CircularLoader from "../common/circularLoader";
import isEmail from "validator/lib/isEmail";
import { LoginFormValues } from "@/src/types/ui";

const Login = () => {
  const router = useRouter();

  const context = useContext(UserContext);
  const setUser = context?.setUser || (() => {});

  const loginFormik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      let errors: { email?: string; password?: string; globalError?: string } = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!isEmail(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (Object.keys(errors).length > 0) {
        loginFormik.setSubmitting(false);
        loginFormik.setErrors(errors);
      } else {
        try {
          let response = await login({
            email: values.email,
            password: values.password,
          });
          if (response.data) {
            setUser(response.data);
            router.push("/dashboard");
          } else if (response.errorMessage) {
            errors.globalError = response.errorMessage;
            loginFormik.setErrors(errors);
            loginFormik.setSubmitting(false);
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      }
    },
  });

  return (
    <form className="mx-auto max-w-xs" onSubmit={loginFormik.handleSubmit}>
      <CustomInput
        name="email"
        type="text"
        placeholder="Email"
        value={loginFormik.values.email}
        onChange={loginFormik.handleChange}
        className={loginFormik.errors.email || loginFormik.errors?.globalError ? "border-red-500 focus:border-red-500" : ""}
      />
      {loginFormik.errors.email && (
        <p className="text-red-500 text-sm">{loginFormik.errors.email}</p>
      )}
      <CustomInput
        name="password"
        type="password"
        placeholder="Password"
        value={loginFormik.values.password}
        onChange={loginFormik.handleChange}
        className={loginFormik.errors.password || loginFormik.errors?.globalError ? "border-red-500 focus:border-red-500" : ""}
      />
      {loginFormik.errors.password && (
        <p className="text-red-500 text-sm">{loginFormik.errors.password}</p>
      )}
      {loginFormik.errors?.globalError && (
        <p className="text-red-500 text-sm">{loginFormik.errors.globalError}</p>
      )}
      <button
        type="submit"
        className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 focus:shadow-outline focus:outline-none"
        disabled={loginFormik.isSubmitting}
      >
        {loginFormik.isSubmitting ? (
          <CircularLoader />
        ) : (
          <>
            <svg
              className="w-6 h-6 -ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span className="ml-3">Login</span>
          </>
        )}
      </button>
    </form>
  );
};

export default Login;
