/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./assignUserModal.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  AssignUser,
  AssignUserModalProps,
} from "../../interfaces/userInterface";
import { Autocomplete, Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import debounce from "lodash/debounce";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";
import { SectorListResponse } from "../../interfaces/leadScrapeInterface";

const AssignUserModal: React.FC<AssignUserModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [isCityFetching, setIsCityFetching] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorListResponse[]>([]);
  const [isSectorFetching, setIsSectorFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<AssignUser>>(null);

  useEffect(() => {
    if (open) {
      formikRef.current?.resetForm();
      setCitySuggestions([]);
      setSectors([]);
      getSectors();
    }
  }, [open, userId]);
  const initialValue: AssignUser = {
    sector: "",
    city: "",
  };
  const validationSchema = Yup.object().shape({
    sector: Yup.string().required("Sector is required"),
    city: Yup.string().required("City is required"),
  });
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
  const handleSubmit = async (Value: AssignUser) => {
    setLoading(true);
    try {
      const payload = {
        ...Value,
        user_id: userId,
      };
      const res = await api.post(endpoints.user.assignUser, payload);
      if (res.status === 200) {
        alert(res.data?.message, "success");
        onClose();
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setLoading(false);
    }
  };
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
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={styles.modalBodyPart}>
          <DialogTitle>Assign City and Sector</DialogTitle>
          <span className={styles.closeIcon} onClick={onClose}>
            <CloseIcon />
          </span>
        </div>

        <DialogContent className="pt0s">
          <div>
            <Formik
              initialValues={initialValue}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              innerRef={formikRef}
              enableReinitialize
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div>
                    <label>City</label>
                    <Autocomplete
                      className={styles.autocompletefield}
                      freeSolo
                      options={citySuggestions?.map((option) => option?.title)}
                      inputValue={values.city}
                      onInputChange={(event, value) => {
                        setFieldValue("city", value);
                        debouncedFetchCitySuggestions(value);
                      }}
                      loading={isCityFetching}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select City"
                          variant="outlined"
                        />
                      )}
                    />
                    <ErrorMessage
                      name="city"
                      component="p"
                      className={styles.errorMessage}
                    />
                  </div>
                  <div>
                    <label>Sector</label>
                    <Autocomplete
                      className={styles.autocompletefield}
                      freeSolo
                      options={sectors?.map((option) => option?.name)}
                      inputValue={values.sector}
                      onInputChange={(event, value) => {
                        setFieldValue("sector", value);
                        debouncedFetchSectorSuggestions(value);
                      }}
                      loading={isSectorFetching}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Sector"
                          variant="outlined"
                        />
                      )}
                    />
                    <ErrorMessage
                      name="sector"
                      component="p"
                      className={styles.errorMessage}
                    />
                  </div>

                  <br />
                  <div>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={onClose}
                      disabled={loading}
                      className={`${styles.mRight2} disableBtnStyle`}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="disableBtnStyle"
                      disabled={loading}
                    >
                      Assign
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AssignUserModal;
