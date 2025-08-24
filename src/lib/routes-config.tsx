import type { ReactElement } from 'react';
import {
    Info,
    Settings,
    List,
    Feather,
    Shield,
    Home,
    UserPlus2,
    Users2,
} from 'lucide-react';

// Route components
import BlogInfo from '@/components/routes/blog-info';
import BlogEditor from '@/components/routes/blog-editor';
import BlogSettings from '@/components/routes/blog-settings';
import PostsList from '@/components/routes/posts-list';
import PostViewerRoute from '@/components/routes/post-viewer-route';
import PostEditorRoute from '@/components/routes/post-editor-route';
import PostNew from '@/components/routes/post-new';
import UsersManagement from '@/components/routes/users-management';
import UserDetails from '@/components/routes/user-details';
import NewUser from '@/components/routes/new-user';
import DefaultRoute from '@/components/routes/default-route';

export interface RouteConfig {
    path: string;
    element: ReactElement;
    title: string;
    breadcrumbTitle?: string;
    icon?: any;
    parent?: string;
    params?: string[];
    index?: boolean;
    hideFromBreadcrumb?: boolean;
}

export interface NestedRouteConfig extends RouteConfig {
    children?: RouteConfig[];
}

export const routesConfig: Record<string, NestedRouteConfig> = {
    // Root route
    home: {
        path: '/',
        element: <DefaultRoute />,
        title: 'Dashboard',
        breadcrumbTitle: 'Home',
        icon: Home,
    },

    // Blog routes
    blogInfo: {
        path: '/blog/:blogId/info',
        element: <BlogInfo />,
        title: 'Blog Information',
        breadcrumbTitle: 'Info',
        icon: Info,
        parent: 'home',
        params: ['blogId'],
    },

    blogEditor: {
        path: '/blog/:blogId/edit',
        element: <BlogEditor />,
        title: 'Edit Blog',
        breadcrumbTitle: 'Edit',
        icon: Feather,
        parent: 'home',
        params: ['blogId'],
    },

    blogSettings: {
        path: '/blog/:blogId/settings',
        element: <BlogSettings />,
        title: 'Blog Settings',
        breadcrumbTitle: 'Settings',
        icon: Settings,
        parent: 'home',
        params: ['blogId'],
    },

    // Posts routes (with nested structure)
    posts: {
        path: '/posts/:blogId',
        element: <PostsList />,
        title: 'Posts',
        breadcrumbTitle: 'Posts',
        icon: List,
        parent: 'home',
        params: ['blogId'],
        children: [
            {
                path: '',
                element: (
                    <div className="text-muted-foreground flex h-full items-center justify-center">
                        Select a post to view
                    </div>
                ),
                title: 'Posts List',
                breadcrumbTitle: 'All Posts',
                index: true,
                hideFromBreadcrumb: true,
            },
            {
                path: ':postId',
                element: <PostViewerRoute />,
                title: 'View Post',
                breadcrumbTitle: 'View Post',
                parent: 'posts',
                params: ['blogId', 'postId'],
            },
            {
                path: ':postId/edit',
                element: <PostEditorRoute />,
                title: 'Edit Post',
                breadcrumbTitle: 'Edit',
                icon: Feather,
                parent: 'posts',
                params: ['blogId', 'postId'],
            },
            {
                path: 'new',
                element: <PostNew />,
                title: 'Create New Post',
                breadcrumbTitle: 'New Post',
                icon: Feather,
                parent: 'posts',
                params: ['blogId'],
            },
        ],
    },

    // Admin routes
    adminUsers: {
        path: '/admin/users',
        element: <UsersManagement />,
        title: 'Users Management',
        breadcrumbTitle: 'Users',
        icon: Users2,
        parent: 'home',
    },

    adminUserDetails: {
        path: '/admin/users/:userId',
        element: <UserDetails />,
        title: 'User Details',
        breadcrumbTitle: 'User Details',
        icon: Shield,
        parent: 'adminUsers',
        params: ['userId'],
    },

    adminNewUser: {
        path: '/admin/new-user',
        element: <NewUser />,
        title: 'New User',
        breadcrumbTitle: 'New User',
        icon: UserPlus2,
        parent: 'home',
    },
};

// Helper function to find route by path
export function findRouteByPath(path: string): RouteConfig | null {
    for (const route of Object.values(routesConfig)) {
        if (route.path === path) {
            return route;
        }
        if (route.children) {
            for (const child of route.children) {
                const fullChildPath =
                    route.path + (child.path ? `/${child.path}` : '');
                if (fullChildPath === path || child.path === path) {
                    return child;
                }
            }
        }
    }
    return null;
}

// Helper function to generate breadcrumb path for a route
export function generateBreadcrumbPath(
    routeKey: string,
    params?: Record<string, string>
): Array<{
    title: string;
    path: string;
    isActive: boolean;
}> {
    const route = routesConfig[routeKey];
    if (!route) return [];

    const breadcrumbs: Array<{
        title: string;
        path: string;
        isActive: boolean;
    }> = [];

    // Build breadcrumb trail by following parent chain
    const buildTrail = (currentRoute: RouteConfig, currentKey: string) => {
        if (currentRoute.hideFromBreadcrumb) return;

        let path = currentRoute.path;

        // Replace parameters with actual values
        if (params && currentRoute.params) {
            currentRoute.params.forEach((param) => {
                if (params[param]) {
                    path = path.replace(`:${param}`, params[param]);
                }
            });
        }

        breadcrumbs.unshift({
            title: currentRoute.breadcrumbTitle || currentRoute.title,
            path,
            isActive: currentKey === routeKey,
        });

        // Add parent breadcrumb if exists
        if (currentRoute.parent && routesConfig[currentRoute.parent]) {
            buildTrail(routesConfig[currentRoute.parent], currentRoute.parent);
        }
    };

    buildTrail(route, routeKey);
    return breadcrumbs;
}

// Helper function to match current location to route config
export function matchRouteToConfig(
    pathname: string
): { route: RouteConfig; key: string; params: Record<string, string> } | null {
    for (const [key, route] of Object.entries(routesConfig)) {
        // Check main route
        const match = matchPath(route.path, pathname);
        if (match) {
            return { route, key, params: match.params };
        }

        // Check children
        if (route.children) {
            for (const child of route.children) {
                const fullChildPath =
                    route.path + (child.path ? `/${child.path}` : '');
                const childMatch = matchPath(fullChildPath, pathname);
                if (childMatch) {
                    return {
                        route: child,
                        key: `${key}_child`,
                        params: childMatch.params,
                    };
                }
            }
        }
    }
    return null;
}

// Helper function to get navigation items for specific categories
export function getNavigationItems(
    category: 'blog' | 'posts' | 'admin'
): Array<{
    name: string;
    route: string;
    icon: any;
}> {
    switch (category) {
        case 'blog':
            return [
                {
                    name:
                        routesConfig.blogInfo.breadcrumbTitle ||
                        routesConfig.blogInfo.title,
                    route: routesConfig.blogInfo.path,
                    icon: routesConfig.blogInfo.icon,
                },
                {
                    name:
                        routesConfig.blogSettings.breadcrumbTitle ||
                        routesConfig.blogSettings.title,
                    route: routesConfig.blogSettings.path,
                    icon: routesConfig.blogSettings.icon,
                },
            ];

        case 'posts':
            return [
                {
                    name: 'All Posts',
                    route: routesConfig.posts.path,
                    icon: routesConfig.posts.icon,
                },
                ...(routesConfig.posts.children
                    ?.filter((child) => !child.hideFromBreadcrumb)
                    .map((child) => ({
                        name: child.breadcrumbTitle || child.title,
                        route:
                            routesConfig.posts.path +
                            (child.path ? `/${child.path}` : ''),
                        icon: child.icon,
                    })) || []),
            ];

        case 'admin':
            return [
                {
                    name:
                        routesConfig.adminUsers.breadcrumbTitle ||
                        routesConfig.adminUsers.title,
                    route: routesConfig.adminUsers.path,
                    icon: routesConfig.adminUsers.icon,
                },
                {
                    name:
                        routesConfig.adminNewUser.breadcrumbTitle ||
                        routesConfig.adminNewUser.title,
                    route: routesConfig.adminNewUser.path,
                    icon: routesConfig.adminNewUser.icon,
                },
            ];

        default:
            return [];
    }
}

// Simple path matching function
function matchPath(
    pattern: string,
    pathname: string
): { params: Record<string, string> } | null {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathnameParts = pathname.split('/').filter(Boolean);

    if (patternParts.length !== pathnameParts.length) {
        return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const pathnamePart = pathnameParts[i];

        if (patternPart.startsWith(':')) {
            const paramName = patternPart.slice(1);
            params[paramName] = pathnamePart;
        } else if (patternPart !== pathnamePart) {
            return null;
        }
    }

    return { params };
}
