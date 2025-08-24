import { useParams } from 'react-router-dom';

export default function PostNew() {
    const { blogId } = useParams();

    return (
        <div className="flex h-full items-center justify-center">
            <h1 className="text-2xl font-bold">Create New Post - {blogId}</h1>
        </div>
    );
}
