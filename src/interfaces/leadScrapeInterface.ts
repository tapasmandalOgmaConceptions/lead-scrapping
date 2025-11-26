export interface LeadScrape {
  sector: string;
  city: string;
}
export type LeadStatusType =
  | "new"
  | "Positive lead"
  | "Double Positive"
  | "Triple Positive"
  | "Not interested";
export interface UserInfo {
  id: string;
  name: string;
  role: string;
  email: string;
}
export interface LeadListResponse {
  id: string;
  created_at: string;
  city: string;
  address: string;
  // email: string;
  follow_up_status: string;
  lead_status: LeadStatusType;
  phone: string;
  sector: string;
  summary: string;
  assigned_technician?: UserInfo;
}
export interface ChangeLeadStatusModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  confirmLeadStatusModal: () => void;
  leadStatus: string;
}
export interface LeadStatus {
  status: string;
}
export interface SectorListResponse {
  id: string;
  name: string;
}
export interface AddNote {
  note: string;
}
export interface AddNoteModalProps {
  open: boolean;
  onClose: (isFetchApi?: boolean) => void;
  leadId: string;
}
export interface AddNotePayload {
  notes: string;
  lead_id: string;
  created_by: string;
}
export interface LeadNote {
  notes: string;
  created_at: string;
  id: string;
  updated_at: string;
  created_by_user: UserInfo;
}
