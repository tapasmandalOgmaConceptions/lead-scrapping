import { UserListInterface } from "./userInterface";

export interface DealClientForm {
  client_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  industry: string;
  sector_package_id: string;
  deal_name: string;
  salesperson_name: string;
  deal_close_date: string;
  expected_start_date: string;
  expected_end_date_or_deadline: string;
  client_approved_scope_summary: string;
  special_terms: string;
  custom_sector_package: string;
}

export interface WorkPackage {
  id: string;
  package_title: string;
  package_type: string;
  package_summary: string;
  key_deliverables: string;
  acceptance_criteria: string;
  required_skills: string[];
  primary_tools: string[];
  package_estimated_complexity: string;
  package_price_allocation: string;
  dependencies: string[];
  custom_package_type: string;
  required_tools: string[];
  bidding_duration_days: string;
}
export interface WorkPackages {
  work_packages: WorkPackage[];
}

export interface TechnicalContext {
  client_main_systems: string;
  integration_targets: string;
  tools_in_scope: string;
  access_required_list: string;
  credential_provision_method: string;
}
export interface CommunicationContact {
  client_project_contact_name: string;
  client_project_contact_email: string;
  preferred_channel: string;
  update_frequency: string;
}

export interface InternalNote {
  internal_risks_and_warnings: string;
  internal_margin_sensitivity: string;
  internal_notes: string;
}

export interface TemplateNote {
  section_tag: string;
  content: any;
  progress_stage: "draft" | "in_progress" | "completed" | string;
}

export interface DealSectorPackage {
  id: string;
  name: string;
}

export interface DealResponse {
  id: string;
  client_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  industry: string;
  sector_package: { id: string; name: string };
  deal_name: string;
  salesperson_name: string;
  deal_close_date: string;
  expected_start_date: string;
  expected_end_date_or_deadline: string;
  client_approved_scope_summary: string;
  special_terms: string;
  custom_sector_package: string;
}
export interface TechnicalContextResponse {
  id?: string;
  deal_id: string;
  client_main_systems: string;
  integration_targets: string;
  tools_in_scope: string;
  access_required_list: string;
  credential_provision_method: string;
}
export interface InternalNoteResponse {
  id?: string;
  deal_id: string;
  internal_risks_and_warnings: string;
  internal_margin_sensitivity: string;
  internal_notes: string;
}
export interface ToolsAndSkillsInterface {
  id: string;
  name: string;
  value: string;
  label: string;
}
export interface WorkPackagePayload {
  id?: string;
  package_title: string;
  package_type_id: number;
  package_summary: string;
  key_deliverables: string;
  acceptance_criteria: string;
  required_skills_ids: number[];
  primary_tools_ids: number[];
  package_estimated_complexity: string;
  package_price_allocation: string | null;
  dependencies_ids: Number[];
  custom_package_type: string;
  required_tools_ids: number[];
  bidding_duration_days: number;
}
export interface WorkPackageResponse {
  id: string;
  package_title: string;
  package_type: { id: string; name: string};
  package_summary: string;
  key_deliverables: string;
  acceptance_criteria: string;
  required_skills: SkillsAndPrimaryTools[];
  primary_tools: SkillsAndPrimaryTools[];
  package_estimated_complexity: string;
  package_price_allocation: string | null;
  dependencies: SkillsAndPrimaryTools[];
  custom_package_type: string;
  required_tools: SkillsAndPrimaryTools[];
  bidding_duration_days: number;
  assigned_technician: UserListInterface | null
}
export interface SkillsAndPrimaryTools {
  id: number;
  name: string;
  created_at: string;
}
export interface templateNoteStatus  {
  deal: boolean,
  workPackage: boolean,
  technicalContext: boolean,
  communication: boolean,
  internalNote: boolean
};
