import * as Yup from "yup";
import {
  CommunicationContact,
  DealClientForm,
  InternalNote,
  TechnicalContext,
  WorkPackage,
  WorkPackages,
} from "../../../interfaces/templateNoteInterface";

export const dealInitialFormValue: DealClientForm = {
  client_name: "",
  primary_contact_name: "",
  primary_contact_email: "",
  primary_contact_phone: "",
  industry: "",
  sector_package_id: "",
  deal_name: "",
  salesperson_name: "",
  deal_close_date: "",
  expected_start_date: "",
  expected_end_date_or_deadline: "",
  client_approved_scope_summary: "",
  special_terms: "",
  custom_sector_package: "",
};
export const dealFormValidationSchema = Yup.object().shape({
  client_name: Yup.string()
    .required("Client name is required")
    .min(3, "Too short!"),
  primary_contact_name: Yup.string()
    .required("Primary contact name is required")
    .min(3, "Too short!"),
  primary_contact_email: Yup.string()
    .email("Invalid email format")
    .required("Primary contact email is required"),
  primary_contact_phone: Yup.string().matches(
    /^[0-9]{10}$/,
    "Enter a valid phone number"
  ),
  industry: Yup.string().required("Industry is required"),
  sector_package_id: Yup.string().required("Sector package is required"),
  deal_name: Yup.string().required("Deal name is required"),
  salesperson_name: Yup.string().required("sales person name is required"),
  deal_close_date: Yup.string().required("Deal close date is required"),
  expected_start_date: Yup.string(),
  expected_end_date_or_deadline: Yup.string(),
  client_approved_scope_summary: Yup.string().required(
    "Client approved scope summary is required"
  ),
  special_terms: Yup.string(),
  custom_sector_package: Yup.string().when("sector_package_id", {
    is: (val: string) => val === "12",
    then: (schema) =>
      schema.required(
        "Custom sector package is required when selecting Others"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
export const technicalContextInitialFormValue: TechnicalContext = {
  client_main_systems: "",
  integration_targets: "",
  tools_in_scope: "",
  access_required_list: "",
  credential_provision_method: "",
};
export const technicalContextFormValidationSchema = Yup.object().shape({
  client_main_systems: Yup.string().required("Client main system is required"),
  integration_targets: Yup.string(),
  tools_in_scope: Yup.string().required("Tools in scope is required"),
  access_required_list: Yup.string().required(
    "Access required list is required"
  ),
  credential_provision_method: Yup.string().required(
    "Credential provision method is required"
  ),
});
export const communicationInitialFormValue: CommunicationContact = {
  client_project_contact_name: "",
  client_project_contact_email: "",
  preferred_channel: "",
  update_frequency: "",
};
export const communicationFormValidationSchema = Yup.object().shape({
  client_project_contact_name: Yup.string()
    .required("Client project contact name is required")
    .min(3, "Too short!"),
  client_project_contact_email: Yup.string()
    .email("Invalid email format")
    .required("Client project contact email is required"),
  preferred_channel: Yup.string(),
  update_frequency: Yup.string(),
});
export const internalNoteInitialFormValue: InternalNote = {
  internal_risks_and_warnings: "",
  internal_margin_sensitivity: "",
  internal_notes: "",
};
export const internalNoteValidationSchema = Yup.object().shape({
  internal_risks_and_warnings: Yup.string(),
  internal_margin_sensitivity: Yup.string().required(
    "Margin sensitivity is required"
  ),
  internal_notes: Yup.string(),
});
export const workPackageValue: WorkPackage = {
  id: "",
  package_title: "",
  package_type: "",
  package_summary: "",
  key_deliverables: "",
  acceptance_criteria: "",
  required_skills: [],
  primary_tools: [],
  package_estimated_complexity: "",
  package_price_allocation: "",
  dependencies: [],
  custom_package_type: "",
  required_tools: [],
  bidding_duration_days: "",
};
export const workPackagesInitialFormValue: WorkPackages = {
  work_packages: [workPackageValue],
};
export const workPackageValidationSchema = Yup.object().shape({
  id: Yup.string(),
  package_title: Yup.string().required("Package title is required"),
  package_type: Yup.string().required("Package type is required"),
  package_summary: Yup.string().required("Package summary is required"),
  key_deliverables: Yup.string().required("Key deliverable is required"),
  acceptance_criteria: Yup.string().required("Acceptance criteria is required"),
  required_skills: Yup.array().min(1, "At least one skill is required"),
  primary_tools: Yup.array().min(1, "At least one primary tool is required"),
  package_estimated_complexity: Yup.string().required(
    "Package estimated complexity is required"
  ),
  package_price_allocation: Yup.string(),
  dependencies: Yup.array().min(1, "At least one dependency is required"),
  required_tools: Yup.array().min(1, "At least one required tools is required"),
  bidding_duration_days: Yup.number()
    .integer("Must be an integer")
    .required("Bidding duration is required")
    .min(1, "Minimum value must be 1"),
  custom_package_type: Yup.string().when("package_type", {
    is: (val: string) => val === "12",
    then: (schema) =>
      schema.required("Custom package is required when selecting Other"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
export const workPackagesFormValidationSchema = Yup.object().shape({
  work_packages: Yup.array()
    .of(workPackageValidationSchema)
    .min(1, "At least one work package is required"),
});
