import { useBlogsContext } from '@/contexts/blogs-context';
import { formatDistance } from 'date-fns';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PostList() {
    const { blogId } = useParams();
    const { posts, getPosts } = useBlogsContext();

    useEffect(() => {
        if (!blogId) return;
        getPosts();
    }, [getPosts, blogId]);

    return (
        <ScrollArea className="h-full w-full">
            <div className="w-full">
                {posts.map((post) => (
                    <Link
                        to={`/posts/${blogId}/${post.id}`}
                        key={post.id}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                    >
                        <div className="flex w-full items-center gap-2">
                            <span>{post.title}</span>{' '}
                            <span className="ml-auto text-xs">
                                {formatDistance(post.published_at, Date.now(), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                        <span className="max-w-[300px] truncate font-medium break-all text-ellipsis">
                            {post.description}
                        </span>
                    </Link>
                ))}
            </div>
        </ScrollArea>
    );
}
