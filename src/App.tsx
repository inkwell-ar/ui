import { useEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import { Button } from "./components/ui/button";
import { arSvgie } from "@7i7o/arsvgies";
import { useWanderConnectContext } from "./components/WanderConnectProvider";
import type { PermissionType } from "arconnect";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Loader2, User2 } from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Separator } from "./components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";

// const ALL_PERMISSIONS: PermissionType[] = [
//   "ACCESS_ADDRESS",
//   "ACCESS_PUBLIC_KEY",
//   "ACCESS_ALL_ADDRESSES",
//   "SIGN_TRANSACTION",
//   "ENCRYPT",
//   "DECRYPT",
//   "SIGNATURE",
//   "ACCESS_ARWEAVE_CONFIG",
//   "DISPATCH",
//   "ACCESS_TOKENS",
// ];
const REQUIRED_PERMISSIONS: PermissionType[] = [
  "ACCESS_ADDRESS",
  "ACCESS_PUBLIC_KEY",
  "ACCESS_TOKENS",
];

const PROCESS_ID_7I7O = "n2DbyGJVMMyZuDt8zDTS5QCfo4j1TRRsCEU9oj0uJ8M";
function App() {
  //   const { wander, wallet, userDetails, walletInfo } = useWanderConnectContext();
  const { wander, wallet, userDetails } = useWanderConnectContext();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [svgieImg, setSvgieImg] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (!wallet) return;
    const getPermissions = async () => {
      const permissions = await wallet?.getPermissions();
      setPermissions(permissions ? permissions : []);
    };
    getPermissions();
  }, [wallet]);

  useEffect(() => {
    if (!isConnected) setAddress("");
    else {
      const getAddress = async () => {
        const addr = await wallet?.getActiveAddress();
        setAddress(addr || "");
      };
      const getBalance = async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const bal = await wallet?.tokenBalance(PROCESS_ID_7I7O);
        setBalance(bal || "");
      };
      getAddress();
      getBalance();
    }
  }, [isConnected]);

  useEffect(() => {
    if (!address) {
      setSvgieImg("");
      return;
    }
    const getSvgie = async () => {
      const img = await arSvgie(address, { asDataURI: true });
      setSvgieImg(img ? img : "");
    };
    getSvgie();
  }, [address]);
  useEffect(() => {
    if (!permissions) {
      setIsConnected(false);
      return;
    }

    if (REQUIRED_PERMISSIONS.every((perm) => permissions.includes(perm)))
      setIsConnected(true);
    else setIsConnected(false);
  }, [permissions]);

  const handleConnect = async () => {
    try {
      await wallet?.connect(REQUIRED_PERMISSIONS);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const handledisconnect = async () => {
    await wallet?.disconnect();
    setIsConnected(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
        {/* <div className="flex flex-col w-full h-screen justify-center items-center">
          {wander && (
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:cursor-pointer"
              onClick={() => wander.open()}
            >
              <Avatar className="h-8 w-8">
                {userDetails?.picture ? (
                  <AvatarImage src={userDetails?.picture}></AvatarImage>
                ) : (
                  svgieImg && <AvatarImage src={svgieImg}></AvatarImage>
                )}
                <AvatarFallback
                  title={`${address.slice(0, 3)}...${address.slice(-3)}`}
                >
                  {!address ? (
                    <Loader2
                      width="1em"
                      height="1em"
                      className="w-10 h-10 animate-spin"
                    />
                  ) : (
                    <User2 className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
          {wallet && !isConnected ? (
            <Button onClick={handleConnect}>Connect</Button>
          ) : (
            <Button onClick={handledisconnect}>Disconnect</Button>
          )}
          <ThemeToggle></ThemeToggle>
          {address && <>7i7o Balance: {balance}</>}
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
