/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./viewLead.module.scss";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import endpoints from "../../../helpers/endpoints";
import {
  LeadListResponse,
  LeadNote,
} from "../../../interfaces/leadScrapeInterface";
import moment from "moment";
import alert from "../../../services/alert";
import ViewAndEditTemplateNote from "../template-note/templateNote";

const ViewLead: React.FC = () => {
  const [leadDetails, setLeadDetails] = useState<LeadListResponse | null>(null);
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { leadId } = useParams();
  useEffect(() => {
    getLead();
    getLeadNotes();
  }, [leadId]);
  const getLead = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.leadScrape.getLead(leadId || ""));
      if (res.status === 200) {
        setLeadDetails(res.data);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const getLeadNotes = async () => {
    try {
      const res = await api.get(endpoints.leadScrape.getLeadNote(leadId || ""));
      if (res.status === 200) {
        setLeadNotes(res.data?.free_notes || []);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  return (
    <div className={styles.productListBdyPrt}>
      {!loading ? (
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>Lead Information</h1>
              </div>
            </div>

            <div className={styles.LeadcolRow}>
              <div className={styles.LeaddetailsCol}>
                <h2>Leads Details</h2>
                <div className={`${styles.secBox} ${styles.width100} ${styles.flexRow}`}>
                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Created At</div>
                    <div className={styles.secColRight}>
                      {moment(leadDetails?.created_at).format(
                        "MM-DD-YYYY h:mm:ss a"
                      )}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Phone No</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.phone}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>City</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.city}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Address</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.address}
                    </div>
                  </div>
                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Lead Status</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.lead_status}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Sector</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.sector}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Summary</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.summary}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.LeaddetailsCol}>
                <h2>Assigned Technician</h2>
                {leadDetails?.assigned_technician ? (
                  <div className={`${styles.secBox} ${styles.width100}`}>
                    <div className={styles.flexRow}>
                         <div className={`${styles.secRow} ${styles.width25}`}>
                      <div className={styles.secColleft}>Name</div>
                      <div className={styles.secColRight}>
                        {leadDetails?.assigned_technician?.name}
                      </div>
                    </div>

                    <div className={`${styles.secRow} ${styles.width25}`}>
                      <div className={styles.secColleft}>Role</div>
                      <div className={styles.secColRight}>
                        {leadDetails?.assigned_technician?.role}
                      </div>
                    </div>

                    <div className={`${styles.secRow} ${styles.width25}`}>
                      <div className={styles.secColleft}>Email Address</div>
                      <div className={styles.secColRight}>
                        {leadDetails?.assigned_technician?.email}
                      </div>
                    </div>
                    </div>
                   
                  </div>
                ) : (
                  <div className={styles.notFound}>No technician assigned.</div>
                )}
              </div>
            </div>

            <div>
              <ViewAndEditTemplateNote leadId={leadId || ""}/>
            </div>

            <div className={styles.LeadcolRow}>
              <div className={styles.LeaddetailsCol}>
                <h2>Notes</h2>
                {leadNotes.map((note: LeadNote) => (
                  <div
                    key={note.id}
                    className={`${styles.secBox} ${styles.width100}`}
                  >
                    <div className={styles.flexRow}>
                      <div className={`${styles.secRow} ${styles.width25}`}>
                        <div className={styles.secColleft}>Created At</div>
                        <div className={styles.secColRight}>
                          {moment(note?.created_at).format(
                            "MM-DD-YYYY h:mm:ss a"
                          )}
                        </div>
                      </div>
                      <div className={`${styles.secRow} ${styles.width25}`}>
                        <div className={styles.secColleft}>Name</div>
                        <div className={styles.secColRight}>
                          {note?.created_by_user?.name}
                        </div>
                      </div>
                      <div className={`${styles.secRow} ${styles.width25}`}>
                        <div className={styles.secColleft}>Email Address</div>
                        <div className={styles.secColRight}>
                          {note?.created_by_user?.email}
                        </div>
                      </div>
                      <div className={`${styles.secRow} ${styles.width25}`}>
                        <div className={styles.secColleft}>Role</div>
                        <div className={styles.secColRight}>
                          {note?.created_by_user?.role}
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.secRow} ${styles.width100}`}>
                      <div
                        style={{ width: "8%" }}
                        className={styles.secColleft}
                      >
                        Notes
                      </div>
                      <div
                        style={{ width: "92%" }}
                        className={styles.secColRight}
                      >
                        {note?.notes}
                      </div>
                    </div>
                  </div>
                ))}

                {leadNotes.length === 0 && (
                  <div className={styles.notFound}>No notes found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>Please wait...</div>
      )}
    </div>
  );
};
export default ViewLead;
