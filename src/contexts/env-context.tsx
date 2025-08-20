import {
  DEFAULT_BASE_URL,
  DEFAULT_SERVER_BASE_URL,
  DEV_BASE_URL,
  DEV_SERVER_BASE_URL,
  ENVIRONMENT_STORAGE_KEY,
} from "@/lib/constants";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type Env = "prod" | "dev";

type EnvContextType = {
  environment: Env;
  setEnvironment: React.Dispatch<React.SetStateAction<Env>>;
  toggleEnvironment: () => void;
  baseURL: string;
  baseServerURL: string;
};

type EnvContextProviderProps = PropsWithChildren<{ env?: Env }>;

// eslint-disable-next-line react-refresh/only-export-components
export const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvContextProvider = ({
  env,
  children,
}: EnvContextProviderProps) => {
  const [baseURL, setBaseURL] = useState(() => {
    // Initialize from localStorage if no env was passed as param
    const savedEnvironment =
      env || localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return savedEnvironment === "dev" ? DEV_BASE_URL : DEFAULT_BASE_URL;
  });
  const [baseServerURL, setBaseServerURL] = useState(() => {
    // Initialize from localStorage is no env was passed as param
    const savedEnvironment =
      env || localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return savedEnvironment === "dev"
      ? DEV_SERVER_BASE_URL
      : DEFAULT_SERVER_BASE_URL;
  });
  const [environment, setEnvironment] = useState<Env>(() => {
    if (env) {
      // Also save to localStorage
      localStorage.setItem(ENVIRONMENT_STORAGE_KEY, env);
      return env;
    }

    // Initialize from localStorage if no env was passed as param
    const savedEnvironment = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return (savedEnvironment as Env) || "prod";
  });

  // Toggle between environments
  const toggleEnvironment = () => {
    setEnvironment((prevEnvironment) =>
      prevEnvironment === "prod" ? "dev" : "prod"
    );
  };

  // Effect to update URLs and persist changes in localStorage
  useEffect(() => {
    if (environment === "dev") {
      setBaseURL(DEV_BASE_URL);
      setBaseServerURL(DEV_SERVER_BASE_URL);
    } else {
      setBaseURL(DEFAULT_BASE_URL);
      setBaseServerURL(DEFAULT_SERVER_BASE_URL);
    }

    // Also save to localStorage
    localStorage.setItem(ENVIRONMENT_STORAGE_KEY, environment);
  }, [environment]);

  return (
    <EnvContext.Provider
      value={{
        environment,
        toggleEnvironment,
        setEnvironment,
        baseURL,
        baseServerURL,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEnvContext = () => {
  const context = useContext(EnvContext);

  if (!context) {
    throw new Error("useEnvContext must be used within a EnvProvider");
  }

  return context;
};
