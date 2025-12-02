export interface DealClientForm {
  client_name: string;            
  primary_contact_name: string;   
  primary_contact_email: string;  
  primary_contact_phone: string;
  industry: string;
  sector_package: string;
  deal_name: string;
  salesperson_name: string;
  deal_close_date: string;
  expected_start_date: string;
  expected_end_date_or_deadline: string;
  client_approved_scope_summary: string;
  special_terms: string
};

export interface WorkPackage {
  package_title: string;
  package_type: string;
  package_summary: string;
  key_deliverables: KeyDeliverable[];
  acceptance_criteria: AcceptanceCriteria[];
  required_skills: SkillRequirement[];
  primary_tools?: string[];
  package_estimated_complexity: string 
  package_price_allocation?: number;
  dependencies?: string[];
};

export interface TechnicalContext {
  client_main_systems: string[];
  integration_targets: string[];
  tools_in_scope: string[];
  access_required_list: string[];
  credential_provision_method: string;
}
export interface ProjectCommunicationContact {
  client_project_contact_name: string;
  client_project_contact_email: string;
  preferred_channel: 'EMAIL' | 'SLACK' | 'TEAMS' | 'MEETING' | string;
  update_frequency: 'DAILY' | 'WEEKLY' | 'BI_WEEKLY' | 'AS_NEEDED' | string;
}

export interface InternalNote {
  internal_risks_and_warnings: string;
  internal_margin_sensitivity: "Low" | "Medium" | "High" | string;
  internal_notes: string
}

export interface TemplateNote {
  section_tag: string;
  content: any;
  progress_stage: "draft" | "in_progress" | "completed" | string;
}

interface KeyDeliverable {
  name: string;
  description: string;
}

interface AcceptanceCriteria {
  criterion: string;
  metric?: string;
}

interface SkillRequirement {
  skill: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
}