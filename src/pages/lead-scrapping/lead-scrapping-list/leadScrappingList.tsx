/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import styles from "./leadScrappingList.module.scss";
import api from "../../../services/api";
import Pagination from "@mui/material/Pagination";
import alert from "../../../services/alert";
import endpoints from "../../../helpers/endpoints";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage, Field } from "formik";
import {
  LeadListResponse,
  LeadScrape,
} from "../../../interfaces/leadScrapeInterface";
import Button from "@mui/material/Button";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";

const LeadScrappingList: React.FC = () => {
  const [leads, setLeads] = useState<LeadListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLeadScrapping, setIsLeadScrapping] = useState<boolean>(false);
  const [isCityFetching, setIsCityFetching] = useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);

  useEffect(() => {
    getLeadList();
  }, [page, size, city, sector]);

  const getLeadList = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.leadScrape.leadList}?page=${page}&limit=${size}${
          city ? `&city=${city}` : ""
        }${sector ? `&sector=${sector}` : ""}`
      );
      if (res.status === 200) {
        setLeads(res.data?.data?.leads || []);
        setTotalPage(res.data?.data?.meta.pages || 0);
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
    city: Yup.string().required("City is required"),
    sector: Yup.string().required("Sector is required"),
  });
  const handleSearch = async (value: LeadScrape) => {
    setIsLeadScrapping(true);
    try {
      const res = await api.post(
        `${endpoints.leadScrape.createLeadScrape}?city=${value.city}&sector=${value.sector}`
      );
      if (res.status === 200) {
        setPage(1);
        setCity(value.city);
        setSector(value.sector);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setIsLeadScrapping(false);
    }
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

  return (
    <>
      <div className={styles.productListBdyPrt}>
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>Lead Scrapping</h1>
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
                        <li className={styles.productSearchField}>
                          <Field name="sector" placeholder="Search by sector" />
                          <img
                            src="images/search-icon.svg"
                            alt="search icon"
                            className={styles.productSrchIcon}
                          />
                          <ErrorMessage
                            name="sector"
                            component="p"
                            className={styles.errorMessage}
                          />
                        </li>
                        <li>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isLeadScrapping}
                          >
                            Scrape
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
                <li>Email</li>
                <li>Phone No</li>
                <li>City</li>
                <li>Address</li>
                <li>Lead Status</li>
                <li>sector</li>
                <li>summary</li>
              </ul>
            </div>
            {leads.map((user, ind) => (
              <div className={styles.tableRow} key={ind}>
                <ul>
                  <li data-label="Created At">
                    <p>
                      {moment(user.created_at).format("MM-DD-YYYY h:mm:ss a")}
                    </p>
                  </li>

                  <li data-label="Email">
                    <p>{user.email}</p>
                  </li>
                  <li data-label="Phone No">
                    <p>{user.phone}</p>
                  </li>
                  <li data-label="City">
                    <p>{user.city}</p>
                  </li>
                  <li data-label="Address">
                    <p>{user.address}</p>
                  </li>
                  <li data-label="Lead Status">
                    <p>{user.lead_status}</p>
                  </li>
                  <li data-label="sector">
                    <p>{user.sector}</p>
                  </li>
                  <li data-label="Summary">
                    <p>{user.summary}</p>
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

export default LeadScrappingList;
