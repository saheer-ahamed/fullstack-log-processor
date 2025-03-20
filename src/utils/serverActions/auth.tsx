"use server";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { User } from "@supabase/supabase-js";

export const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/dashboard",
        data: {
          name,
        },
      },
    });

    const response: {
      data: User | null;
      errorMessage: string | null;
    } = {
      data: null,
      errorMessage: null,
    };

    if (error) response.errorMessage = error.message;
    if (data) response.data = data.user ?? null;

    return response;
  } catch (err) {
    return { data: null, errorMessage: "An unexpected error occurred." };
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const response: {
      data: User | null;
      errorMessage: string | null;
    } = {
      data: null,
      errorMessage: null,
    };

    if (error?.code === "invalid_credentials") {
      response.errorMessage = "Invalid Credentials";
    } else if (error?.code === "email_not_confirmed") {
      response.errorMessage = "Email not confirmed. Please check your email.";
    } else if (error?.status === 400) {
      response.errorMessage = "Something went wrong. Please try again.";
    }

    if (data) response.data = data.user ?? null;
    return response;
  } catch (err) {
    return { data: null, errorMessage: "An unexpected error occurred." };
  }
};

export const signInWithGithub = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `http://localhost:3000/api/v1/auth/github`,
      },
    });
    console.log("ok")
    if (error) {
      console.log("error == ", error)
      throw error;
    }

    if (data.url) {
      redirect(data.url);
    }
  } catch (err) {
    console.error("GitHub Sign-in Error:", err);
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error("Sign-out Error:", err);
  }
};
