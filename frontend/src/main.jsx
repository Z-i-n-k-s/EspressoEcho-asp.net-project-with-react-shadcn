// index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import router from "./page-routes/index.jsx"; // ✅ now it’s the router object
import { ThemeProvider } from "./theme/ThemeProvider";

// ✅ Import CartProvider
import { CartProvider } from "./pages/user-without-login/componets/CartContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
   
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <CartProvider>
            <RouterProvider router={router} />
            </CartProvider>
        </ThemeProvider>
      </Provider>
   
  </StrictMode>
);
