import { formatDistance } from 'date-fns';

const posts = Array.from({ length: 7 }).map((_, i) => {
    const id = i + 1;
    return {
        id,
        title: `Title ${id}`,
        description: `Description ${id}`,
        body: `Body ${id} with a realy long text to be sliced for the teaser in the posts list`,
        date: Date.now() - (id - 1) * 1000 * 60 * 60,
    };
});

export default function PostList() {
    return (
        <div className="w-full">
            {posts.map((post) => (
                <a
                    href="#"
                    key={post.id}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                    <div className="flex w-full items-center gap-2">
                        <span>{post.title}</span>{' '}
                        <span className="ml-auto text-xs">
                            {formatDistance(post.date, Date.now(), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                    <span className="font-medium">{post.description}</span>
                    {/* <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                {post.body.slice(0, 40)}
              </span> */}
                </a>
            ))}
        </div>
    );
}
