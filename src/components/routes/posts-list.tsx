// import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PostList from "../post-list";
import { Outlet } from "react-router-dom";

export default function PostsList() {
  // const { blogId } = useParams();
  
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="flex items-start justify-center font-bold">
        <PostList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="flex items-center justify-center font-bold">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
