/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./technicianBidding.module.scss";
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
  Bidding,
  BiddingModalProps,
  TechnicianBiddingPayload,
} from "../../interfaces/templateNoteInterface";
import { NumericFormat } from "react-number-format";

const TechnicianBidding: React.FC<BiddingModalProps> = ({
  open,
  onClose,
  packageId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<Bidding>>(null);
  useEffect(() => {
    if (open) {
      formikRef.current?.resetForm();
      // getBiddingData();
    }
  }, [packageId, open]);
  const initialValue: Bidding = {
    note: "",
    bidding_amount: "",
  };
  const validationSchema = Yup.object().shape({
    bidding_amount: Yup.number()
      .required("Bidding amount is required")
      .min(0.1, "Minimum value must be greater than 0"),
    note: Yup.string()
      .required("Note is required")
      .min(5, "Minimum character must be 5 digit"),
  });
  const handleSubmit = async (values: Bidding) => {
    const payload: TechnicianBiddingPayload = {
      note: values.note,
      work_package_id: packageId,
      bidding_amount: values.bidding_amount || "",
    };
    setLoading(true);
    try {
      const res = await api.post(endpoints.technician.saveBidding, payload);
      if (res.status === 200) {
        alert(res.data.message, "success");
        onClose(true);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  // const getBiddingData = async () => {
  //   try {
  //     const res = await api.get(
  //       `${endpoints.technician.getBidding}?work_package_id=${packageId}&technician_id=${userInfo?.id}`
  //     );
  //     if (res.status === 200) {
  //       const data: Bidding = res.data;
  //       formikRef.current?.setValues({
  //           bidding_amount: data.bidding_amount || "",
  //           note: data.note || ""
  //       });
  //     }
  //   } catch (err: any) {
  //     alert(err?.response?.data?.detail || err?.message, "error");
  //   }
  // };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => onClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={styles.modalBodyPart}>
        <DialogTitle>Add your bid</DialogTitle>
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
            {({ values, setFieldValue, setFieldTouched }) => (
              <Form>
                <div className={styles.addnotePoprow}>
                  <div>
                    <label>Bidding Amount</label>
                    <Field name="bidding_amount">
                      {({ field, form }: any) => (
                        <NumericFormat
                          value={field.value}
                          thousandSeparator=","
                          decimalScale={2}
                          fixedDecimalScale={true}
                          prefix={field.value ? "$" : ""}
                          allowNegative={false}
                          placeholder="Enter Bidding Amount"
                          onValueChange={(values) => {
                            form.setFieldValue(
                              field.name,
                              values.floatValue ?? ""
                            );
                          }}
                          onBlur={() => setFieldTouched("bidding_amount", true)}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="bidding_amount"
                      component="p"
                      className={styles.errorMessage}
                    />
                  </div>
                  <div>
                    <label>Note</label>
                    <Field as="textarea" name="note" rows="5" cols="40" />
                    <ErrorMessage
                      name="note"
                      component="p"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>

                <br />
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    className={`${styles.addBidBtn} disableBtnStyle`}
                    disabled={loading}
                  >
                    Add bid
                  </Button>
                  <Button
                    className={`${styles.cancelBtn} disableBtnStyle`}
                    type="button"
                    variant="contained"
                    color="error"
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
export default TechnicianBidding;
