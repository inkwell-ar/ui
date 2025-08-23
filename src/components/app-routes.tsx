import { Routes, Route, Navigate } from "react-router-dom";
import BlogInfo from "./routes/blog-info";
import BlogSettings from "./routes/blog-settings";
import PostsList from "./routes/posts-list";
import PostViewerRoute from "./routes/post-viewer-route";
import PostEditorRoute from "./routes/post-editor-route";
import PostNew from "./routes/post-new";
import UsersManagement from "./routes/users-management";
import UserDetails from "./routes/user-details";
import Permissions from "./routes/permissions";
import DefaultRoute from "./routes/default-route";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultRoute />} />
      
      {/* Blog routes */}
      <Route path="/blog/:blogId/info" element={<BlogInfo />} />
      <Route path="/blog/:blogId/settings" element={<BlogSettings />} />
      
      {/* Posts routes with nested layout */}
      <Route path="/posts/:blogId" element={<PostsList />}>
        <Route index element={<div className="flex items-center justify-center h-full text-muted-foreground">Select a post to view</div>} />
        <Route path=":postId" element={<PostViewerRoute />} />
        <Route path=":postId/edit" element={<PostEditorRoute />} />
        <Route path="new" element={<PostNew />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/users/:userId" element={<UserDetails />} />
      <Route path="/admin/permissions" element={<Permissions />} />
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
