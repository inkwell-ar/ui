import { useParams } from 'react-router-dom';
import { useBlogsContext } from '@/contexts/blogs-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tag, User2, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostData } from '@/contexts/blogs-context';
import { isArweaveTxId } from '@/lib/utils';

export default function PostViewerRoute() {
    const { blogId, postId } = useParams();
    const { posts, isLoadingPosts, getPosts } = useBlogsContext();
    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatWallet = (wallet: string) => {
        if (isArweaveTxId(wallet)) {
            return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
        }
        return wallet;
    };

    if (isLoading || isLoadingPosts) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin border-b-2"></div>
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
            <div className="w-full p-6">
                <Card className="w-full min-w-0">
                    <CardHeader>
                        <CardTitle className="text-3xl leading-tight font-bold">
                            {post.title}
                        </CardTitle>
                        {post.description && (
                            <p className="text-muted-foreground mt-2 text-lg">
                                {post.description}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
                            {post.published_at && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Published{' '}
                                        {formatDate(post.published_at)}
                                    </span>
                                </div>
                            )}
                            {post.last_update &&
                                post.last_update !== post.published_at && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            Updated{' '}
                                            {formatDate(post.last_update)}
                                        </span>
                                    </div>
                                )}
                        </div>

                        {/* Authors */}
                        {post.authors && post.authors.length > 0 && (
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    <TooltipProvider>
                                        {post.authors.map((author, index) => (
                                            <Tooltip key={index}>
                                                <TooltipTrigger asChild>
                                                    <Badge
                                                        variant="secondary"
                                                        className="cursor-help gap-1"
                                                    >
                                                        <User2 className="h-3 w-3" />
                                                        {formatWallet(author)}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-mono text-xs">
                                                        {author}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </TooltipProvider>
                                </div>
                            </div>
                        )}

                        {/* Labels */}
                        {post.labels && post.labels.length > 0 && (
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {post.labels.map((label, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
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
        </ScrollArea>
    );
}
