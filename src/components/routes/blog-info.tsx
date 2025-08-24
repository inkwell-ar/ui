import { useBlogsContext, type BlogData } from '@/contexts/blogs-context';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export default function BlogInfo() {
    const { blogId } = useParams();
    const { blogsData } = useBlogsContext();

    const blogData = useMemo(
        () => blogsData.find((blog: BlogData) => blog.id === blogId),
        [blogsData, blogId]
    );

    return (
        <div className="flex h-full items-center justify-center">
            {/* <h1 className="text-2xl font-bold">Blog Info - {blogId}</h1> */}
            <pre>{JSON.stringify(blogData, null, 2)}</pre>
        </div>
    );
}
