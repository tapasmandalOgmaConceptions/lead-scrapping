/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import styles from "./homePage.module.scss";
import api from "../../services/api";
import Pagination from "@mui/material/Pagination";
import alert from "../../services/alert";
import endpoints from "../../helpers/endpoints";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import {
  LeadListResponse,
  LeadScrape,
  SectorListResponse,
} from "../../interfaces/leadScrapeInterface";
import Button from "@mui/material/Button";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const FollowUp: React.FC = () => {
  const [leads, setLeads] = useState<LeadListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCityFetching, setIsCityFetching] = useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<SectorListResponse[]>([]);
  const [isSectorFetching, setIsSectorFetching] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    getSectors();
  }, []);
  useEffect(() => {
    getFollowUpLeadList();
  }, [page, size, city, sector]);

  const getFollowUpLeadList = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.user.assignUserLead}?page=${page}&limit=${size}${
          city ? `&city=${city}` : ""
        }${sector ? `&sector=${sector}` : ""}${
          !userInfo?.isAdmin ? `&user_id=${userInfo?.id}` : ""
        }&is_followup=true`
      );
      if (res.status === 200) {
        setLeads(res.data?.data || []);
        setTotalPage(res.data?.meta?.pages || 0);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const initialSearchValue: LeadScrape = {
    city: "",
    sector: "",
  };
  const validationSchema = Yup.object().shape({
    city: Yup.string(),
    sector: Yup.string(),
  });
  const handleSearch = (value: LeadScrape) => {
    setPage(1);
    setCity(value.city || "");
    setSector(value.sector || "");
  };
  const fetchCitySuggestions = async (query: string) => {
    if (!query) return;
    setIsCityFetching(true);
    try {
      const res = await api.get(
        `${endpoints.leadScrape.getCityList}?keyword=${query}`
      );
      if (res.status === 200) {
        const uniqueTitles = Array.from(
          new Map(
            res.data?.data.cities.map((item: any) => [item.title, item])
          ).values()
        );

        setCitySuggestions(uniqueTitles);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setIsCityFetching(false);
    }
  };

  const debouncedFetchCitySuggestions = useCallback(
    debounce(fetchCitySuggestions, 500),
    []
  );
  const getSectors = async (keyword?: string) => {
    setIsSectorFetching(true);
    try {
      const res = await api.get(
        `${endpoints.leadScrape.getSectors}?limit=20&page=1${
          keyword ? `&keyword=${keyword}` : ""
        }`
      );
      if (res.status === 200) {
        const sectorsData = res.data?.data?.sectors || [];
        const uniqueTitles = Array.from(
          new Map(sectorsData.map((item: any) => [item.name, item])).values()
        ) as SectorListResponse[];

        setSectors(uniqueTitles);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setIsSectorFetching(false);
    }
  };
  const debouncedFetchSectorSuggestions = useCallback(
    debounce(getSectors, 500),
    []
  );

  return (
    <>
      <div className={styles.productListBdyPrt}>
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>Followup Leads</h1>
              </div>
              <div className={styles.productListRightPrt}>
                <Formik
                  initialValues={initialSearchValue}
                  validationSchema={validationSchema}
                  onSubmit={handleSearch}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <ul>
                        <li>
                          <Autocomplete
                            freeSolo
                            options={citySuggestions?.map(
                              (option) => option?.title
                            )}
                            onInputChange={(event, value) => {
                              debouncedFetchCitySuggestions(value);
                              setFieldValue("city", value);
                            }}
                            loading={isCityFetching}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="city"
                                placeholder="Search by city"
                                variant="outlined"
                              />
                            )}
                          />
                          <ErrorMessage
                            name="city"
                            component="p"
                            className={styles.errorMessage}
                          />
                        </li>
                        <li>
                          <Autocomplete
                            freeSolo
                            options={sectors?.map((option) => option?.name)}
                            onInputChange={(event, value) => {
                              debouncedFetchSectorSuggestions(value);
                              setFieldValue("sector", value);
                            }}
                            loading={isSectorFetching}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="sector"
                                placeholder="Search by sector"
                                variant="outlined"
                              />
                            )}
                          />
                          <ErrorMessage
                            name="sector"
                            component="p"
                            className={styles.errorMessage}
                          />
                        </li>
                        <li>
                          <Button type="submit" variant="contained">
                            Search
                          </Button>
                        </li>
                      </ul>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productListViewPrt}>
          <div className={styles.container}>
            <div className={styles.tableHead}>
              <ul>
                <li>Created At</li>
                {/* <li>Email</li> */}
                <li className={styles.phoneSec}>Phone No</li>
                <li>City</li>
                <li>Address</li>
                <li>Lead Status</li>
                <li>sector</li>
                <li>summary</li>
              </ul>
            </div>
            {leads.map((lead) => (
              <div className={styles.tableRow} key={lead.id}>
                <ul>
                  <li data-label="Created At">
                    <p>
                      {moment(lead.created_at).format("MM-DD-YYYY h:mm:ss a")}
                    </p>
                  </li>

                  {/* <li data-label="Email">
                    <p>{lead.email}</p>
                  </li> */}
                  <li data-label="Phone No">
                    <p>{lead.phone}</p>
                  </li>
                  <li data-label="City">
                    <p>{lead.city}</p>
                  </li>
                  <li data-label="Address">
                    <p>{lead.address}</p>
                  </li>
                  <li data-label="Lead Status">
                    <p>{lead.lead_status}</p>
                  </li>
                  <li data-label="sector">
                    <p>{lead.sector}</p>
                  </li>
                  <li data-label="Summary">
                    <p>{lead.summary}</p>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.container}>
          {leads.length === 0 && !loading && (
            <p className={styles.loader}>No lead available.</p>
          )}
          {loading && <p className={styles.loader}>Please wait...</p>}
          {leads.length > 0 && (
            <Pagination
              className="product-pagination"
              variant="outlined"
              shape="rounded"
              count={totalPage}
              page={page}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FollowUp;
