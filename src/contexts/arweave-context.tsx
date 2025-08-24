import {
    createContext,
    useContext,
    useMemo,
    useCallback,
    useState,
    type PropsWithChildren,
} from 'react';
import { useWCContext } from './wc-context';
import Arweave from 'arweave';

export interface UploadResult {
    txId: string;
    status: string;
    statusMsg: string;
    url?: string;
}

export interface UploadProgress {
    isUploading: boolean;
    progress?: number;
    error?: string;
}

type ArweaveContextType = {
    arweave: Arweave;
    uploadFile: (
        file: File,
        tags?: Record<string, string>
    ) => Promise<UploadResult | null>;
    uploadProgress: UploadProgress;
    getArweaveUrl: (txId: string) => string;
    validateFile: (
        file: File,
        options?: FileValidationOptions
    ) => { valid: boolean; error?: string };
};

interface FileValidationOptions {
    maxSize?: number; // in bytes
    allowedTypes?: string[]; // MIME types
    allowedExtensions?: string[];
}

const ArweaveContext = createContext<ArweaveContextType | undefined>(undefined);

export const useArweave = () => {
    const context = useContext(ArweaveContext);
    if (!context) {
        throw new Error(
            'useArweave must be used within an ArweaveContextProvider'
        );
    }
    return context;
};

interface ArweaveContextProviderProps extends PropsWithChildren {}

export const ArweaveContextProvider = ({
    children,
}: ArweaveContextProviderProps) => {
    const { isConnected, wallet } = useWCContext();
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        isUploading: false,
    });

    // Initialize Arweave instance
    const arweave = useMemo(() => {
        return Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
        });
    }, []);

    // Generate Arweave URL from transaction ID
    const getArweaveUrl = useCallback((txId: string): string => {
        return `https://arweave.net/${txId}`;
    }, []);

    // Validate file before upload
    const validateFile = useCallback(
        (
            file: File,
            options: FileValidationOptions = {}
        ): { valid: boolean; error?: string } => {
            const {
                maxSize = 100 * 1024, // 100KB default for subsidized uploads
                allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/svg+xml',
                ],
                allowedExtensions = [
                    '.jpg',
                    '.jpeg',
                    '.png',
                    '.gif',
                    '.webp',
                    '.svg',
                ],
            } = options;

            // Check file size
            if (file.size > maxSize) {
                const sizeInKB = Math.round(maxSize / 1024);
                return {
                    valid: false,
                    error: `File size must be less than ${sizeInKB}KB for subsidized uploads`,
                };
            }

            // Check MIME type
            if (!allowedTypes.includes(file.type)) {
                return {
                    valid: false,
                    error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
                };
            }

            // Check file extension
            const fileExtension =
                '.' + file.name.split('.').pop()?.toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return {
                    valid: false,
                    error: `File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
                };
            }

            return { valid: true };
        },
        []
    );

    // Create transaction with file data and tags
    const createTransaction = useCallback(
        async (file: File, customTags: Record<string, string> = {}) => {
            const data = new Uint8Array(await file.arrayBuffer());
            const tx = await arweave.createTransaction({ data });

            // Add default tags
            tx.addTag('Content-Type', file.type);
            tx.addTag('File-Name', file.name);
            tx.addTag('File-Size', file.size.toString());
            tx.addTag('Upload-Timestamp', Date.now().toString());

            // Add custom tags
            Object.entries(customTags).forEach(([key, value]) => {
                tx.addTag(key, value);
            });

            return tx;
        },
        [arweave]
    );

    // Upload file to Arweave
    const uploadFile = useCallback(
        async (
            file: File,
            tags: Record<string, string> = {}
        ): Promise<UploadResult | null> => {
            if (!isConnected) {
                setUploadProgress({
                    isUploading: false,
                    error: 'Wallet not connected',
                });
                return null;
            }

            // Validate file
            const validation = validateFile(file);
            if (!validation.valid) {
                setUploadProgress({
                    isUploading: false,
                    error: validation.error,
                });
                return null;
            }

            setUploadProgress({ isUploading: true, progress: 0 });

            try {
                // Create transaction
                setUploadProgress({ isUploading: true, progress: 25 });
                const tx = await createTransaction(file, tags);

                if (!wallet) {
                    throw new Error('Wallet not available');
                }

                // Try dispatch first for subsidized uploads, fallback to sign+post
                setUploadProgress({ isUploading: true, progress: 50 });

                try {
                    // Use dispatch for subsidized uploads (< 100KB)
                    const dispatchResult = await wallet.dispatch(tx);

                    setUploadProgress({ isUploading: true, progress: 100 });

                    const result: UploadResult = {
                        txId: dispatchResult.id || tx.id,
                        status: '200',
                        statusMsg: 'ok',
                        url: getArweaveUrl(dispatchResult.id || tx.id),
                    };

                    setUploadProgress({ isUploading: false });
                    return result;
                } catch (dispatchError) {
                    // Fallback to sign + post if dispatch fails
                    console.log(
                        'Dispatch failed, falling back to sign+post:',
                        dispatchError
                    );

                    setUploadProgress({ isUploading: true, progress: 60 });
                    const signedTx = await wallet.sign(tx);

                    setUploadProgress({ isUploading: true, progress: 80 });
                    const postResult =
                        await arweave.transactions.post(signedTx);

                    setUploadProgress({ isUploading: true, progress: 100 });

                    const result: UploadResult = {
                        txId: signedTx.id,
                        status: postResult.status.toString(),
                        statusMsg: postResult.statusText,
                        url: getArweaveUrl(signedTx.id),
                    };

                    setUploadProgress({ isUploading: false });
                    return result;
                }
            } catch (error) {
                console.error('Failed to upload file:', error);
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : 'Unknown upload error';

                setUploadProgress({
                    isUploading: false,
                    error: errorMsg,
                });

                return null;
            }
        },
        [
            isConnected,
            wallet,
            validateFile,
            createTransaction,
            arweave,
            getArweaveUrl,
        ]
    );

    // Memoize context value
    const contextValue = useMemo(
        () => ({
            arweave,
            uploadFile,
            uploadProgress,
            getArweaveUrl,
            validateFile,
        }),
        [arweave, uploadFile, uploadProgress, getArweaveUrl, validateFile]
    );

    return (
        <ArweaveContext.Provider value={contextValue}>
            {children}
        </ArweaveContext.Provider>
    );
};
