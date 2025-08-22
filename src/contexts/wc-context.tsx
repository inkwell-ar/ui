import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  WanderConnect,
  type AuthInfo,
  type AuthProviderType,
  type BackupInfo,
} from "@wanderapp/connect";
import type { PermissionType } from "arconnect";
import { useEnvContext } from "./env-context";
import { useThemeContext } from "./theme-context";
import { DEFAULT_CLIENT_ID } from "@/lib/constants";

type AuthType = AuthProviderType | "NATIVE_WALLET" | "";

export type UserDetails = {
  name: string;
  email: string;
  picture: string;
  authProvider: AuthType;
};

type WCContextProviderProps = PropsWithChildren<{
  clientId?: string;
  isButtonVisible?: boolean;
  permissions?: PermissionType[];
}>;

type WCContextType = {
  isLoadingWander: boolean;
  isAuthenticated: boolean;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  wander?: WanderConnect;
  wallet?: typeof window.arweaveWallet;
  userDetails: UserDetails;
  backupInfo: BackupInfo;
  walletAddress: string;
};

// Helpers
function translateUserDetails(authInfo?: AuthInfo): UserDetails {
  const { userDetails, authType } = authInfo || {};
  return {
    name:
      userDetails?.name || userDetails?.fullName || userDetails?.username || "",
    email: userDetails?.email || "",
    picture: userDetails?.picture || "",
    authProvider: authType || "",
  };
}

const emptyUserDetails = translateUserDetails();

// eslint-disable-next-line react-refresh/only-export-components
export const WCContext = createContext<WCContextType | undefined>(undefined);

export const WCContextProvider = ({
  children,
  clientId = DEFAULT_CLIENT_ID,
  isButtonVisible = false,
  permissions = ["ACCESS_ADDRESS"],
}: WCContextProviderProps) => {
  const [wander, setWander] = useState<WanderConnect | undefined>();
  const [wallet, setWallet] = useState<typeof window.arweaveWallet>();
  const [autoConnect, setAutoConnect] = useState(false);
  const [isLoadingWander, setIsLoadingWander] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [grantedPermissions, setGrantedPermissions] = useState<
    PermissionType[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(emptyUserDetails);
  const [backupInfo, setBackupInfo] = useState<BackupInfo>({
    backupsNeeded: 0,
  });
  const [walletAddress, setWalletAddress] = useState("");
  const { baseURL, baseServerURL } = useEnvContext();
  const { theme } = useThemeContext();

  // WC Event Handlers
  const handleOnAuth = useCallback((authInfo: AuthInfo) => {
    console.log("onAuth = ", authInfo);
    const { authStatus, userDetails } = authInfo;
    setIsAuthenticated(authStatus === "authenticated");
    if (authStatus !== "authenticated" || !userDetails) {
      setIsConnected(false);
      setBackupInfo({ backupsNeeded: 0 });
    }
    if (authStatus === "authenticated" || authStatus === "not-authenticated")
      setIsLoadingWander(false);
    else setIsLoadingWander(true);
    setUserDetails(translateUserDetails(authInfo));
  }, []);

  useEffect(() => {
    if (!baseURL || !baseServerURL) {
      console.error("Incorrect environment!");
      console.log("baseURL: ", baseURL);
      console.log("baseServerURL: ", baseServerURL);
      return;
    }

    const wanderInstance = new WanderConnect({
      clientId,
      baseURL,
      baseServerURL,
      theme: theme,
      button: isButtonVisible,
      iframe: {
        routeLayout: {
          default: "popup", // Account
          settings: "popup", // ??
          auth: "modal", // ??
          "auth-request": "modal", // Connect / Sign In / Sign request?
          account: "modal", // Backup Wallet
        },
      },
      onAuth: handleOnAuth,
      onBackup: setBackupInfo,
    });

    setWander(wanderInstance);
    // For easier development / testing of WanderConnect-specific features (e.g. theming) from the Console:
    // window.wanderInstance = wanderInstance;

    return () => {
      wanderInstance.destroy();
    };
  }, [baseURL, baseServerURL]);

  useEffect(() => {
    const walletListener = () => {
      console.log(
        "walletListener was called for ",
        window.arweaveWallet.walletName
      );

      setWallet(window.arweaveWallet);
    };
    window.addEventListener("arweaveWalletLoaded", walletListener);

    return () => {
      window.removeEventListener("arweaveWalletLoaded", walletListener);
    };
  }, []);

  useEffect(() => {
    console.log("theme useEffect called: ");
    console.log(" > theme: ", theme);
    console.log(" > wander: ", wander);
    if (!theme || !wander) return;
    wander.setTheme(theme);
    // wander.setButtonTheme(theme);
    // wander.setIframeTheme(theme);
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
    if (!wallet || wallet.walletName !== "Wander Connect") return;

    getPermissions();
  }, [wallet]);

  useEffect(() => {
    if (!grantedPermissions) {
      setIsConnected(false);
      return;
    }
    if (
      permissions.every((permission) => grantedPermissions.includes(permission))
    ) {
      setIsConnected(true);
      updateWalletAddress();
    } else setIsConnected(false);
  }, [grantedPermissions, permissions]);

  function connectWallet() {
    wallet
      ?.connect(permissions)
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

  const updateWalletAddress = async () => {
    const addr = await wallet?.getActiveAddress();
    setWalletAddress(addr || "");
  };

  return (
    <WCContext.Provider
      value={{
        isLoadingWander,
        isAuthenticated,
        isConnected,
        connect,
        disconnect,
        wander,
        wallet,
        userDetails,
        backupInfo,
        walletAddress,
      }}
    >
      {children}
    </WCContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWCContext = () => {
  const context = useContext(WCContext);
  if (context === undefined) {
    throw new Error("useWCContext must be used within a WCContextProvider");
  }
  return context;
};
