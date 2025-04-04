import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import SIPCalculator from "./pages/SipCal";
import InterestCalculator from "./pages/IntCal";
import UpdateProfile from "./pages/UpdateProfile";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/sip",
    element: <SIPCalculator />,
  },
  {
    path: "/intcal",
    element: <InterestCalculator />,
  },
  {
    path: "/update",
    element: <UpdateProfile />,
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
