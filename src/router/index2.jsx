import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Root from "@/components/Root";
import { mainRoutes } from "@/router/mainRoutes";
import { authRoutes } from "@/router/authRoutes";

// Define routes structure
const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [...mainRoutes]
      },
      ...authRoutes
    ]
  }
]

export const router = createBrowserRouter(routes)