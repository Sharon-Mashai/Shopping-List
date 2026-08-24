import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

function PublicRoute() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
  );

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;