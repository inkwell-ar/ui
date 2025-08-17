import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeContextProvider } from "./contexts/theme-context.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { WCEnvironmentContextProvider } from "./contexts/wc-environment-context.tsx";
import { WCContextProvider } from "./contexts/wc-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <WCEnvironmentContextProvider>
        <WCContextProvider>
          <App />
          <Toaster />
        </WCContextProvider>
      </WCEnvironmentContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
