"use client";

import React, { useEffect, useState } from "react";
// @ts-ignore
import {getSession,SessionProvider,SessionProviderProps} from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/authOptions";

interface AuthProviderProps extends SessionProviderProps {
  children: React.ReactNode;
  session: any;
}
// @ts-ignore
const AuthProvider: React.FC<AuthProviderProps> = ({ children, session }) => {
  console.log("AuthProvider actual session", session);
  const [currentSession, setCurrentSession] = useState<UserSession>(
    session as UserSession
  );

  useEffect(() => {
    const getCurrentSession = async () => {
      const updSession = (await getSession()) as UserSession;
      setCurrentSession(updSession);
    };
    if (!currentSession?.user?._id) getCurrentSession();
  }, [currentSession, session]);

  console.log("AuthProvider", currentSession, session);

  return (
    <SessionProvider
      session={currentSession}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
      
    >
      {children}
    </SessionProvider>
  );
};

export default AuthProvider;
