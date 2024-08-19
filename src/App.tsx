import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";
import React from "react";
import HomePage from "./page/Home";
import ErrorPage from "./page/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
