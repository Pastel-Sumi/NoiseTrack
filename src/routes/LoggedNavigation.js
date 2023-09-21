import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoggedLayout } from "../components/Layouts"
import { Alert, Config, Home, Report } from "../pages";

export function LoggedNavigation() {
  return (
    <BrowserRouter>
      <LoggedLayout>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/alert" element={<Alert/>}/>
            <Route path="/config" element={<Config/>}/>
            <Route path="/report" element={<Report/>}/>
        </Routes>
      </LoggedLayout>
    </BrowserRouter>
  )
}