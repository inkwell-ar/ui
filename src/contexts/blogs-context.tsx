import {
    CUSTOM_CU_URL,
    emptyBlogData,
    SELECTED_BLOG_STORAGE_KEY,
} from '@/lib/constants';
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    type PropsWithChildren,
} from 'react';
import { useWCContext } from './wc-context';
import {
    BlogRegistrySDK,
    InkwellBlogSDK,
    type BlogInfo,
    type BlogPermission,
} from '@inkwell.ar/sdk';
import { connect } from '@permaweb/aoconnect';

export type BlogData = {
    id: string;
    title: string;
    description: string;
    logo: string;
};

export type BlogWallet = {
    wallet: string;
    roles: string[];
};

type BlogsContextType = {
    isLoading: boolean;
    isLoadingBlogDetails: boolean;
    isLoadingBlogWallets: boolean;
    blogs: BlogPermission[];
    blogsData: BlogData[];
    blogWallets: BlogWallet[];
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
    const { walletAddress = '', isConnected, isAuthenticated } = useWCContext();

    // Memoize aoconnect - only create if needed, for custom CU
    const aoconnect = useMemo(() => {
        if (!CUSTOM_CU_URL) return null;
        console.log('Using CUSTOM CU URL from .env');

        return connect({ MODE: 'legacy', CU_URL: CUSTOM_CU_URL || undefined });
    }, []);

    // Memoize registry - only recreate if needed
    const registry = useMemo(() => new BlogRegistrySDK(aoconnect), [aoconnect]);

    const [blogs, setBlogs] = useState<BlogPermission[]>([]);
    const [blogsData, setBlogsData] = useState<BlogData[]>([]);
    const [blogWallets, setBlogWallets] = useState<BlogWallet[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBlogDetails, setIsLoadingBlogDetails] = useState(false);
    const [isLoadingBlogWallets, setIsLoadingBlogWallets] = useState(false);

    // Memoize the reset function to prevent unnecessary re-renders
    const resetState = useCallback(() => {
        setBlogs([]);
        setBlogsData([]);
        setBlogWallets([]);
        setSelectedBlog('');
        setIsLoading(false);
        setIsLoadingBlogDetails(false);
        setIsLoadingBlogWallets(false);
        setIsAdmin(false);
        setIsEditor(false);
    }, []);

    // Memoize role updates
    const updateRoles = useCallback(() => {
        if (!selectedBlog || selectedBlog === emptyBlogData.id) {
            setIsAdmin(false);
            setIsEditor(false);
            return;
        }

        // Find the selected blog permission more efficiently
        const blogPermission = blogs.find((bp) => bp.blog_id === selectedBlog);
        if (blogPermission) {
            setIsAdmin(blogPermission.roles.includes('DEFAULT_ADMIN_ROLE'));
            setIsEditor(blogPermission.roles.includes('EDITOR_ROLE'));
        }
    }, [selectedBlog, blogs]);

    // Fetch blog wallets for the selected blog
    const updateBlogWallets = useCallback(async () => {
        if (!selectedBlog || selectedBlog === emptyBlogData.id) {
            setBlogWallets([]);
            return;
        }

        setIsLoadingBlogWallets(true);
        try {
            console.log('Fetching blog wallets for blog:', selectedBlog);
            const wallets = await registry.getBlogWallets(selectedBlog);
            console.log('Fetched blog wallets:', wallets);
            setBlogWallets(wallets || []);
        } catch (error) {
            console.error('Failed to fetch blog wallets:', error);
            setBlogWallets([]);
        } finally {
            setIsLoadingBlogWallets(false);
        }
    }, [selectedBlog, registry]);

    // Initialize selectedBlog from localStorage (only once)
    useEffect(() => {
        if (walletAddress) {
            const savedSelectedBlog = localStorage.getItem(
                `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`
            );
            setSelectedBlog(savedSelectedBlog || emptyBlogData.id);
        }
    }, [walletAddress]);

    // Save selectedBlog to localStorage and update roles
    useEffect(() => {
        if (walletAddress && selectedBlog) {
            localStorage.setItem(
                `${SELECTED_BLOG_STORAGE_KEY}-${walletAddress}`,
                selectedBlog
            );
        }
        updateRoles();
        updateBlogWallets();
    }, [selectedBlog, walletAddress, updateRoles, updateBlogWallets]);

    // Fetch blogs when wallet changes
    useEffect(() => {
        if (!walletAddress || !isConnected || !isAuthenticated) {
            resetState();
            return;
        }

        let isMounted = true; // Prevent state updates if component unmounts

        const updateBlogs = async () => {
            setIsLoading(true);
            try {
                console.log('Fetching all blogs for wallet ', walletAddress);
                const walletBlogs =
                    await registry.getWalletBlogs(walletAddress);
                console.log('Fetched blogs: ', walletBlogs);

                if (isMounted) {
                    setBlogs(walletBlogs);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        updateBlogs();

        return () => {
            isMounted = false;
        };
    }, [walletAddress, isConnected, isAuthenticated, registry, resetState]);

    // Memoize blog data processing - only recalculate when blogs change
    const processedBlogsData = useMemo(() => {
        return blogs.map((blogPermission) => ({
            id: blogPermission.blog_id,
            title: blogPermission.blog_id,
            logo: '',
            description: JSON.stringify(blogPermission.roles),
        }));
    }, [blogs]);

    // Fetch detailed blog information
    useEffect(() => {
        if (blogs.length === 0) {
            setBlogsData([]);
            return;
        }

        let isMounted = true;

        const updateBlogsData = async () => {
            setIsLoadingBlogDetails(true);
            const newBlogsData = [...processedBlogsData]; // Start with processed data

            try {
                // Use Promise.allSettled for better error handling and parallel processing
                const blogInfoPromises = blogs.map(
                    async (blogPermission, index) => {
                        try {
                            const blog = new InkwellBlogSDK({
                                aoconnect: aoconnect,
                                processId: blogPermission.blog_id,
                            });
                            const blogInfo = await blog.getInfo();

                            if (blogInfo.success && isMounted) {
                                const blogDetails = blogInfo.data as BlogInfo;
                                return {
                                    index,
                                    title:
                                        blogDetails.blogTitle ||
                                        blogDetails.details.title,
                                    description:
                                        blogDetails.blogDescription ||
                                        blogDetails.details.description,
                                    logo:
                                        blogDetails.blogLogo ||
                                        blogDetails.details.logo,
                                };
                            }
                        } catch (error) {
                            console.log(
                                `Failed to load details for blog ${blogPermission.blog_id}:`,
                                error
                            );
                        }
                        return null;
                    }
                );

                const results = await Promise.allSettled(blogInfoPromises);

                if (isMounted) {
                    results.forEach((result) => {
                        if (result.status === 'fulfilled' && result.value) {
                            const { index, title, description, logo } =
                                result.value;
                            newBlogsData[index] = {
                                ...newBlogsData[index],
                                title,
                                description,
                                logo,
                            };
                        }
                    });

                    setBlogsData(newBlogsData);
                    setIsLoadingBlogDetails(false);
                }
            } catch (error) {
                console.error('Error updating blogs data:', error);
                if (isMounted) {
                    setIsLoadingBlogDetails(false);
                }
            }
        };

        updateBlogsData();

        return () => {
            isMounted = false;
        };
    }, [blogs, processedBlogsData, aoconnect]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            isLoading,
            isLoadingBlogDetails,
            isLoadingBlogWallets,
            blogs,
            blogsData,
            blogWallets,
            selectedBlog,
            setSelectedBlog,
            isAdmin,
            isEditor,
        }),
        [
            isLoading,
            isLoadingBlogDetails,
            isLoadingBlogWallets,
            blogs,
            blogsData,
            blogWallets,
            selectedBlog,
            isAdmin,
            isEditor,
        ]
    );

    return (
        <BlogsContext.Provider value={contextValue}>
            {children}
        </BlogsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBlogsContext = () => {
    const context = useContext(BlogsContext);

    if (!context) {
        throw new Error(
            'useBlogsContext must be used within a BlogsContextProvider'
        );
    }

    return context;
};
