"use client"
import { Session } from "next-auth";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

const AuthContext = createContext<Session | null>(null);

export const useAuth = () => {
  return useContext<Session>(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json() as Session;
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Can't get session:", error);
        setSession(null);
      }
    };

    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ ...session }}>
      {children}
    </AuthContext.Provider>
  );
};
