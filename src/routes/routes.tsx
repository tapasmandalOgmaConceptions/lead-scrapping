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
const FollowUp = lazy(() => import("../pages/home-page/homePage"));
const AssignUserLeadList = lazy(() => import("../pages/user-management/assign-user-lead-list/assignUserLeadList"));
const ViewLead = lazy(() => import("../pages/user-management/view-lead/viewLead"));
const PositiveLeads = lazy(() => import("../pages/positive-leads/positiveLeads"));
const Deals = lazy(() => import("../pages/deals/deals"));

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
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUpdateUser />} />
          <Route path="/update-user/:userId" element={<CreateUpdateUser />} />
          <Route path="/assigned-leads/:userId" element={<AssignUserLeadList />} />
          <Route path="/view-lead/:leadId" element={< ViewLead/>} />
          <Route path="/positive-leads" element={<PositiveLeads />} />
          <Route path="/deals" element={<Deals />} />
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
