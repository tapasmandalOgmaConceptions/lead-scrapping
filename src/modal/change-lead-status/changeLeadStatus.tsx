/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./changeLeadStatus.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";
import {
  ChangeLeadStatusModalProps,
  LeadStatus,
} from "../../interfaces/leadScrapeInterface";

const ChangeLeadStatus: React.FC<ChangeLeadStatusModalProps> = ({
  open,
  onClose,
  leadId,
  confirmLeadStatusModal,
  leadStatus,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<LeadStatus>>(null);
  useEffect(() => {
    if (leadStatus === "Not interested" || leadStatus === "Positive lead") {
      formikRef.current?.setFieldValue("status", leadStatus);
    } else {
      formikRef.current?.setFieldValue("status", "");
    }
  }, [leadStatus, leadId]);
  const initialValue: LeadStatus = {
    status: "",
  };
  const validationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
  });
  const handleSubmit = async (value: LeadStatus) => {
    setLoading(true);
    try {
      const res = await api.put(
        `${endpoints.leadScrape.changeLeadStatus(leadId)}?status=${
          value.status
        }`
      );
      if (res.status === 200) {
        alert(res.data?.message, "success");
        confirmLeadStatusModal();
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
          <DialogTitle>Change Lead Status</DialogTitle>
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
            >
              {({ setFieldValue }) => (
                <Form>
                  <div>
                    <label>Status</label>
                    <Field as="select" style={{ height: "50px" }} name="status">
                      <option value="">Select an option</option>
                      <option value="Positive lead">Positive lead</option>
                      <option value="Not interested">Not interested</option>
                    </Field>
                    <ErrorMessage
                      name="status"
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
                      className={styles.mRight2}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      Change
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
export default ChangeLeadStatus;
