import { useParams } from "react-router-dom";

export default function BlogSettings() {
  const { blogId } = useParams();
  
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Blog Settings - {blogId}</h1>
    </div>
  );
}
