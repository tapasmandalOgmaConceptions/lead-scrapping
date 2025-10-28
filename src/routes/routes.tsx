import React, {lazy, Suspense} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AuthRedirect from "./authRedirect";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const Login = lazy(() => import("../pages/auth/login/login"));
const PageNotFound = lazy(() => import("../pages/page-not-found/pageNotFound"));
const UserList = lazy(() => import("../pages/user-management/user-list/userList"));
const CreateUpdateUser = lazy(() => import("../pages/user-management/create-update-user/create-update-user"));
const LeadScrappingList = lazy(() => import("../pages/lead-scrapping/lead-scrapping-list/leadScrappingList"));
const FollowUp = lazy(() => import("../pages/home-page/homePage"));
const AssignUserLeadList = lazy(() => import("../pages/user-management/assign-user-lead-list/assignUserLeadList"));

function AppRouter() {
  return (
    <Router>
      <Header/>
      <Suspense fallback={<div style={{height: "100vh", display:"flex", justifyContent:"center", alignItems: "center"}}>Loading...</div>}>
      <Routes>
        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ProtectedRoute for routes that require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<FollowUp />} />
          <Route path="/lead-scrape" element={<LeadScrappingList />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUpdateUser />} />
          <Route path="/update-user/:userId" element={<CreateUpdateUser />} />
          <Route path="/assigned-leads" element={<AssignUserLeadList />} />
          <Route path="/assigned-leads/:userId" element={<AssignUserLeadList />} />
        </Route>

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      </Suspense>
      <Footer/>
    </Router>
  );
}

export default AppRouter;
