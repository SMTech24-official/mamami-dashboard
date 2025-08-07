import { createBrowserRouter, Navigate } from "react-router";
import Login from "../auth/Login/Login";
import AuthGuard from "../components/AuthGuard";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../DashboardLayout/DashboardLayout";
import AllUsers from "../pages/AllUsers/AllUsers";

import CircleComp from "../pages/Circle/Circle";
import DashboardHome from "../pages/Dashboard/Home";
import NotFound from "../pages/NotFound/NotFound";

const router = createBrowserRouter([
  // Public route
  {
    path: "/login",
    element: <Login />,
  },

  // Dashboard routes
  {
    path: "/",
    element: (
      <AuthGuard>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </AuthGuard>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "users",
            element: <AllUsers />,
          },
          {
            path: "circle",
            element: <CircleComp />,
          },
        ],
      },
    ],
  },

  // 404 page
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
