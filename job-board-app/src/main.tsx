// Purpose: App entry point; mount React application.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./providers/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 8000,
          style: {
            background: "#ffffff",
            color: "var(--success-text)",
            border: "1px solid #e2e8f0",
            fontWeight: "100",
          },
          className: "shadow-lg rounded-xl",
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
