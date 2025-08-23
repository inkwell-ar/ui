import { useParams } from "react-router-dom";

export default function PostNew() {
  const { blogId } = useParams();
  
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Create New Post - {blogId}</h1>
    </div>
  );
}
