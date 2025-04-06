import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import SIPCalculator from "./pages/SipCal";
import InterestCalculator from "./pages/IntCal";
import UpdateProfile from "./pages/UpdateProfile";
import LumpSumCal from "./pages/LumpSumCal";
import RetirementCal from "./pages/RetirementCal";
import AssetAllocationCal from "./pages/AssetAllocationCal";
import AdvancedGoalCal from "./pages/AdvancedGoalCal";
import PPFCalculator from "./pages/PPFCalculator";
import GstCalculator from "./pages/GstCalculator";

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
  {
    path: "/lumpsum",
    element: <LumpSumCal />,
  },
  {
    path: "/retirement",
    element: <RetirementCal />,
  },
  {
    path: "/asset-allocation",
    element: <AssetAllocationCal />,
  },
  {
    path: "/advanced-goal",
    element: <AdvancedGoalCal />,
  },
  {
    path: "/ppf-calculator",
    element: <PPFCalculator />,
  },
  {
    path: "/gst-calculator",
    element: <GstCalculator />,
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
