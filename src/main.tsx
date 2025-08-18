import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeContextProvider } from "@/contexts/theme-context";
import { Toaster } from "@/components/ui/sonner";
import { WCEnvironmentContextProvider } from "@/contexts/wc-environment-context";
import { WCContextProvider } from "@/contexts/wc-context";
import { App } from "@/app";

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
