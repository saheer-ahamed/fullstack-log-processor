"use client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useState } from "react";

type ContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<ContextType | undefined>(undefined);

const Context = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
