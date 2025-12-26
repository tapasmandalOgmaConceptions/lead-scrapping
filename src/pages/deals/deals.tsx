/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import style from "./deals.module.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { DealsTabsLabels, DealsTabsValue } from "../../enum/templateNoteEnum";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import alert from "../../services/alert";
import { DealResponse } from "../../interfaces/templateNoteInterface";
import DealTable from "../../components/table/deals/dealsTable";
import { useNavigate } from "react-router-dom";

const Deals: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tabName, setTabName] = useState<string>(DealsTabsValue.new);
  const [deals, setDeals] = useState<DealResponse[]>([]);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if(userInfo?.role !== "Technician") {
      alert("Sorry you can't access this page", "error");
      navigate("/");
      return;
    }
    getDeals();
  }, [tabName]);
  const tabChange = (event: React.SyntheticEvent, newValue: string) => {
    setDeals([]);
    setTabName(newValue);
  };
  const getDeals = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.technician.getDeals}?technician_id=${userInfo?.id}&tab_name=${tabName}`
      );
      if (res.status === 200) {
        setDeals(res.data?.data);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.parent}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabName}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={tabChange}>
              <Tab label={DealsTabsLabels.new} value={DealsTabsValue.new} />
              <Tab label={DealsTabsLabels.open} value={DealsTabsValue.open} />
              <Tab
                label={DealsTabsLabels.closed}
                value={DealsTabsValue.closed}
              />
            </TabList>
          </Box>
          <TabPanel value={DealsTabsValue.new}>
            <DealTable deals={deals} loading={loading} />
          </TabPanel>
          <TabPanel value={DealsTabsValue.open}>
            <DealTable deals={deals} loading={loading} />
          </TabPanel>
          <TabPanel value={DealsTabsValue.closed}>
            <DealTable deals={deals} loading={loading} />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default Deals;
