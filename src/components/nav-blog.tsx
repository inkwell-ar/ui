import { useBlogsContext } from '@/contexts/blogs-context';
import { emptyBlogData } from '@/lib/constants';
import { NavCategory } from './nav-category';
import { routesConfig } from '@/lib/routes-config';

const categoryName = 'Blog';

const categoryItems = [
    {
        name: routesConfig.blogInfo.title,
        route: routesConfig.blogInfo.path,
        icon: routesConfig.blogInfo.icon,
    },
];

export function NavBlog() {
    const { selectedBlog } = useBlogsContext();

    if (!selectedBlog || selectedBlog === emptyBlogData.id) return null;

    categoryItems[0].route = categoryItems[0].route.replace(
        ':blogId',
        selectedBlog || ''
    );

    return <NavCategory name={categoryName} items={categoryItems} />;
}
