"use client";
import React from "react";
import { useFormik } from "formik";
import { signUp } from "../../utils/serverActions/auth";
import { useUser } from "../context";
import CustomInput from "../common/customInput";
import { useRouter } from "next/navigation";
import { toastMessage } from "../../utils/helper";
import CircularLoader from "../common/circularLoader";
import isEmail from "validator/lib/isEmail";
import { SignupFormValues } from "../../types/ui";

const Signup = () => {
  const router = useRouter();

  const { setUser } = useUser();

  const signUpFormik = useFormik<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      const errors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        globalError?: string;
      } = {};

      if (!values.name) {
        errors.name = "Name is required";
      }
      
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!isEmail(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      
      if (Object.keys(errors).length > 0) {
        signUpFormik.setSubmitting(false);
        signUpFormik.setErrors(errors);
      } else {
        try {
          const response = await signUp({
            email: values.email,
            password: values.password,
            name: values.name,
          });
          if (response.errorMessage) {
            errors.globalError = response.errorMessage;
            signUpFormik.setErrors(errors);
            signUpFormik.setSubmitting(false);
          } else if (response.data) {
            toastMessage({
              message: "Confirmation email sent. Please check your email.",
              type: "success",
            });
            setUser(response.data);
            router.push("/login");
          }
        } catch (error) {
          toastMessage({
            message: "Error signing up. Try again.",
            type: "error",
          });
        }
      }
    },
  });

  return (
    <form className="mx-auto max-w-xs" onSubmit={signUpFormik.handleSubmit}>
      <CustomInput
        name="name"
        type="text"
        placeholder="Name"
        value={signUpFormik.values.name}
        onChange={signUpFormik.handleChange}
      />
      {signUpFormik.errors.name && (
        <p className="text-red-500 text-sm">{signUpFormik.errors.name}</p>
      )}
      <CustomInput
        name="email"
        type="email"
        placeholder="Email"
        value={signUpFormik.values.email}
        onChange={signUpFormik.handleChange}
        className={
          signUpFormik.errors.email ? "border-red-500 focus:border-red-500" : ""
        }
      />
      {signUpFormik.errors.email && (
        <p className="text-red-500 text-sm">{signUpFormik.errors.email}</p>
      )}
      <CustomInput
        name="password"
        type="password"
        placeholder="Password"
        value={signUpFormik.values.password}
        onChange={signUpFormik.handleChange}
        className={
          signUpFormik.errors.password
            ? "border-red-500 focus:border-red-500"
            : ""
        }
      />
      {signUpFormik.errors.password && (
        <p className="text-red-500 text-sm">{signUpFormik.errors.password}</p>
      )}
      <CustomInput
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={signUpFormik.values.confirmPassword}
        onChange={signUpFormik.handleChange}
        className={
          signUpFormik.errors.confirmPassword
            ? "border-red-500 focus:border-red-500"
            : ""
        }
      />
      {signUpFormik.errors.confirmPassword && (
        <p className="text-red-500 text-sm">
          {signUpFormik.errors.confirmPassword}
        </p>
      )}
      {signUpFormik.errors?.globalError && (
        <p className="text-red-500 text-sm">
          {signUpFormik.errors.globalError}
        </p>
      )}
      <button
        type="submit"
        className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50"
        disabled={signUpFormik.isSubmitting}
      >
        {signUpFormik.isSubmitting ? (
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
            <span className="ml-3">Sign Up</span>
          </>
        )}
      </button>
    </form>
  );
};

export default Signup;
