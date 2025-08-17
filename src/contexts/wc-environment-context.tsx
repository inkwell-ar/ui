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

type Environment = "prod" | "dev";

type WCEnvironmentContextType = {
  environment: Environment;
  setEnvironment: React.Dispatch<React.SetStateAction<Environment>>;
  toggleEnvironment: () => void;
  baseURL: string;
  baseServerURL: string;
};

type WCEnvironmentContextProviderProps = PropsWithChildren;

// eslint-disable-next-line react-refresh/only-export-components
export const WCEnvironmentContext = createContext<
  WCEnvironmentContextType | undefined
>(undefined);

export const WCEnvironmentContextProvider = ({
  children,
}: WCEnvironmentContextProviderProps) => {
  const [baseURL, setBaseURL] = useState(() => {
    // Initialize from localStorage
    const savedEnvironment = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return savedEnvironment === "dev" ? DEV_BASE_URL : DEFAULT_BASE_URL;
  });
  const [baseServerURL, setBaseServerURL] = useState(() => {
    // Initialize from localStorage
    const savedEnvironment = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return savedEnvironment === "dev"
      ? DEV_SERVER_BASE_URL
      : DEFAULT_SERVER_BASE_URL;
  });
  const [environment, setEnvironment] = useState<Environment>(() => {
    // Initialize from localStorage
    const savedEnvironment = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    return (savedEnvironment as Environment) || "prod";
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
    <WCEnvironmentContext.Provider
      value={{
        environment,
        toggleEnvironment,
        setEnvironment,
        baseURL,
        baseServerURL,
      }}
    >
      {children}
    </WCEnvironmentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWCEnvironmentContext = () => {
  const context = useContext(WCEnvironmentContext);

  if (!context) {
    throw new Error(
      "useWCEnvironmentContext must be used within a WCEnvironmentProvider"
    );
  }

  return context;
};
