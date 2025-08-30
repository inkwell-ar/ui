import { useParams } from 'react-router-dom';
import { useBlogsContext } from '@/contexts/blogs-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostData } from '@/contexts/blogs-context';
import { UserBadge } from '../user-badge';
import { DateDisplay } from '../date-display';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { routesConfig } from '@/lib/routes-config';
import { TagBadge } from '../tag-badge';

export default function PostViewerRoute() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { posts, isLoadingPosts, getPosts, selectedBlog, deletePost } =
        useBlogsContext();
    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            if (!postId) return;

            setIsLoading(true);

            // If posts aren't loaded yet, fetch them
            if (posts.length === 0 && !isLoadingPosts) {
                await getPosts();
            }

            // Find the specific post
            const foundPost = posts.find((p) => `${p.id}` === postId);
            setPost(foundPost || null);
            setIsLoading(false);
        };

        loadPost();
    }, [postId, posts, isLoadingPosts, getPosts]);

    const handleEditPost = () => {
        if (!selectedBlog || !postId) return;

        // Calculate the route path for the edit post route
        let routePath = routesConfig.posts.children?.editor.path;
        if (!routePath) return;
        routePath = routePath
            .replace(':blogId', selectedBlog)
            .replace(':postId', postId);

        // Navigate to edit post route
        navigate(routePath);
    };

    const handleDeletePost = () => {
        setShowDeleteDialog(true);
    };

    const confirmDeletePost = async () => {
        if (!postId) return;

        setIsDeleting(true);
        try {
            const result = await deletePost(postId);

            if (result.success) {
                // After successful deletion, navigate back to posts list
                if (selectedBlog) {
                    navigate(`/posts/${selectedBlog}`);
                }
            } else {
                console.error('Failed to delete post:', result.error);
                // TODO: Show error toast
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            // TODO: Show error toast
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (isLoading || isLoadingPosts) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    if (!post) {
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
                        <div className="flex items-start justify-between gap-1">
                            {/* Title */}
                            <CardTitle className="text-3xl leading-tight font-bold">
                                {post.title}
                            </CardTitle>
                            {/* Action Buttons */}
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={handleEditPost}
                                    disabled={isDeleting}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={isDeleting}
                                    onClick={handleDeletePost}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        {post.description && (
                            <p className="text-muted-foreground mt-1 text-lg">
                                {post.description}
                            </p>
                        )}

                        <div className="flex items-start justify-between gap-1">
                            <div className="mt-1 flex flex-col items-start gap-1">
                                {/* Authors */}
                                {post.authors && post.authors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <TooltipProvider>
                                            {post.authors.map(
                                                (author, index) => (
                                                    <UserBadge
                                                        key={`${index}`}
                                                        author={author}
                                                        showTooltip={true}
                                                    />
                                                )
                                            )}
                                        </TooltipProvider>
                                    </div>
                                )}

                                {/* Labels */}
                                {post.labels && post.labels.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {post.labels.map((label, index) => (
                                            <TagBadge
                                                key={`${index}`}
                                                label={label}
                                                showTooltip={true}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="text-muted-foreground flex flex-wrap gap-1 text-sm">
                                {post.published_at && (
                                    <DateDisplay
                                        timestamp={post.published_at}
                                        size="sm"
                                        isLastUpdate={false}
                                    />
                                )}
                                {post.last_update &&
                                    post.last_update !== post.published_at && (
                                        <DateDisplay
                                            timestamp={post.last_update}
                                            size="sm"
                                            isLastUpdate={true}
                                        />
                                    )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Separator className="mb-6" />
                        <div className="prose prose-neutral dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-extrabold prose-h2:text-3xl prose-h2:font-semibold prose-h3:text-2xl prose-h3:font-semibold prose-h4:text-xl prose-h4:font-semibold prose-p:leading-7 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-pre:overflow-x-auto prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-li:mt-2 max-w-none">
                            {post.body ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <h1
                                                className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                                                {...props}
                                            />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2
                                                className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
                                                {...props}
                                            />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3
                                                className="scroll-m-20 text-2xl font-semibold tracking-tight"
                                                {...props}
                                            />
                                        ),
                                        h4: ({ node, ...props }) => (
                                            <h4
                                                className="scroll-m-20 text-xl font-semibold tracking-tight"
                                                {...props}
                                            />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p
                                                className="leading-7 [&:not(:first-child)]:mt-6"
                                                {...props}
                                            />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote
                                                className="mt-6 border-l-2 pl-6 italic"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul
                                                className="my-6 ml-6 list-disc [&>li]:mt-2"
                                                {...props}
                                            />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol
                                                className="my-6 ml-6 list-decimal [&>li]:mt-2"
                                                {...props}
                                            />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li className="mt-2" {...props} />
                                        ),
                                        code: ({
                                            node,
                                            inline,
                                            ...props
                                        }: any) =>
                                            inline ? (
                                                <code
                                                    className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                                                    {...props}
                                                />
                                            ) : (
                                                <code
                                                    className="relative rounded font-mono text-sm"
                                                    {...props}
                                                />
                                            ),
                                        pre: ({ node, ...props }) => (
                                            <pre
                                                className="bg-muted mt-6 mb-4 overflow-x-auto rounded-lg border p-4"
                                                {...props}
                                            />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a
                                                className="text-primary font-medium underline underline-offset-4"
                                                {...props}
                                            />
                                        ),
                                        table: ({ node, ...props }) => (
                                            <table
                                                className="w-full"
                                                {...props}
                                            />
                                        ),
                                        thead: ({ node, ...props }) => (
                                            <thead {...props} />
                                        ),
                                        tbody: ({ node, ...props }) => (
                                            <tbody {...props} />
                                        ),
                                        tr: ({ node, ...props }) => (
                                            <tr
                                                className="even:bg-muted m-0 border-t p-0"
                                                {...props}
                                            />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th
                                                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
                                                {...props}
                                            />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td
                                                className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {post.body}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    No content available for this post.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDeletePost}
                title="Delete Post"
                description={`Are you sure you want to delete "${post?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </ScrollArea>
    );
}
