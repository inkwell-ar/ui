import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeContextProvider } from "@/contexts/theme-context";
import { Toaster } from "@/components/ui/sonner";
import { EnvContextProvider } from "@/contexts/env-context";
import { WCContextProvider } from "@/contexts/wc-context";
import { App } from "@/app3";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <EnvContextProvider>
        <WCContextProvider>
          <App />
          <Toaster />
        </WCContextProvider>
      </EnvContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
