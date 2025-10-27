/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import debounce from "lodash/debounce";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";

const AssignUserModal: React.FC<AssignUserModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [isCityFetching, setIsCityFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
          <span onClick={onClose}>
            <CloseIcon />
          </span>
        </div>

        <DialogContent>
          <div>
            <Formik
              initialValues={initialValue}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div>
                    <label>City</label>
                    <Autocomplete
                      freeSolo
                      options={citySuggestions?.map((option) => option?.title)}
                      onInputChange={(event, value) => {
                        debouncedFetchCitySuggestions(value);
                        setFieldValue("city", value);
                      }}
                      loading={isCityFetching}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="city"
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
                    <Field name="sector" placeholder="Search by sector" />
                    <ErrorMessage
                      name="sector"
                      component="p"
                      className={styles.errorMessage}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
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
