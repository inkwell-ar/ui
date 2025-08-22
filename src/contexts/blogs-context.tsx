// import { SELECTED_BLOG_STORAGE_KEY } from "@/lib/constants";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useWCContext } from "./wc-context";
import { BlogRegistrySDK, type BlogPermission } from "@inkwell.ar/sdk";
// import { registry } from "@/lib/utils";

type BlogsContextType = {
  blogs: BlogPermission[];
  //   setSelectedBlog: React.Dispatch<React.SetStateAction<string>>;
  //   selectedBlog: string;
};

type BlogsContextProviderProps = PropsWithChildren;

// eslint-disable-next-line react-refresh/only-export-components
export const BlogsContext = createContext<BlogsContextType | undefined>(
  undefined
);

export const BlogsContextProvider = ({
  children,
}: BlogsContextProviderProps) => {
  const { walletAddress = "" } = useWCContext();
  const [blogs, setBlogs] = useState<BlogPermission[]>([]);
  //   const [selectedBlog, setSelectedBlog] = useState<string>("");

  //   // Effect to update localStorage
  //   useEffect(() => {
  //     // Save to localStorage
  //     localStorage.setItem(
  //       `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`,
  //       selectedBlog
  //     );
  //   }, [selectedBlog, walletAddress]);

  // Effect to update blogs & selectedBlog based on wallet selected
  useEffect(() => {
    if (!walletAddress) {
      //   setSelectedBlog("");
      setBlogs([]);
      return;
    }

    const updateBlogs = async () => {
      console.log("Fetching all blogs for wallet");
      const registry = new BlogRegistrySDK();
      const walletBlogs = await registry.getWalletBlogs(walletAddress);
      console.log("Wallet's blogs: ", walletBlogs);
      setBlogs(walletBlogs);
    };

    // Get saved Selected Blog from localStorage
    updateBlogs();
    // const savedSelectedBlog = localStorage.getItem(
    //   `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`
    // );
    // setSelectedBlog(savedSelectedBlog || "");
  }, [walletAddress]);

  return (
    <BlogsContext.Provider
      value={{
        blogs,
        // selectedBlog,
        // setSelectedBlog,
      }}
    >
      {children}
    </BlogsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBlogsContext = () => {
  const context = useContext(BlogsContext);

  if (!context) {
    throw new Error(
      "useBlogsContext must be used within a BlogsContextProvider"
    );
  }

  return context;
};
