import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import TitleWrapper from "./components/TitleWrapper";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Root from "./routes/Root";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TitleWrapper title="Money Lover">
        <ProtectedRoute>
          <Root />
        </ProtectedRoute>
      </TitleWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <TitleWrapper title="Đăng nhập | Money Lover">
        <Login />
      </TitleWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <TitleWrapper title="Đăng ký | Money Lover">
        <Register />
      </TitleWrapper>
    ),
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </React.StrictMode>,
);
