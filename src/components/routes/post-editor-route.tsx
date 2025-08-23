import { useParams } from "react-router-dom";
import PostEditor from "../post-editor";

export default function PostEditorRoute() {
  const { blogId, postId } = useParams();
  
  return <PostEditor />;
}
