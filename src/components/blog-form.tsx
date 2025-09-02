import { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { isArweaveTxId, isValidUrl, getImageSource } from '@/lib/utils';

export interface BlogFormData {
    title: string;
    description: string;
    logo: string;
}

interface BlogFormProps {
    initialData?: BlogFormData;
    onChange: (data: BlogFormData) => void;
    onValidationChange?: (isValid: boolean) => void;
}

export default function BlogForm({
    initialData,
    onChange,
    onValidationChange,
}: BlogFormProps) {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        description: '',
        logo: '',
        ...initialData,
    });

    const [isInitialized, setIsInitialized] = useState(false);

    // Use refs to store latest callbacks
    const onChangeRef = useRef(onChange);
    const onValidationChangeRef = useRef(onValidationChange);
    onChangeRef.current = onChange;
    onValidationChangeRef.current = onValidationChange;

    // Update form when initial data changes
    useEffect(() => {
        if (isInitialized) return;

        setIsInitialized(true);
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                logo: initialData.logo || '',
            });
        }
    }, [initialData, isInitialized]);

    // Notify parent of changes (using ref to avoid dependency on onChange)
    useEffect(() => {
        onChangeRef.current(formData);
    }, [formData]);

    // Validation
    const isValid = useMemo(() => {
        const hasTitle = formData.title.trim().length > 0;
        const hasDescription = formData.description.trim().length > 0;
        const hasValidLogo =
            !formData.logo ||
            isArweaveTxId(formData.logo) ||
            isValidUrl(formData.logo);

        return hasTitle && hasDescription && hasValidLogo;
    }, [formData]);

    useEffect(() => {
        onValidationChangeRef.current?.(isValid);
    }, [isValid]);

    const handleInputChange = (field: keyof BlogFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const logoSrc = useMemo(
        () => getImageSource(formData.logo),
        [formData.logo]
    );

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                handleInputChange('title', e.target.value)
                            }
                            placeholder="Blog title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange('description', e.target.value)
                            }
                            placeholder="Blog description"
                            rows={4}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Logo Upload */}
                    <FileUpload
                        label="Logo (optional)"
                        value={formData.logo}
                        onChange={(value) => handleInputChange('logo', value)}
                        showPreview={false}
                    />

                    {/* Logo Validation */}
                    {formData.logo && (
                        <div>
                            <Label>Logo Validation</Label>
                            <div className="mt-2 space-y-1 text-sm">
                                <p
                                    className={
                                        isArweaveTxId(formData.logo) ||
                                        isValidUrl(formData.logo)
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    <span className="font-medium">Status:</span>{' '}
                                    {isArweaveTxId(formData.logo)
                                        ? '✓ Valid Arweave Transaction'
                                        : isValidUrl(formData.logo)
                                          ? '✓ Valid URL'
                                          : '✗ Invalid format'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Blog Preview */}
            <div>
                <Label>Preview</Label>
                <div className="mt-2 rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                        {logoSrc && (
                            <img
                                src={logoSrc}
                                alt="Logo preview"
                                className="size-16 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold">
                                {formData.title || 'Untitled Blog'}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {formData.description || 'No description'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
