import React from "react";
// import { Navigate } from "react-router-dom";

import Login from "../Pages/Login"
import Register from "../Pages/Register"
import Daskboard from "../Pages/Daskboard"
import Instruments from "../Pages/Instruments"
import Projects from "../Pages/Projects"
import Project from "../Pages/Project"
import Storage from "../Pages/Storage"
import ImageView from "../Pages/Image"
import ScanImage from "../Pages/ScanImage";

const publicRoutes = [
    { path: "/login", component: <Login /> },
    { path: "/register", component: <Register /> },
]
const authProtectedRoutes = [
    { path: "/daskboard", component: <Daskboard /> },
    { path: "/instruments", component: <Instruments /> },
    { path: "/projects", component: <Projects /> },
    { path: "/project/:id", component: <Project /> },
    { path: "/image-view/:params", component: <ImageView /> },
    { path: "/storage", component: <Storage /> },
    { path: "/scan-image/:projectId", component: <ScanImage /> },
]

export { publicRoutes, authProtectedRoutes }