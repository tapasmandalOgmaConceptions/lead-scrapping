import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/login";
import ProtectedRoute from "./protectedRoute";
import AuthRedirect from "./authRedirect";
import PageNotFound from "../pages/page-not-found/pageNotFound";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import UserList from "../pages/user-management/user-list/userList";
import CreateUpdateUser from "../pages/user-management/create-update-user/create-update-user";
import LeadScrappingList from "../pages/lead-scrapping/lead-scrapping-list/leadScrappingList";

function AppRouter() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}
        </Route>

        {/* ProtectedRoute for routes that require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LeadScrappingList />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUpdateUser />} />
          <Route path="/update-user/:userId" element={<CreateUpdateUser />} />
        </Route>

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default AppRouter;
