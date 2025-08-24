import { useBlogsContext, type BlogData } from '@/contexts/blogs-context';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { isArweaveTxId, isValidUrl, getImageSource } from '@/lib/utils';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogEditor() {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const { blogsData, isLoadingBlogDetails, updateBlogDetails } =
        useBlogsContext();

    const originalBlogData = useMemo(
        () => blogsData.find((blog: BlogData) => blog.id === blogId),
        [blogsData, blogId]
    );

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        logo: '',
    });

    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data when blog data loads
    useEffect(() => {
        if (originalBlogData) {
            setFormData({
                title: originalBlogData.title || '',
                description: originalBlogData.description || '',
                logo: originalBlogData.logo || '',
            });
        }
    }, [originalBlogData]);

    // Check if form has changes
    const hasChanges = useMemo(() => {
        if (!originalBlogData) return false;
        return (
            formData.title !== (originalBlogData.title || '') ||
            formData.description !== (originalBlogData.description || '') ||
            formData.logo !== (originalBlogData.logo || '')
        );
    }, [formData, originalBlogData]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!blogId) return;

        setIsSaving(true);
        try {
            const result = await updateBlogDetails(blogId, formData);

            if (result.success) {
                toast.success('Blog details updated successfully');
                navigate(`/blog/${blogId}/info`);
            } else {
                toast.error(result.error || 'Failed to update blog details');
            }
        } catch (error) {
            console.error('Failed to save blog:', error);
            toast.error('Failed to save blog details');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            setShowDiscardDialog(true);
        } else {
            navigate(`/blog/${blogId}/info`);
        }
    };

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        navigate(`/blog/${blogId}/info`);
    };

    if (isLoadingBlogDetails) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                    Loading blog information...
                </p>
            </div>
        );
    }

    if (!originalBlogData) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Blog not found</p>
            </div>
        );
    }

    const logoSrc = useMemo(
        () => getImageSource(formData.logo),
        [formData.logo]
    );

    return (
        <>
            <div className="container mx-auto max-w-4xl p-6">
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Edit Blog Information
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    <X className="mr-2 size-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!hasChanges || isSaving}
                                >
                                    <Save className="mr-2 size-4" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                        <p className="text-muted-foreground font-mono text-sm">
                            {blogId}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'title',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Blog title"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Blog description"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Logo Upload */}
                                <FileUpload
                                    label="Logo"
                                    value={formData.logo}
                                    onChange={(value) =>
                                        handleInputChange('logo', value)
                                    }
                                    showPreview={false}
                                />

                                {/* Logo Validation */}
                                {formData.logo && (
                                    <div>
                                        <Label>Logo Validation</Label>
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p
                                                className={
                                                    isArweaveTxId(
                                                        formData.logo
                                                    ) ||
                                                    isValidUrl(formData.logo)
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }
                                            >
                                                <span className="font-medium">
                                                    Status:
                                                </span>{' '}
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
                            {/* Blog Preview */}
                            <div className="md:col-span-2">
                                <Label>Preview</Label>
                                <div className="mt-2 rounded-lg border p-4">
                                    <div className="flex items-start gap-4">
                                        {logoSrc && (
                                            <img
                                                src={logoSrc}
                                                alt="Logo preview"
                                                className="size-16 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        )}
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-semibold">
                                                {formData.title ||
                                                    'Untitled Blog'}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {formData.description ||
                                                    'No description'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
                title="Discard changes?"
                description="You have unsaved changes. Are you sure you want to discard them?"
                confirmText="Discard"
                cancelText="Keep editing"
                onConfirm={handleDiscardChanges}
                variant="destructive"
            />
        </>
    );
}
