import { useParams, useNavigate } from 'react-router-dom';
import { useBlogsContext } from '@/contexts/blogs-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, User } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import type { PostData } from '@/contexts/blogs-context';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DateTimePicker } from '@/components/date-picker';
import { isArweaveTxId } from '@/lib/utils';

interface PostFormData {
    title: string;
    description: string;
    body: string;
    labels: string[];
    authors: string[];
    published_at: number | null;
}

export default function PostEditor() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { posts, isLoadingPosts, getPosts, selectedBlog } = useBlogsContext();

    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        description: '',
        body: '',
        labels: [],
        authors: [],
        published_at: null,
    });
    const [newLabel, setNewLabel] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Determine if this is edit mode (has postId) or create mode
    const isEditMode = Boolean(postId);

    useEffect(() => {
        const loadPost = async () => {
            if (!isEditMode) {
                setIsLoading(false);
                return;
            }

            if (!postId) return;

            setIsLoading(true);

            // If posts aren't loaded yet, fetch them
            if (posts.length === 0 && !isLoadingPosts) {
                await getPosts();
            }

            // Find the specific post for editing
            const foundPost = posts.find((p) => `${p.id}` === postId);
            if (foundPost) {
                setPost(foundPost);
                setFormData({
                    title: foundPost.title || '',
                    description: foundPost.description || '',
                    body: foundPost.body || '',
                    labels: foundPost.labels || [],
                    authors: foundPost.authors || [],
                    published_at: foundPost.published_at || null,
                });
            }
            setIsLoading(false);
        };

        loadPost();
    }, [postId, posts, isLoadingPosts, getPosts, isEditMode]);

    // Check if form has changes
    const hasChanges = useMemo(() => {
        if (!isEditMode) {
            return (
                formData.title.trim() !== '' ||
                formData.description.trim() !== '' ||
                formData.body.trim() !== '' ||
                formData.labels.length > 0 ||
                formData.authors.length > 0 ||
                formData.published_at !== null
            );
        }

        if (!post) return false;

        return (
            formData.title !== (post.title || '') ||
            formData.description !== (post.description || '') ||
            formData.body !== (post.body || '') ||
            JSON.stringify(formData.labels) !==
                JSON.stringify(post.labels || []) ||
            JSON.stringify(formData.authors) !==
                JSON.stringify(post.authors || []) ||
            formData.published_at !== (post.published_at || null)
        );
    }, [formData, post, isEditMode]);

    const handleInputChange = (field: keyof PostFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddLabel = () => {
        if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
            setFormData((prev) => ({
                ...prev,
                labels: [...prev.labels, newLabel.trim()],
            }));
            setNewLabel('');
        }
    };

    const handleRemoveLabel = (labelToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            labels: prev.labels.filter((label) => label !== labelToRemove),
        }));
    };

    const handleAddAuthor = () => {
        const trimmedAuthor = newAuthor.trim();
        if (trimmedAuthor && !formData.authors.includes(trimmedAuthor)) {
            // Validate Arweave wallet address
            if (!isArweaveTxId(trimmedAuthor)) {
                // TODO: Show error toast for invalid wallet address
                console.error('Invalid Arweave wallet address');
                return;
            }

            setFormData((prev) => ({
                ...prev,
                authors: [...prev.authors, trimmedAuthor],
            }));
            setNewAuthor('');
        }
    };

    const handleRemoveAuthor = (authorToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            authors: prev.authors.filter((author) => author !== authorToRemove),
        }));
    };

    const handleDateChange = (timestamp: number | null) => {
        setFormData((prev) => ({ ...prev, published_at: timestamp }));
    };

    const handleKeyPress = (
        e: React.KeyboardEvent,
        type: 'label' | 'author'
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'label') {
                handleAddLabel();
            } else {
                handleAddAuthor();
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Always update last_update timestamp when saving
            const saveData = {
                ...formData,
                last_update: Date.now(),
            };

            // TODO: Implement save logic using blogs context
            console.log('Saving post:', saveData);

            // Navigate back to posts list after successful save
            if (selectedBlog) {
                navigate(`/posts/${selectedBlog}`);
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            // TODO: Show error toast
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            setShowCancelDialog(true);
        } else {
            navigateBack();
        }
    };

    const confirmCancel = () => {
        setShowCancelDialog(false);
        navigateBack();
    };

    const navigateBack = () => {
        if (selectedBlog) {
            if (isEditMode && postId) {
                navigate(`/posts/${selectedBlog}/${postId}`);
            } else {
                navigate(`/posts/${selectedBlog}`);
            }
        }
    };

    if (isLoading || isLoadingPosts) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (isEditMode && !post) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold">Post Not Found</h2>
                    <p className="text-muted-foreground">
                        The requested post could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full w-full">
            <div className="w-full">
                <Card className="w-full min-w-0 rounded-none border-0">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-2xl font-bold">
                                {isEditMode ? 'Edit Post' : 'Create New Post'}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-base font-semibold"
                            >
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    handleInputChange('title', e.target.value)
                                }
                                placeholder="Enter post title..."
                                className="text-lg"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-base font-semibold"
                            >
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
                                placeholder="Enter post description..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Published Date */}
                        <DateTimePicker
                            label="Published Date"
                            value={formData.published_at}
                            onChange={handleDateChange}
                            placeholder="Publication date"
                        />

                        {/* Authors */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-base font-semibold">
                                <User className="h-4 w-4" />
                                Authors
                            </Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newAuthor}
                                        onChange={(e) =>
                                            setNewAuthor(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, 'author')
                                        }
                                        placeholder="Add author wallet address..."
                                        className="flex-1 font-mono text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddAuthor}
                                        disabled={!newAuthor.trim()}
                                    >
                                        Add
                                    </Button>
                                </div>
                                {formData.authors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.authors.map(
                                            (author, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="flex items-center gap-1 font-mono text-xs"
                                                >
                                                    {`${author.slice(0, 6)}...${author.slice(-4)}`}
                                                    <X
                                                        className="hover:text-destructive h-3 w-3 cursor-pointer"
                                                        onClick={() =>
                                                            handleRemoveAuthor(
                                                                author
                                                            )
                                                        }
                                                    />
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">
                                Labels
                            </Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newLabel}
                                        onChange={(e) =>
                                            setNewLabel(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, 'label')
                                        }
                                        placeholder="Add a label..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddLabel}
                                        disabled={!newLabel.trim()}
                                    >
                                        Add
                                    </Button>
                                </div>
                                {formData.labels.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.labels.map((label, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {label}
                                                <X
                                                    className="hover:text-destructive h-3 w-3 cursor-pointer"
                                                    onClick={() =>
                                                        handleRemoveLabel(label)
                                                    }
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Body */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="body"
                                className="text-base font-semibold"
                            >
                                Content
                            </Label>
                            <Textarea
                                id="body"
                                value={formData.body}
                                onChange={(e) =>
                                    handleInputChange('body', e.target.value)
                                }
                                placeholder="Write your post content here... (Markdown supported)"
                                className="min-h-[400px] font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
                onConfirm={confirmCancel}
                title="Discard Changes"
                description="Are you sure you want to discard your changes? This action cannot be undone."
                confirmText="Discard"
                cancelText="Keep Editing"
                variant="destructive"
            />
        </ScrollArea>
    );
}
