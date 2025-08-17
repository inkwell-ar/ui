import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/theme-context.tsx";
import { WanderConnectProvider } from "./components/WanderConnectProvider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <WanderConnectProvider>
        <App />
        <Toaster />
      </WanderConnectProvider>
    </ThemeProvider>
  </StrictMode>
);
