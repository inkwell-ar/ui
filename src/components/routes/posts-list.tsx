import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import PostList from '../post-list';
import { Outlet } from 'react-router-dom';

export default function PostsList() {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex min-w-8 items-start justify-center font-bold">
                <PostList />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="flex min-w-8 items-center justify-center font-bold">
                <Outlet />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
