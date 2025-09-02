import { useBlogsContext, type BlogData } from '@/contexts/blogs-context';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import BlogForm, { type BlogFormData } from '@/components/blog-form';
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

    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        description: '',
        logo: '',
    });
    const [isValid, setIsValid] = useState(false);
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

    const handleFormChange = useCallback((data: BlogFormData) => {
        setFormData(data);
    }, []);

    const handleValidationChange = useCallback((valid: boolean) => {
        setIsValid(valid);
    }, []);

    const handleSave = async () => {
        if (!blogId) return;

        setIsSaving(true);
        try {
            const result = await updateBlogDetails(formData);

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
                                    disabled={
                                        !hasChanges || !isValid || isSaving
                                    }
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
                    <CardContent>
                        <BlogForm
                            initialData={
                                originalBlogData
                                    ? {
                                          title: originalBlogData.title || '',
                                          description:
                                              originalBlogData.description ||
                                              '',
                                          logo: originalBlogData.logo || '',
                                      }
                                    : undefined
                            }
                            onChange={handleFormChange}
                            onValidationChange={handleValidationChange}
                        />
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
