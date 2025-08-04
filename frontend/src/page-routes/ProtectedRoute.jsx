import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole }) => {
//   if (!allowedRoles.includes(userRole)) {
//     return <Navigate to="/" replace />; // redirect to landing page if not allowed
//   }
  return <Outlet />;
};

export default ProtectedRoute;
