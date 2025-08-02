import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/user-without-login/landingPage/LandingPage";
import AboutUs from "../pages/user-without-login/about-us/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      
    ],
  },
]);

export default router;
