export interface LeadScrape {
  sector: string;
  city: string;
}
export interface LeadListResponse {
  id: string;
  created_at: string;
  city: string;
  address: string;
  // email: string;
  follow_up_status: string;
  lead_status: string;
  phone: string;
  sector: string;
  summary: string;
}
export interface ChangeLeadStatusModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  confirmLeadStatusModal: () => void;
  leadStatus: string
}
export interface LeadStatus {
 status: string;
}
export interface SectorListResponse {
 id: string;
 name: string;
}