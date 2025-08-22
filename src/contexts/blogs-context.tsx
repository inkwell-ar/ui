import { emptyBlogData, SELECTED_BLOG_STORAGE_KEY } from "@/lib/constants";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useWCContext } from "./wc-context";
import {
  BlogRegistrySDK,
  InkwellBlogSDK,
  type BlogInfo,
  type BlogPermission,
} from "@inkwell.ar/sdk";

export type BlogData = {
  id: string;
  title: string;
  description: string;
  logo: string;
};

type BlogsContextType = {
  isLoading: boolean;
  isLoadingBlogDetails: boolean;
  blogs: BlogPermission[];
  blogsData: BlogData[];
  setSelectedBlog: React.Dispatch<React.SetStateAction<string>>;
  selectedBlog: string;
  isAdmin: boolean;
  isEditor: boolean;
};

type BlogsContextProviderProps = PropsWithChildren;

// eslint-disable-next-line react-refresh/only-export-components
export const BlogsContext = createContext<BlogsContextType | undefined>(
  undefined
);

export const BlogsContextProvider = ({
  children,
}: BlogsContextProviderProps) => {
  const { walletAddress = "", isConnected, isAuthenticated } = useWCContext();
  const [blogs, setBlogs] = useState<BlogPermission[]>([]);
  const [blogsData, setBlogsData] = useState<BlogData[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<string>(() => {
    // Get Selected Blog from localStorage
    const savedSelectedBlog = localStorage.getItem(
      `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`
    );
    return savedSelectedBlog || emptyBlogData.id;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlogDetails, setIsLoadingBlogDetails] = useState(false);

  const resetState = () => {
    setBlogs([]);
    setBlogsData([]);
    setSelectedBlog("");
    setIsLoading(false);
    setIsLoadingBlogDetails(false);
    setIsAdmin(false);
    setIsEditor(false);
  };

  function updateRoles() {
    if (!selectedBlog || selectedBlog === emptyBlogData.id) {
      setIsAdmin(false);
      setIsEditor(false);
      return;
    }

    // update isAdmin and isEditor for the selectedBlog
    for (let i = 0; i < blogs.length; i++) {
      const blogPermission = blogs[i];
      if (blogPermission.blog_id !== selectedBlog) continue;
      setIsAdmin(blogPermission.roles.includes("DEFAULT_ADMIN_ROLE"));
      setIsEditor(blogPermission.roles.includes("EDITOR_ROLE"));
      break;
    }
  }

  // Effect to update localStorage
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(
      `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`,
      selectedBlog
    );

    updateRoles();
  }, [selectedBlog]);

  // Effect to update blogs & selectedBlog based on wallet selected
  useEffect(() => {
    setIsLoading(true);
    // Reset state if disconnected
    if (!walletAddress || !isConnected || !isAuthenticated) {
      resetState();
      return;
    }

    const updateBlogs = async () => {
      console.log("Fetching all blogs for wallet ", walletAddress);
      const registry = new BlogRegistrySDK();
      const walletBlogs = await registry.getWalletBlogs(walletAddress);
      console.log("Fetched blogs: ", walletBlogs);
      setBlogs(walletBlogs);
      setIsLoading(false);
    };

    updateBlogs();
    // Get saved Selected Blog from localStorage
    const savedSelectedBlog = localStorage.getItem(
      `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`
    );
    setSelectedBlog(savedSelectedBlog || emptyBlogData.id);
  }, [walletAddress, isConnected, isAuthenticated]);

  useEffect(() => {
    const updateBlogsData = async () => {
      setIsLoadingBlogDetails(true);
      const newBlogsData: BlogData[] = blogs.map((blogPermission) => {
        return {
          id: blogPermission.blog_id,
          title: blogPermission.blog_id,
          logo: "",
          description: JSON.stringify(blogPermission.roles),
        };
      });
      for (let i = 0; i < blogs.length; i++) {
        const blogPermission = blogs[i];
        const blog = new InkwellBlogSDK({ processId: blogPermission.blog_id });
        const blogInfo = await blog.getInfo();
        console.log("Blog info fetched: ", blogInfo);

        if (!blogInfo.success) {
          console.log(
            "Failed to load details for blog ",
            blogPermission.blog_id
          );
          continue;
        }
        const blogDetails = blogInfo.data as BlogInfo;
        newBlogsData[i].title =
          blogDetails.blogTitle || blogDetails.details.title;
        newBlogsData[i].description =
          blogDetails.blogDescription || blogDetails.details.description;
        newBlogsData[i].logo = blogDetails.blogLogo || blogDetails.details.logo;
      }
      setBlogsData(newBlogsData);
      setIsLoadingBlogDetails(false);
    };

    updateBlogsData();
    updateRoles();
  }, [blogs]);

  return (
    <BlogsContext.Provider
      value={{
        isLoading,
        isLoadingBlogDetails,
        blogs,
        blogsData,
        selectedBlog,
        setSelectedBlog,
        isAdmin,
        isEditor,
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
