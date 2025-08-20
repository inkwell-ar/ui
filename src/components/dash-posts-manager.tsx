import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PostList from "./post-list";
import PostViewer from "./post-viewer";
import PostEditor from "./post-editor";

export default function DashPostsManager() {
  const isEditing = false;
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="flex items-start justify-center font-bold">
        <PostList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="flex items-center justify-center font-bold">
        {!isEditing ? <PostViewer /> : <PostEditor />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
