"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { isFirebaseConfigured, getFirebaseConfigErrorMessage } from "@/lib/firebase-env";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  configured: boolean;
  configError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();
  const configError = configured ? null : getFirebaseConfigErrorMessage();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      setPersistence(auth, browserLocalPersistence).catch(console.error);

      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        },
        (error) => {
          console.error("Firebase Auth error:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase init error:", error);
      setLoading(false);
    }
  }, [configured]);

  const ensureAuth = () => {
    if (!configured) {
      throw new Error(configError ?? "Configuration Firebase manquante.");
    }
  };

  const login = async (email: string, password: string) => {
    ensureAuth();
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const register = async (email: string, password: string) => {
    ensureAuth();
    await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const logout = async () => {
    ensureAuth();
    await signOut(getFirebaseAuth());
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, configured, configError, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
