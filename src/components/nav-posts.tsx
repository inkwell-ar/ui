import { useBlogsContext } from '@/contexts/blogs-context';
import { NavCategory } from './nav-category';
import { routesConfig } from '@/lib/routes-config';
import { Feather } from 'lucide-react';
import { emptyBlogData } from '@/lib/constants';

const categoryName = 'Posts';

const categoryItems = [
    {
        name: routesConfig.posts.title,
        route: routesConfig.posts.path,
        icon: routesConfig.posts.icon,
    },
    {
        name: routesConfig.posts.children?.new?.title || '',
        route: routesConfig.posts.children?.new?.path || '',
        icon: routesConfig.posts.children?.new?.icon || Feather,
    },
];

export function NavPosts() {
    const { isEditor, selectedBlog } = useBlogsContext();

    if (!isEditor) return null;
    if (!selectedBlog || selectedBlog === emptyBlogData.id) return null;

    categoryItems[0].route = categoryItems[0].route.replace(
        ':blogId',
        selectedBlog || ''
    );
    categoryItems[1].route = categoryItems[1].route.replace(
        ':blogId',
        selectedBlog || ''
    );

    return <NavCategory name={categoryName} items={categoryItems} />;
}
