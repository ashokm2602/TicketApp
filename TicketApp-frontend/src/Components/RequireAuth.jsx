import { Navigate } from "react-router-dom";

const RequireAuth = ({ allowedRoles, children }) => {

  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // ROLE CHECK
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
