import React, { createContext, useContext } from "react";
import {
  useWanderConnect,
  type UserDetails,
  type WalletInfo,
} from "@/hooks/useWanderConnect";
import { WanderConnect } from "@wanderapp/connect";
import type { PermissionType } from "arconnect";

interface WanderConnectContextType {
  isDev: boolean;
  wander: WanderConnect | undefined;
  wallet: typeof window.arweaveWallet | undefined;
  userDetails: UserDetails;
  walletInfo: WalletInfo;
  isAuthenticated: boolean;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WanderConnectContext = createContext<
  WanderConnectContextType | undefined
>(undefined);

export const WanderConnectProvider = ({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions?: PermissionType[];
}) => {
  const wanderConnectData = useWanderConnect({ permissions });

  return (
    <WanderConnectContext.Provider value={wanderConnectData}>
      {children}
    </WanderConnectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWanderConnectContext = () => {
  const context = useContext(WanderConnectContext);
  if (context === undefined) {
    throw new Error(
      "useWanderConnectContext must be used within a WanderConnectProvider"
    );
  }
  return context;
};
