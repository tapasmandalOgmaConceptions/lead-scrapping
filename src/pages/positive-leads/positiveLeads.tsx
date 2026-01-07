/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import styles from "./positiveLeads.module.scss";
import api from "../../services/api";
import Pagination from "@mui/material/Pagination";
import alert from "../../services/alert";
import endpoints from "../../helpers/endpoints";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import {
  LeadListResponse,
  PositiveLeadSearch,
  SectorListResponse,
} from "../../interfaces/leadScrapeInterface";
import Button from "@mui/material/Button";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import AddNotes from "../../modal/add-note/addNote";
import { UserListInterface, UserRole } from "../../interfaces/userInterface";

const PositiveLeads: React.FC = () => {
  const [leads, setLeads] = useState<LeadListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCityFetching, setIsCityFetching] = useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<SectorListResponse[]>([]);
  const [isSectorFetching, setIsSectorFetching] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [addNoteModalOpen, setAddNoteModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserListInterface[]>([]);
  const [isUserFetching, setIsUserFetching] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo?.isAdmin) getSalesUsers();
    getSectors();
  }, []);
  useEffect(() => {
    userInfo?.role === "Technician"
      ? getTechnicianLeadList()
      : getFollowUpLeadList();
  }, [page, size, city, sector, selectedUser]);

  const getFollowUpLeadList = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.user.assignUserLead}?page=${page}&limit=${size}${
          city ? `&city=${city}` : ""
        }${sector ? `&sector=${sector}` : ""}${
          !userInfo?.isAdmin
            ? `&user_id=${userInfo?.id}`
            : selectedUser
            ? `&user_id=${selectedUser}`
            : ""
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
  const getTechnicianLeadList = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.technician.getTechniciansLead}?page=${page}&limit=${size}${
          city ? `&city=${city}` : ""
        }${sector ? `&sector=${sector}` : ""}`
      );
      if (res.status === 200) {
        setLeads(res.data?.data?.leads || []);
        setTotalPage(res.data?.data?.meta?.pages || 0);
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

  const initialSearchValue: PositiveLeadSearch = {
    city: "",
    sector: "",
    user: "",
  };
  const validationSchema = Yup.object().shape({
    city: Yup.string(),
    sector: Yup.string(),
    user: Yup.string(),
  });
  const handleSearch = (value: PositiveLeadSearch) => {
    setPage(1);
    setCity(value.city || "");
    setSector(value.sector || "");
    setSelectedUser(value.user || "");
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
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    leadId: string
  ) => {
    setActiveLeadId(leadId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveLeadId(null);
  };
  const navigateToViewLeadPage = (leadId: string) => {
    navigate(`/view-lead/${leadId}`);
  };
  const openAddNoteModal = (leadId: string) => {
    setAddNoteModalOpen(true);
    setSelectedLeadId(leadId);
  };
  const closeAddNoteModal = (isFetchApi = false) => {
    setAddNoteModalOpen(false);
    setSelectedLeadId("");
  };
  const getSalesUsers = async (keyword?: string) => {
    setIsUserFetching(true);
    try {
      const res = await api.get(
        `${endpoints.user.getUsers}?page=${1}&limit=${10}${
          keyword ? `&keyword=${keyword}` : ""
        }&role=User`
      );
      if (res.status === 200) {
        setUsers(res.data?.data?.users || []);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setIsUserFetching(false);
    }
  };
  const debouncedFetchUserSuggestions = useCallback(
    debounce(getSalesUsers, 500),
    []
  );

  return (
    <>
      <div className={styles.productListBdyPrt}>
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>Positive Leads</h1>
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
                            freeSolo={false}
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
                        {userInfo?.isAdmin && (
                          <li>
                            <Autocomplete
                              freeSolo={false}
                              options={users || []}
                              getOptionLabel={(option) => option?.name || ""}
                              onChange={(event, value) => {
                                if (value) {
                                  setFieldValue("user", value.id);
                                } else {
                                  setFieldValue("user", "");
                                }
                              }}
                              onInputChange={(event, value) => {
                                debouncedFetchUserSuggestions(value);
                              }}
                              loading={isUserFetching}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="user"
                                  placeholder="Search by user"
                                  variant="outlined"
                                />
                              )}
                            />
                            <ErrorMessage
                              name="user"
                              component="p"
                              className={styles.errorMessage}
                            />
                          </li>
                        )}
                        <li>
                          <Button type="submit" variant="contained" className="disableBtnStyle">
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
                <li>Sector</li>
                <li>Summary</li>
                <li>Action</li>
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
                  <li data-label="Action" className={styles.actionCell}>
                    <div>
                      <IconButton
                        className={styles.actionBtn}
                        aria-label="more"
                        id="long-button"
                        aria-controls={
                          activeLeadId === lead.id ? "long-menu" : undefined
                        }
                        aria-expanded={
                          activeLeadId === lead.id ? "true" : undefined
                        }
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, lead.id)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={activeLeadId === lead.id}
                        onClose={handleMenuClose}
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: 48 * 4.5,
                              width: "20ch",
                              borderRadius: "10px",
                            },
                          },
                          list: {
                            className: styles.actionDropDown,
                            "aria-labelledby": "long-button",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigateToViewLeadPage(lead.id);
                          }}
                        >
                          View Lead Details
                        </MenuItem>
                        {userInfo?.role &&
                          (["Admin", "Sales"] as UserRole[]).includes(userInfo?.role) && (
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                openAddNoteModal(lead.id);
                              }}
                            >
                              Add Note
                            </MenuItem>
                          )}
                      </Menu>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <AddNotes
          open={addNoteModalOpen}
          onClose={closeAddNoteModal}
          leadId={selectedLeadId}
        />

        <div className={styles.container}>
          {leads.length === 0 && !loading && (
            <p className={styles.loader}>No lead available.</p>
          )}
          {loading && <p className={styles.loader}>Please wait...</p>}
          {leads.length > 0 && (
            <Pagination
              className={styles.productPagination}
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

export default PositiveLeads;
