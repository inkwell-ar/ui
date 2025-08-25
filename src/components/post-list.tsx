import { useBlogsContext } from '@/contexts/blogs-context';
import { formatDistance } from 'date-fns';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PostList() {
    const { posts, getPosts, selectedBlog } = useBlogsContext();

    useEffect(() => {
        if (!selectedBlog) return;
        getPosts();
    }, [getPosts, selectedBlog]);

    return (
        <ScrollArea className="h-full w-full">
            <div className="w-full">
                {posts.map((post) => (
                    <Link
                        to={`/posts/${selectedBlog}/${post.id}`}
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
                        <span className="font-medium">{post.description}</span>
                        {/* <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                {post.body.slice(0, 40)}
              </span> */}
                    </Link>
                ))}
            </div>
        </ScrollArea>
    );
}
