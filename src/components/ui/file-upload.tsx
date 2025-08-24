import { useRef, useCallback } from 'react';
import { Input } from './input';
import { Label } from './label';
import { useArweave } from '@/contexts/arweave-context';
import { getImageSource } from '@/lib/utils';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    accept?: string;
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
    showPreview?: boolean;
    showTxLinks?: boolean;
    className?: string;
}

export function FileUpload({
    value = '',
    onChange,
    label = 'Upload File',
    accept = 'image/*',
    maxSize = 100 * 1024, // 100KB for subsidized uploads
    allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    showPreview = true,
    showTxLinks = true,
    className = '',
}: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, uploadProgress, validateFile } = useArweave();

    const handleFileSelect = useCallback(
        async (file: File) => {
            // Validate file
            const validation = validateFile(file, {
                maxSize,
                allowedTypes,
                allowedExtensions,
            });

            if (!validation.valid) {
                toast.error(validation.error);
                return;
            }

            try {
                const result = await uploadFile(file, {
                    Application: 'Inkwell-UI',
                    Type: 'Asset',
                    Usage: 'Logo',
                });

                if (result) {
                    onChange(result.txId);
                    toast.success('File uploaded successfully');
                }
            } catch (error) {
                console.error('Upload failed:', error);
                toast.error('Failed to upload file');
            }
        },
        [
            uploadFile,
            validateFile,
            maxSize,
            allowedTypes,
            allowedExtensions,
            onChange,
        ]
    );

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                handleFileSelect(file);
            }
            // Reset input value
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [handleFileSelect]
    );

    const imageSource = value ? getImageSource(value) : '';

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <Label htmlFor="file-input">
                    {label} (max {Math.round(maxSize / 1024)}KB)
                </Label>
                <Input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept={accept}
                    disabled={uploadProgress.isUploading}
                />
                <p className="text-muted-foreground text-xs">
                    Files under 100KB are subsidized by bundlers
                </p>

                {/* Upload progress */}
                {uploadProgress.isUploading && (
                    <div className="space-y-2">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Upload className="size-4 animate-pulse" />
                            <span>
                                Uploading... {uploadProgress.progress || 0}%
                            </span>
                        </div>
                        <div className="bg-muted h-2 w-full rounded-full">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${uploadProgress.progress || 0}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Upload error */}
                {uploadProgress.error && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="size-4" />
                        <span>{uploadProgress.error}</span>
                    </div>
                )}
            </div>

            {/* Show Tx Links */}
            {showTxLinks && value && (
                <div className="text-muted-foreground text-xs">
                    {'View '}
                    <a
                        target="_blank"
                        href={`https://arweave.net/${value}`}
                        className="underline hover:cursor-pointer"
                    >
                        File in Arweave
                    </a>
                    {' or '}
                    <a
                        target="_blank"
                        href={`https://viewblock.io/arweave/tx/${value}`}
                        className="underline hover:cursor-pointer"
                    >
                        Tx on Viewblock
                    </a>
                </div>
            )}

            {/* Preview */}
            {showPreview && imageSource && (
                <div>
                    <Label>Preview</Label>
                    <div className="mt-2 rounded-lg border p-4">
                        <img
                            src={imageSource}
                            alt="Preview"
                            className="mx-auto max-h-48 max-w-full rounded-lg object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
