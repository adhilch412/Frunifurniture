
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

const ProtectedRoute = ({ children, requireAuth = false, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  //=========================== If route needs login but user is not logged in==============================
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //====================== If route  guests (login/signup) =================================
  if (!requireAuth && user && allowedRoles === "guest") {
    return user.role === "admin"
      ? <Navigate to="/dashbord" replace />
      : <Navigate to="/" replace />;
  }

  //=============== Role-based restriction=============================
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return user.role === "admin"
        ? <Navigate to="/dashbord" replace />
        : <Navigate to="/" replace />;
    }
  }

  // Public pages (guest + user + admin)
  return children;
};

export default ProtectedRoute;
