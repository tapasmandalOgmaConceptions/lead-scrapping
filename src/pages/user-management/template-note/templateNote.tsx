import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
    <div>
      <div>
        <div className="section_heading">
          <h3>Deal</h3>
          {sectionName !== TemplateNoteEnum.DEAL && (
            <span onClick={() => editSection(TemplateNoteEnum.DEAL)}>
              <EditIcon />
            </span>
          )}
          {sectionName === TemplateNoteEnum.DEAL && (
            <>
              <span onClick={cancelEditSection}>
                <CancelIcon />
              </span>
              <span onClick={() => saveSection(TemplateNoteEnum.DEAL)}>
                <CheckCircleIcon />
              </span>
            </>
          )}
        </div>
        {sectionName !== TemplateNoteEnum.DEAL && (
          <div className="view_info">
            <p>view information</p>
          </div>
        )}
        {sectionName === TemplateNoteEnum.DEAL && (
          <div className="edit_info">
            <Formik
              initialValues={initialDealFormValue}
              validationSchema={dealFormValidationSchema}
              onSubmit={(val) => console.log(val)}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div>
                    <span>
                      <label>Client Name</label>
                      <Field
                        name="client_name"
                        placeholder="Enter Client Name"
                      />
                      <ErrorMessage name="client_name" component="p" />
                    </span>
                    <span>
                      <label>Primary Contact Name</label>
                      <Field
                        name="primary_contact_name"
                        placeholder="Enter Primary Contact Name"
                      />
                      <ErrorMessage name="primary_contact_name" component="p" />
                    </span>
                    <span>
                      <label>Primary Contact Email</label>
                      <Field
                        name="primary_contact_email"
                        placeholder="Enter Primary Contact Email"
                      />
                      <ErrorMessage
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
                      <ErrorMessage
                        name="primary_contact_phone"
                        component="p"
                      />
                    </span>
                  </div>
                  <div>
                    <span>
                      <label>Industry</label>
                      <Field name="industry" placeholder="Enter Industry" />
                      <ErrorMessage name="industry" component="p" />
                    </span>
                    <span>
                      <label>Sector Package</label>
                      <Field
                        name="sector_package"
                        placeholder="Enter Sector Package"
                      />
                      <ErrorMessage name="sector_package" component="p" />
                    </span>
                    <span>
                      <label>Deal Name</label>
                      <Field name="deal_name" placeholder="Enter Deal Name" />
                      <ErrorMessage name="deal_name" component="p" />
                    </span>
                    <span>
                      <label>Sale Person Name</label>
                      <Field
                        name="salesperson_name"
                        placeholder="Enter Sale Person Name"
                      />
                      <ErrorMessage name="salesperson_name" component="p" />
                    </span>
                  </div>
                  <div>
                    <span>
                      <label>Deal Close date</label>
                      <Field name="deal_close_date" type="date" />
                      <ErrorMessage name="deal_close_date" component="p" />
                    </span>
                    <span>
                      <label>Expected Start Date (Optional)</label>
                      <Field
                        name="expected_start_date"
                        type="date"
                      />
                      <ErrorMessage name="expected_start_date" component="p" />
                    </span>
                   <span>
                      <label>Expected End Date or Deadline (Optional)</label>
                      <Field
                        name="expected_end_date_or_deadline"
                        type="date"
                      />
                      <ErrorMessage name="expected_end_date_or_deadline" component="p" />
                    </span>
                    <span>
                      <label>Client Approved Scope Summary</label>
                      <Field
                        name="client_approved_scope_summary"
                        placeholder="Enter Client Approved Scope Summary"
                      />
                      <ErrorMessage name="client_approved_scope_summary" component="p" />
                    </span>
                  </div>
                  <div>
                    <span>
                      <label>Special Terms (Optional)</label>
                      <Field
                        name="special_terms"
                        placeholder="Enter Special Terms"
                      />
                      <ErrorMessage name="special_terms" component="p" />
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
