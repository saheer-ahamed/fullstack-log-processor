"use server";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { User } from "@supabase/supabase-js";

export const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/dashboard",
    },
  });

  console.log("data ", data.user);
  console.log("error ", error);

  let response: {
    data: User | null;
    errorMessage: string | null;
  } = {
    data: null,
    errorMessage: null,
  };

  if (error) response.errorMessage = error.message;
  if (data) response.data = data.user ?? null;

  return response;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  let response: {
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
};

export const signInWithGithub = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `http://localhost:3000/auth/v1/github`,
    },
  });
  if (error) throw error;
  if (data.url) {
    console.log(data.url);
    redirect(data.url) // use the redirect API for your server framework
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
