import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="bottom-right"
                    richColors
                    toastOptions={{ style: { borderRadius: "14px" } }}
                />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
