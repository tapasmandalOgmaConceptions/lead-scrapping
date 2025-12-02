import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "../view-lead/viewLead.module.scss";
import { DealClientForm } from "../../../interfaces/templateNoteInterface";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TemplateNoteEnum } from "../../../enum/templateNoteEnum";

const ViewAndEditTemplateNote: React.FC = () => {
  const [sectionName, setSectionName] = useState<TemplateNoteEnum | null>(null);
  const initialDealFormValue: DealClientForm = {
    client_name: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    industry: "",
    sector_package: "",
    deal_name: "",
    salesperson_name: "",
    deal_close_date: "",
    expected_start_date: "",
    expected_end_date_or_deadline: "",
    client_approved_scope_summary: "",
    special_terms: "",
  };
  const dealFormValidationSchema = Yup.object().shape({
    client_name: Yup.string()
      .required("Client name is required")
      .min(3, "Too short!"),
    primary_contact_name: Yup.string()
      .required("Primary contact name is required")
      .min(3, "Too short!"),
    primary_contact_email: Yup.string()
      .email("Invalid email format")
      .required("Primary contact email is required"),
    primary_contact_phone: Yup.string(),
    industry: Yup.string().required("Industry is required"),
    sector_package: Yup.string().required("Sector package is required"),
    deal_name: Yup.string().required("Deal name is required"),
    salesperson_name: Yup.string().required("sales person name is required"),
    deal_close_date: Yup.string().required("Deal close date is required"),
    expected_start_date: Yup.string(),
    expected_end_date_or_deadline: Yup.string(),
    client_approved_scope_summary: Yup.string().required(
      "Client approved scope summary is required"
    ),
    special_terms: Yup.string(),
  });
  const editSection = (sectionName: TemplateNoteEnum) => {
    setSectionName(sectionName);
  };
  const cancelEditSection = () => {
    setSectionName(null);
  };
  const saveSection = (sectionName: TemplateNoteEnum) => {
    setSectionName(sectionName);
  };

  return (
    <div className={styles.LeadcolRow}>
      <div className={styles.LeaddetailsCol}>
        <div className={styles.sectionHeading}>
          <h2>Deal</h2>
          {sectionName !== TemplateNoteEnum.DEAL && (
            <span className={styles.editBtn} onClick={() => editSection(TemplateNoteEnum.DEAL)}>
              Edit <EditIcon />
            </span>
          )}
          {sectionName === TemplateNoteEnum.DEAL && (
            <>
              <span className={styles.cancelBtn} onClick={cancelEditSection}>
                 Cancel <CancelIcon />
              </span>              
            </>
          )}
        </div>
        {sectionName !== TemplateNoteEnum.DEAL && (
          <div className={styles.viewInfo}>
             <div className={styles.editInfoCol}>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
             </div>  
              <div className={styles.editInfoCol}>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
             </div>
              <div className={styles.editInfoCol}>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span className={styles.borderRight}>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
                <span>
                  <label>Client Name</label>
                  <p>Client Name Here</p>
                </span>
             </div>          
          </div>
        )}
        {sectionName === TemplateNoteEnum.DEAL && (
          <div className={styles.editInfo}>
            <Formik
              initialValues={initialDealFormValue}
              validationSchema={dealFormValidationSchema}
              onSubmit={(val) => console.log(val)}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className={styles.editInfoCol}>
                    <span>
                      <label>Client Name</label>
                      <Field
                        name="client_name"
                        placeholder="Enter Client Name"
                      />
                      <ErrorMessage className={styles.error} name="client_name" component="p" />
                    </span>
                    <span>
                      <label>Primary Contact Name</label>
                      <Field
                        name="primary_contact_name"
                        placeholder="Enter Primary Contact Name"
                      />
                      <ErrorMessage className={styles.error} name="primary_contact_name" component="p" />
                    </span>
                    <span>
                      <label>Primary Contact Email</label>
                      <Field
                        name="primary_contact_email"
                        placeholder="Enter Primary Contact Email"
                      />
                      <ErrorMessage className={styles.error}
                        name="primary_contact_email"
                        component="p"
                      />
                    </span>
                    <span>
                      <label>Primary Contact Phone (Optional)</label>
                      <Field
                        name="primary_contact_phone"
                        placeholder="Enter Primary Contact Phone"
                      />
                      <ErrorMessage className={styles.error}
                        name="primary_contact_phone"
                        component="p"
                      />
                    </span>
                  </div>
                  <div className={styles.editInfoCol}>
                    <span>
                      <label>Industry</label>
                      <Field name="industry" placeholder="Enter Industry" />
                      <ErrorMessage className={styles.error} name="industry" component="p" />
                    </span>
                    <span>
                      <label>Sector Package</label>
                      <Field
                        name="sector_package"
                        placeholder="Enter Sector Package"
                      />
                      <ErrorMessage className={styles.error} name="sector_package" component="p" />
                    </span>
                    <span>
                      <label>Deal Name</label>
                      <Field name="deal_name" placeholder="Enter Deal Name" />
                      <ErrorMessage className={styles.error} name="deal_name" component="p" />
                    </span>
                    <span>
                      <label>Sale Person Name</label>
                      <Field
                        name="salesperson_name"
                        placeholder="Enter Sale Person Name"
                      />
                      <ErrorMessage className={styles.error} name="salesperson_name" component="p" />
                    </span>
                  </div>
                  <div className={styles.editInfoCol}>
                    <span>
                      <label>Deal Close date</label>
                      <Field name="deal_close_date" type="date" />
                      <ErrorMessage className={styles.error} name="deal_close_date" component="p" />
                    </span>
                    <span>
                      <label>Expected Start Date (Optional)</label>
                      <Field
                        name="expected_start_date"
                        type="date"
                      />
                      <ErrorMessage className={styles.error} name="expected_start_date" component="p" />
                    </span>
                   <span>
                      <label>Expected End Date or Deadline (Optional)</label>
                      <Field
                        name="expected_end_date_or_deadline"
                        type="date"
                      />
                      <ErrorMessage className={styles.error} name="expected_end_date_or_deadline" component="p" />
                    </span>
                    <span>
                      <label>Client Approved Scope Summary</label>
                      <Field
                        name="client_approved_scope_summary"
                        placeholder="Enter Client Approved Scope Summary"
                      />
                      <ErrorMessage className={styles.error} name="client_approved_scope_summary" component="p" />
                    </span>
                  </div>
                  <div className={styles.editInfoCol}>
                    <span>
                      <label>Special Terms (Optional)</label>
                      <Field
                        name="special_terms"
                        placeholder="Enter Special Terms"
                      />
                      <ErrorMessage className={styles.error} name="special_terms" component="p" />
                    </span>
                    <span className={styles.submitBtn} onClick={() => saveSection(TemplateNoteEnum.DEAL)}>
                      Submit 
                      {/* <CheckCircleIcon /> */}
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
      <div>
        <div className="section_heading">
          <h3>Work package</h3>
          {sectionName !== TemplateNoteEnum.WORK_PACKAGE && (
            <span onClick={() => editSection(TemplateNoteEnum.WORK_PACKAGE)}>
              <EditIcon />
            </span>
          )}
          {sectionName === TemplateNoteEnum.WORK_PACKAGE && (
            <>
              <span onClick={cancelEditSection}>
                <CancelIcon />
              </span>
              <span onClick={() => saveSection(TemplateNoteEnum.WORK_PACKAGE)}>
                <CheckCircleIcon />
              </span>
            </>
          )}
        </div>
        {sectionName !== TemplateNoteEnum.WORK_PACKAGE && (
          <div className="view_info">
            <p>view Work information</p>
          </div>
        )}
        {sectionName === TemplateNoteEnum.WORK_PACKAGE && (
          <div className="edit_info">edit work information</div>
        )}
      </div>
    </div>
  );
};
export default ViewAndEditTemplateNote;
