import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import {
  matchRouteToConfig,
  generateBreadcrumbPath,
  routesConfig,
} from "@/lib/routes-config";

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

  // For nested routes, we need to find the parent route key
  if (routeKey.includes("_child")) {
    // This is a child route, find the parent
    for (const [key, route] of Object.entries(routesConfig)) {
      if (route.children) {
        const childMatch = route.children.find((child) => {
          const fullChildPath =
            route.path + (child.path ? `/${child.path}` : "");
          const match = matchPath(fullChildPath, location.pathname);
          return match !== null;
        });
        if (childMatch) {
          routeKey = key;
          break;
        }
      }
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
              <BreadcrumbItem className={!isLast ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator
                  className={
                    index === 0 ? "hidden md:block sm:ml-2.5 ml-1.5" : ""
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

// Helper function for path matching (copied from routes-config for internal use)
function matchPath(
  pattern: string,
  pathname: string
): { params: Record<string, string> } | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathnameParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathnameParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathnamePart = pathnameParts[i];

    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathnamePart;
    } else if (patternPart !== pathnamePart) {
      return null;
    }
  }

  return { params };
}
