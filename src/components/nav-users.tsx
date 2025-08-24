import { useBlogsContext } from '@/contexts/blogs-context';
import { NavCategory } from './nav-category';
import { routesConfig } from '@/lib/routes-config';

const categoryName = 'Users';

const categoryItems = [
    {
        name: routesConfig.adminUsers.title,
        route: routesConfig.adminUsers.path,
        icon: routesConfig.adminUsers.icon,
    },
    {
        name: routesConfig.adminNewUser.title,
        route: routesConfig.adminNewUser.path,
        icon: routesConfig.adminNewUser.icon,
    },
];

export function NavUsers() {
    const { isAdmin } = useBlogsContext();

    if (!isAdmin) return null;

    return <NavCategory name={categoryName} items={categoryItems} />;
}
