import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './components/Nav';
import Dashboard from "./screens/Dashboard";
import Customers from "./screens/Customers";
import Accounts from "./screens/Accounts";
import Vendors from "./screens/Vendors";

const navLinks = [
    {
        title: "accounts", to: "/accounts" },
        { title: "customers", to: "/customers" },
        {title: "vendors", to: "/vendors"},

]

const AuthenticatedApp = () => {
    return (
        <BrowserRouter>
            <Nav navLinks={navLinks}/>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/vendors" element={<Vendors />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AuthenticatedApp;
