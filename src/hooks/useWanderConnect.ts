import { useThemeContext } from "@/contexts/theme-context";
import type {
  AuthInfo,
  AuthProviderType,
  BackupInfo,
} from "@wanderapp/connect";
import { WanderConnect } from "@wanderapp/connect";
import type { PermissionType } from "arconnect";
import { useState, useEffect, useCallback, useMemo } from "react";

type Environment = "prod" | "dev";

type AuthType = AuthProviderType | "NATIVE_WALLET" | "";

export interface UserDetails {
  name: string;
  email: string;
  picture: string;
  authProvider: AuthType;
}

export interface WalletInfo {
  walletAlias?: string;
  walletAddress?: string;
  walletCount?: number;
  walletPermissions?: string[];
  walletReady?: boolean;
  walletBackupMessage?: string | undefined;
}

const emptyUserDetails: UserDetails = {
  name: "",
  email: "",
  picture: "",
  authProvider: "",
};

const ENVIRONMENT_STORAGE_KEY = "wander-connect-environment";

const DEFAULT_BASE_URL = "https://connect.wander.app";
const DEFAULT_SERVER_BASE_URL = "https://connect-api.wander.app";
const DEV_BASE_URL = "https://connect.wander.app";
const DEV_SERVER_BASE_URL = "https://connect-api.wander.app";

export function useWanderConnect(props?: {
  isButtonVisible?: boolean;
  permissions?: PermissionType[];
}) {
  const isButtonVisible = props?.isButtonVisible || false;
  const required_permissions = useMemo(
    () => props?.permissions || ["ACCESS_ADDRESS" as PermissionType],
    [props?.permissions]
  );
  const [wander, setWander] = useState<WanderConnect | undefined>();
  const [wallet, setWallet] = useState<typeof window.arweaveWallet>();
  const [autoConnect, setAutoConnect] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [grantedPermissions, setGrantedPermissions] = useState<
    PermissionType[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(emptyUserDetails);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    walletAlias: "",
    walletAddress: "",
    walletCount: 0,
    walletPermissions: [],
    walletReady: false,
    walletBackupMessage: undefined,
  });
  const [baseURL, setBaseURL] = useState<string>(DEFAULT_BASE_URL);
  const [baseServerURL, setBaseServerURL] = useState<string>(
    DEFAULT_SERVER_BASE_URL
  );
  const [environment, setEnvironment] = useState<Environment>(() => {
    // Get environment from localStorage or default to 'prod'
    const savedEnvironment = localStorage.getItem(
      ENVIRONMENT_STORAGE_KEY
    ) as Environment;
    return savedEnvironment || "prod";
  });
  const { theme } = useThemeContext();

  const handleOnAuth = useCallback((authInfo: AuthInfo) => {
    console.log("onAuth =", authInfo);
    const { authType, authStatus, userDetails } = authInfo;
    console.log(authStatus === "authenticated");

    setIsAuthenticated(authStatus === "authenticated");
    if (!userDetails || authStatus !== "authenticated") {
      setWalletInfo({});
      setIsConnected(false);
    }

    setUserDetails({
      name:
        userDetails?.name ||
        userDetails?.fullName ||
        userDetails?.username ||
        "",
      email: userDetails?.email || "",
      picture: userDetails?.picture || "",
      authProvider: authType || "",
    });
  }, []);

  const handleOnBackup = useCallback(({ backupMessage }: BackupInfo) => {
    setWalletInfo((...prevWalletInfo) => ({
      ...prevWalletInfo,
      walletBackupMessage: backupMessage || "",
    }));
  }, []);

  useEffect(() => {
    if (wander) wander.destroy();

    // Change urls whenever environment it changes
    const baseURLstring =
      environment === "prod" ? DEFAULT_BASE_URL : DEV_BASE_URL;
    const baseServerURLstring =
      environment === "prod" ? DEFAULT_SERVER_BASE_URL : DEV_SERVER_BASE_URL;
    setBaseURL(baseURLstring);
    setBaseServerURL(baseServerURLstring);

    const wanderInstance = new WanderConnect({
      clientId: "FREE_TRIAL",
      baseURL: baseURLstring,
      baseServerURL: baseServerURLstring,
      //   theme: theme,
      button: isButtonVisible,
      onAuth: handleOnAuth,
      onBackup: handleOnBackup,
    });

    wanderInstance.setTheme(theme);

    setWander(wanderInstance);
    // For easier development / testing of WanderConnect-specific features (e.g. theming) from the Console:
    // window.wanderInstance = wanderInstance;

    return () => {
      wanderInstance.destroy();
    };
  }, [environment]);

  useEffect(() => {
    const walletListener = () => {
      console.log("walletListener was called");

      if (window.arweaveWallet.walletName === "Wander Connect") {
        setWallet(window.arweaveWallet);
        getPermissions();
      }
    };
    window.addEventListener("arweaveWalletLoaded", walletListener);

    return () => {
      window.removeEventListener("arweaveWalletLoaded", walletListener);
    };
  }, []);

  useEffect(() => {
    console.log(`theme useEffect: ${theme} - ${wander}`);
    if (!theme || !wander) return;
    wander.setTheme(theme);
  }, [theme, wander]);

  useEffect(() => {
    console.log("isAuthenticated useEffect");

    if (!isAuthenticated) return;

    if (autoConnect) {
      connectWallet();
      setAutoConnect(false);
      wander?.close();
    }
  }, [isAuthenticated]);

  const getPermissions = async () => {
    if (!wallet) {
      setGrantedPermissions([]);
      return;
    }
    wallet
      .getPermissions()
      .then((granted_permissions) => {
        setGrantedPermissions(granted_permissions);
      })
      .catch(console.log);
  };

  useEffect(() => {
    console.log("wallet useEffect");
    if (!wallet) return;

    getPermissions();
  }, [wallet]);

  useEffect(() => {
    if (!grantedPermissions) {
      setIsConnected(false);
      return;
    }
    if (
      required_permissions.every((permission) =>
        grantedPermissions.includes(permission)
      )
    )
      setIsConnected(true);
    else setIsConnected(false);
  }, [grantedPermissions, required_permissions]);

  const toggleEnvironment = () => {
    setEnvironment((prev) => (prev === "dev" ? "prod" : "dev"));
  };

  function connectWallet() {
    wallet
      ?.connect(required_permissions)
      .then(() => getPermissions())
      .catch(() => setGrantedPermissions([]));
  }

  const connect = () => {
    if (!isAuthenticated) {
      setAutoConnect(true);
      wander?.open();
      return;
    }
    connectWallet();
  };
  const disconnect = () => {
    wallet?.disconnect();
    setGrantedPermissions([]);
  };

  return {
    environment,
    setEnvironment,
    toggleEnvironment,
    isDev: environment === "dev",
    baseURL,
    baseServerURL,
    wander,
    wallet,
    userDetails,
    walletInfo,
    isAuthenticated,
    isConnected,
    connect,
    disconnect,
  };
}
