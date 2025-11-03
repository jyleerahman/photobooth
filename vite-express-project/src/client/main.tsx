import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import Frame from "./routes/Frame"
import Camera from "./routes/Camera";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/frame",
    element: <Frame />
  },
  {
    path: "/camera",
    element: <Camera />
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
