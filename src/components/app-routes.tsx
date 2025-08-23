import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig } from "@/lib/routes-config";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Generate routes from configuration */}
      {Object.entries(routesConfig).map(([key, route]) => {
        if (route.children) {
          // Handle nested routes
          return (
            <Route key={key} path={route.path} element={route.element}>
              {route.children.map((child, index) => {
                if (child.index) {
                  return <Route key={`${key}-index`} index element={child.element} />;
                }
                return (
                  <Route
                    key={`${key}-${index}`}
                    path={child.path}
                    element={child.element}
                  />
                );
              })}
            </Route>
          );
        }
        
        // Handle regular routes
        return <Route key={key} path={route.path} element={route.element} />;
      })}
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
