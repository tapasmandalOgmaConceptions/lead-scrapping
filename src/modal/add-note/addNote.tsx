/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./addNote.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, ErrorMessage, FormikProps, Field } from "formik";
import * as Yup from "yup";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";
import {
  AddNote,
  AddNoteModalProps,
  AddNotePayload,
} from "../../interfaces/leadScrapeInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AddNotes: React.FC<AddNoteModalProps> = ({ open, onClose, leadId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<AddNote>>(null);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  useEffect(() => {
    formikRef.current?.resetForm();
  }, [leadId]);
  const initialValue: AddNote = {
    note: "",
  };
  const validationSchema = Yup.object().shape({
    note: Yup.string().required("Note is required").min(5, 'Minimum character must be 5 digit'),
  });
  const handleSubmit = async (values: AddNote) => {
    const payload: AddNotePayload = {
      notes: values.note,
      lead_id: leadId,
      created_by: userInfo?.id || "",
    };
    setLoading(true);
    try {
      const res = await api.post(endpoints.leadScrape.addNote, payload);
      if(res.status === 200){
        alert(res.data.message, "success");
        onClose()
      }
    } catch (err: any) {
        alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
        setLoading(false);
    }
  };
  return (
    <Dialog      
      open={open}
      keepMounted
      onClose={() => onClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={styles.modalBodyPart}>
        <DialogTitle>Add Note</DialogTitle>
        <span className={styles.closeIcon} onClick={() => onClose()}>
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
                <div className={styles.addnotePoprow}>
                  <label>Note</label>
                  <Field as="textarea" name="note" rows="5" cols="40" />
                  <ErrorMessage
                    name="note"
                    component="p"
                    className={styles.errorMessage}
                  />
                </div>

                <br />
                <div>
                  <Button
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    className={`${styles.mRight2} disableBtnStyle`}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    className="disableBtnStyle"
                    onClick={() => onClose()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddNotes;
