/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import LeadScrappingList from "../lead-scrapping/lead-scrapping-list/leadScrappingList";
import AssignUserLeadList from "../user-management/assign-user-lead-list/assignUserLeadList";

const HomePage: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return (
    <>
      {userInfo?.isAdmin ? (
        <LeadScrappingList />
      ) : (
        <AssignUserLeadList />
      )}
    </>
  );
};

export default HomePage;
