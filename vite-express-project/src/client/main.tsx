import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import Frame from "./routes/Frame"
import Camera from "./routes/Camera";
import Selection from "./routes/Selection";
import Result from "./routes/Result";

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
  },
  {
    path: "/select",
    element: <Selection />
  },
  {
    path: "/result",
    element: <Result />
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
