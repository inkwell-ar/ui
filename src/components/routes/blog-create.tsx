import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import BlogForm, { type BlogFormData } from '@/components/blog-form';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        description: '',
        logo: '',
    });
    const [isValid, setIsValid] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Check if form has any data
    const hasData =
        formData.title.trim() !== '' ||
        formData.description.trim() !== '' ||
        formData.logo.trim() !== '';

    const handleFormChange = useCallback((data: BlogFormData) => {
        setFormData(data);
    }, []);

    const handleValidationChange = useCallback((valid: boolean) => {
        setIsValid(valid);
    }, []);

    const handleCreate = async () => {
        if (!isValid) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsCreating(true);
        try {
            // TODO: Implement blog creation logic using SDK
            console.log('Creating blog with data:', formData);

            // For now, just show a placeholder message
            toast.info('Blog creation functionality will be implemented soon');

            // Navigate back to home after creation
            navigate('/');
        } catch (error) {
            console.error('Failed to create blog:', error);
            toast.error('Failed to create blog. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        if (hasData) {
            setShowDiscardDialog(true);
        } else {
            navigate('/');
        }
    };

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        navigate('/');
    };

    return (
        <>
            <div className="container mx-auto max-w-4xl p-6">
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                <Plus className="size-6" />
                                Create New Blog
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isCreating}
                                >
                                    <X className="mr-2 size-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={!isValid || isCreating}
                                >
                                    <Plus className="mr-2 size-4" />
                                    {isCreating ? 'Creating...' : 'Create Blog'}
                                </Button>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Set up your new blog with a title, description, and
                            optional logo. You can always edit these details
                            later.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <BlogForm
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
