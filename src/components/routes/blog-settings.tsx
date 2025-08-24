import { useParams } from 'react-router-dom';

export default function BlogSettings() {
    const { blogId } = useParams();

    return (
        <div className="flex h-full items-center justify-center">
            <h1 className="text-2xl font-bold">Blog Settings - {blogId}</h1>
        </div>
    );
}
