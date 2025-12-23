/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./viewLead.module.scss";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import endpoints from "../../../helpers/endpoints";
import {
  LeadListResponse,
  LeadNote,
  LeadStatusType,
} from "../../../interfaces/leadScrapeInterface";
import moment from "moment";
import alert from "../../../services/alert";
import ViewAndEditTemplateNote from "../template-note/templateNote";
import ChangeLeadStatus from "../../../modal/change-lead-status/changeLeadStatus";
import { changeStatusConfirmationAlert } from "../../../services/confirmationAlert";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useDispatch } from "react-redux";
import { resetSectionStatus } from "../../../store/templateNoteSectionStatusSlice";
import { resetWorkPackage } from "../../../store/workPackageSlicer";

const ViewLead: React.FC = () => {
  const [leadDetails, setLeadDetails] = useState<LeadListResponse | null>(null);
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [changeLeadStatusModalOpen, setChangeLeadStatusModalOpen] =
    useState<boolean>(false);
  const { leadId } = useParams();
  const sectionStatus = useSelector(
    (state: RootState) => state.templateNoteSectionStatus
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const workPackage = useSelector((state: RootState) => state.workPackage);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(resetSectionStatus());
    dispatch(resetWorkPackage());
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
  const openLeadStatusModal = () => {
    setChangeLeadStatusModalOpen(true);
  };
  const changeLeadStatus = async (status: LeadStatusType) => {
    const confirmation = await changeStatusConfirmationAlert();
    if (!confirmation.isConfirmed) return;
    try {
      const res = await api.put(
        `${endpoints.leadScrape.changeLeadStatus(
          leadId || ""
        )}?status=${status}`
      );
      if (res.status === 200) {
        alert(res.data?.message, "success");
        getLead();
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const checkSectionStatus = (sectionName: boolean): string => {
    return ["new", "Not interested"].includes(leadDetails?.lead_status || "")
      ? "N/A"
      : sectionName
      ? "Complete"
      : "Pending";
  };
  const setColorClass = (statusText: string) => {
    return statusText === "N/A"
      ? styles.draftColor
      : statusText === "Complete"
      ? styles.completeColor
      : styles.pendingColor;
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
              <div className={styles.productListTitleBtn}>
                {userInfo?.role !== "Technician" &&
                  leadDetails?.lead_status &&
                  ["new", "Not interested"].includes(
                    leadDetails?.lead_status
                  ) && (
                    <button onClick={openLeadStatusModal}>Change Status</button>
                  )}
                {userInfo?.role !== "Technician" &&
                  leadDetails?.lead_status &&
                  ["Positive lead", "Double Positive"].includes(
                    leadDetails?.lead_status
                  ) && (
                    <button
                      onClick={() => {
                        changeLeadStatus(
                          leadDetails?.lead_status === "Positive lead"
                            ? "Double Positive"
                            : "Triple Positive"
                        );
                      }}
                    >
                      Mark as{" "}
                      {leadDetails.lead_status === "Positive lead"
                        ? "Double"
                        : "Triple"}{" "}
                      Positive
                    </button>
                  )}
              </div>
            </div>

            <div className={styles.LeadcolRow}>
              <div
                className={`${styles.LeaddetailsCol} ${styles.leadDtlsInfoPrt}`}
              >
                <h2>Leads Details</h2>
                <div
                  className={`${styles.secBox} ${styles.width100} ${styles.flexRow}`}
                >
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
                      {leadDetails?.phone || "N/A"}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>City</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.city || "N/A"}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Address</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.address || "N/A"}
                    </div>
                  </div>
                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Lead Status</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.lead_status || "N/A"}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Sector</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.sector || "N/A"}
                    </div>
                  </div>

                  <div className={`${styles.secRow} ${styles.width50}`}>
                    <div className={styles.secColleft}>Summary</div>
                    <div className={styles.secColRight}>
                      {leadDetails?.summary || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.leadDtlsBdyRow}>
                {userInfo?.role !== "Technician" && <div className={styles.leadDtlsBdyLeftClm}>
                  <div className={styles.leadDtlsBdyLeftstatusInfo}>
                    <ul>
                      <li onClick={() => scrollToSection("dealSection")}>
                        <span className={styles.leadDtlsLeftClmMenu}>Deal</span>
                        <span
                          className={`${
                            styles.leadDtlsLeftClmStatus
                          } ${setColorClass(
                            checkSectionStatus(sectionStatus.deal)
                          )}`}
                        >
                          {checkSectionStatus(sectionStatus.deal)}
                        </span>
                      </li>
                      <li onClick={() => scrollToSection("workPackageSection")}>
                        <span className={styles.leadDtlsLeftClmMenu}>
                          Work Packages
                        </span>
                        <span
                          className={`${
                            styles.leadDtlsLeftClmStatus
                          } ${setColorClass(
                            checkSectionStatus(sectionStatus.workPackage)
                          )}`}
                        >
                          {checkSectionStatus(sectionStatus.workPackage)}
                        </span>
                      </li>
                      <li
                        onClick={() =>
                          scrollToSection("technicalContextSection")
                        }
                      >
                        <span className={styles.leadDtlsLeftClmMenu}>
                          Technical Context
                        </span>
                        <span
                          className={`${
                            styles.leadDtlsLeftClmStatus
                          } ${setColorClass(
                            checkSectionStatus(sectionStatus.technicalContext)
                          )}`}
                        >
                          {checkSectionStatus(sectionStatus.technicalContext)}
                        </span>
                      </li>
                      <li
                        onClick={() => scrollToSection("communicationSection")}
                      >
                        <span className={styles.leadDtlsLeftClmMenu}>
                          Communication
                        </span>
                        <span
                          className={`${
                            styles.leadDtlsLeftClmStatus
                          } ${setColorClass(
                            checkSectionStatus(sectionStatus.communication)
                          )}`}
                        >
                          {checkSectionStatus(sectionStatus.communication)}
                        </span>
                      </li>
                      <li
                        onClick={() => scrollToSection("InternalNoteSection")}
                      >
                        <span className={styles.leadDtlsLeftClmMenu}>
                          Internal Note
                        </span>
                        <span
                          className={`${
                            styles.leadDtlsLeftClmStatus
                          } ${setColorClass(
                            checkSectionStatus(sectionStatus.internalNote)
                          )}`}
                        >
                          {checkSectionStatus(sectionStatus.internalNote)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {leadDetails?.lead_status === "Triple Positive" && (
                    <div className={styles.leadDtlsBdyLeftAssignedTechnician}>
                    <div className={styles.LeaddetailsCol}>
                      <h2 className={styles.mtb0}>Assigned Technician</h2>
                    </div>
                    {workPackage?.map((item) => (
                      <div className={styles.assignedTecFlxRow} key={item.id}>
                        <div className={styles.assignedTecFlxCol}>
                          <h2 className={styles.packageSubHdn}>
                            <span>{item.package_title}</span>
                          </h2>
                          {item?.assigned_technician?.name || ""}
                        </div>
                        {item?.assigned_technician ? (
                          <div style={{width:"60%"}}>
                            <ul className={styles.chipsList}>
                              {item.required_skills.map((skill) => (
                                <li key={skill.id}>{skill.name}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span style={{width:"60%"}} className={styles.notFound}>No technician assigned yet</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                </div>}
                <div className={`${styles.leadDtlsBdyRightClm} ${userInfo?.role === "Technician" ? styles.fullWidth : ""}`}>
                  {leadDetails?.lead_status &&
                    [
                      "Positive lead",
                      "Double Positive",
                      "Triple Positive",
                    ].includes(leadDetails.lead_status) && (
                      <div>
                        <ViewAndEditTemplateNote
                          leadId={leadId || ""}
                          leadStatus={leadDetails?.lead_status || ""}
                        />
                      </div>
                    )}

                  <div className={styles.LeadcolRow}>
                    <div
                      className={`${styles.LeaddetailsCol} ${styles.leadDetailsLastCol}`}
                    >
                      <h2>Notes</h2>
                      {leadNotes?.map((note: LeadNote) => (
                        <div
                          key={note.id}
                          className={`${styles.secBox} ${styles.width100}`}
                        >
                          <div className={styles.flexRow}>
                            <div
                              className={`${styles.secRow} ${styles.width25}`}
                            >
                              <div className={styles.secColleft}>
                                Created At
                              </div>
                              <div className={styles.secColRight}>
                                {moment(note?.created_at).format(
                                  "MM-DD-YYYY h:mm:ss a"
                                )}
                              </div>
                            </div>
                            <div
                              className={`${styles.secRow} ${styles.width25}`}
                            >
                              <div className={styles.secColleft}>Name</div>
                              <div className={styles.secColRight}>
                                {note?.created_by_user?.name}
                              </div>
                            </div>
                            <div
                              className={`${styles.secRow} ${styles.width25}`}
                            >
                              <div className={styles.secColleft}>
                                Email Address
                              </div>
                              <div className={styles.secColRight}>
                                {note?.created_by_user?.email}
                              </div>
                            </div>
                            <div
                              className={`${styles.secRow} ${styles.width25}`}
                            >
                              <div className={styles.secColleft}>Role</div>
                              <div className={styles.secColRight}>
                                {note?.created_by_user?.role}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${styles.secRow} ${styles.width100}`}
                          >
                            <div className={styles.secColleft}>Notes</div>
                            <div className={styles.secColRight}>
                              {note?.notes}
                            </div>
                          </div>
                        </div>
                      ))}

                      {leadNotes?.length === 0 && (
                        <div className={styles.notFound}>No notes found.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loading} style={{ color: "white" }}>
          Please wait...
        </div>
      )}
      <ChangeLeadStatus
        open={changeLeadStatusModalOpen}
        onClose={() => setChangeLeadStatusModalOpen(false)}
        leadId={leadId || ""}
        confirmLeadStatusModal={() => {
          setChangeLeadStatusModalOpen(false);
          getLead();
        }}
        leadStatus={leadDetails?.lead_status || ""}
      />
    </div>
  );
};
export default ViewLead;
