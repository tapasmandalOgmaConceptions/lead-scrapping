import React, { useState } from "react";
import style from "./deals.module.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { PackageBiddingStatusEnum } from "../../enum/templateNoteEnum";

const Deals: React.FC = () => {
  const [value, setValue] = useState<string>(PackageBiddingStatusEnum.active);

  const tabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  return (
    <div className={style.parent}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={tabChange} aria-label="lab API tabs example">
              <Tab label={PackageBiddingStatusEnum.active} value={PackageBiddingStatusEnum.active} />
              <Tab label={PackageBiddingStatusEnum.pending} value={PackageBiddingStatusEnum.pending} />
              <Tab label={PackageBiddingStatusEnum.closed} value={PackageBiddingStatusEnum.closed} />
            </TabList>
          </Box>
          <TabPanel value={PackageBiddingStatusEnum.active}>Item One</TabPanel>
          <TabPanel value={PackageBiddingStatusEnum.pending}>Item Two</TabPanel>
          <TabPanel value={PackageBiddingStatusEnum.closed}>Item Three</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default Deals;
