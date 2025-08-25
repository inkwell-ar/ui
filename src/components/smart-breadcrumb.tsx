import { useLocation, Link } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from './ui/breadcrumb';
import {
    matchRouteToConfig,
    generateBreadcrumbPath,
    routesConfig,
} from '@/lib/routes-config';

export function SmartBreadcrumb() {
    const location = useLocation();

    // Match current path to route configuration
    const matchedRoute = matchRouteToConfig(location.pathname);

    if (!matchedRoute) {
        return null;
    }

    // Find the route key by matching the route config
    let routeKey = matchedRoute.key;
    let currentParams = matchedRoute.params;

    // For nested routes, we need to find the parent route key and child route
    if (routeKey.includes('_')) {
        const [parentKey, childKey] = routeKey.split('_');
        const parentRoute = routesConfig[parentKey];

        if (
            parentRoute &&
            parentRoute.children &&
            parentRoute.children[childKey]
        ) {
            const childRoute = parentRoute.children[childKey];

            // Generate breadcrumb for parent first, then add child
            const parentBreadcrumbs = generateBreadcrumbPath(
                parentKey,
                currentParams
            );

            // Create child breadcrumb
            let childPath = childRoute.path;
            if (currentParams && childRoute.params) {
                childRoute.params.forEach((param) => {
                    if (currentParams[param]) {
                        childPath = childPath.replace(
                            `:${param}`,
                            currentParams[param]
                        );
                    }
                });
            }

            const childBreadcrumb = {
                title: childRoute.breadcrumbTitle || childRoute.title,
                path: childPath,
                isActive: true,
            };

            const breadcrumbItems = [...parentBreadcrumbs, childBreadcrumb];

            if (breadcrumbItems.length === 0) {
                return null;
            }

            return (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => {
                            const isLast = index === breadcrumbItems.length - 1;

                            return (
                                <div
                                    key={item.path}
                                    className="flex items-center"
                                >
                                    <BreadcrumbItem
                                        className={
                                            !isLast ? 'hidden md:block' : ''
                                        }
                                    >
                                        {isLast ? (
                                            <BreadcrumbPage>
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link to={item.path}>
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && (
                                        <BreadcrumbSeparator
                                            className={
                                                index === 0
                                                    ? 'ml-1.5 hidden sm:ml-2.5 md:block'
                                                    : ''
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            );
        }
    }

    // Generate breadcrumb items
    const breadcrumbItems = generateBreadcrumbPath(routeKey, currentParams);

    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <div key={item.path} className="flex items-center">
                            <BreadcrumbItem
                                className={!isLast ? 'hidden md:block' : ''}
                            >
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {item.title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={item.path}>{item.title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && (
                                <BreadcrumbSeparator
                                    className={
                                        index === 0
                                            ? 'ml-1.5 hidden sm:ml-2.5 md:block'
                                            : ''
                                    }
                                />
                            )}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
