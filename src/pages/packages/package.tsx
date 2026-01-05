/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import style from "./package.module.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  PackageTabsLabels,
  PackageTabsValue,
} from "../../enum/templateNoteEnum";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import alert from "../../services/alert";
import { WorkPackageResponse } from "../../interfaces/templateNoteInterface";
import PackageTable from "../../components/table/package/packageTable";
import { useNavigate } from "react-router-dom";

const Packages: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tabName, setTabName] = useState<PackageTabsValue>(
    PackageTabsValue.new
  );
  const [packages, setPackages] = useState<WorkPackageResponse[]>([]);
  const [keyWord, setKeyWord] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo?.role !== "Technician") {
      alert("Sorry you can't access this page", "error");
      navigate("/");
      return;
    }
    getPackages();
  }, [tabName, page, keyWord, size]);
  const tabChange = (
    event: React.SyntheticEvent,
    newValue: PackageTabsValue
  ) => {
    setPackages([]);
    setPage(1);
    setKeyWord("");
    setTabName(newValue);
  };
  const getPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${
          endpoints.technician.getPackages
        }?tab_name=${tabName}&page=${page}&limit=${size}${
          keyWord ? `&search=${keyWord}` : ""
        }`
      );
      if (res.status === 200) {
        setPackages(res.data?.data?.packages);
        setTotalPage(res.data?.data?.meta?.pages || 0);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const setPageValue = (value: number) => {
    setPage(value);
  };
  const setSearchKeyword = (value: string) => {
    setKeyWord(value);
  };

  return (
    <div className={style.parent}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabName}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <div className="packageTabMenu">
              <div className="container">
              <TabList 
                onChange={tabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label={PackageTabsLabels.new} value={PackageTabsValue.new} />
                <Tab
                  label={PackageTabsLabels.active}
                  value={PackageTabsValue.active}
                />
                <Tab
                  label={PackageTabsLabels.awarded}
                  value={PackageTabsValue.awarded}
                />
                <Tab
                  label={PackageTabsLabels.closed}
                  value={PackageTabsValue.closed}
                />
              </TabList>
              </div>
            </div>
          </Box>
          <TabPanel value={PackageTabsValue.new}>
            <PackageTable
              packages={packages}
              loading={loading}
              tabName={tabName}
              page={page}
              totalPage={totalPage}
              setPageValue={setPageValue}
              setKeyword={setSearchKeyword}
            />
          </TabPanel>
          <TabPanel value={PackageTabsValue.active}>
            <PackageTable
              packages={packages}
              loading={loading}
              tabName={tabName}
              page={page}
              totalPage={totalPage}
              setPageValue={setPageValue}
              setKeyword={setSearchKeyword}
            />
          </TabPanel>
          <TabPanel value={PackageTabsValue.awarded}>
            <PackageTable
              packages={packages}
              loading={loading}
              tabName={tabName}
              page={page}
              totalPage={totalPage}
              setPageValue={setPageValue}
              setKeyword={setSearchKeyword}
            />
          </TabPanel>
          <TabPanel value={PackageTabsValue.closed}>
            <PackageTable
              packages={packages}
              loading={loading}
              tabName={tabName}
              page={page}
              totalPage={totalPage}
              setPageValue={setPageValue}
              setKeyword={setSearchKeyword}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default Packages;
