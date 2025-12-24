/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  FieldArray,
} from "formik";
import styles from "../view-lead/viewLead.module.scss";
import {
  CommunicationContact,
  DealClientForm,
  DealResponse,
  DealSectorPackage,
  InternalNote,
  InternalNoteResponse,
  TechnicalContext,
  TechnicalContextResponse,
  ToolsAndSkillsInterface,
  WorkPackage,
  WorkPackagePayload,
  WorkPackageResponse,
  WorkPackages,
} from "../../../interfaces/templateNoteInterface";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  TemplateNoteEnum,
  TemplateNoteStatusEnum,
} from "../../../enum/templateNoteEnum";
import api from "../../../services/api";
import endpoints from "../../../helpers/endpoints";
import alert from "../../../services/alert";
import moment from "moment";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import FormikReactSelect from "../../../components/formik-react-select/formikReactSelect";
import { NumericFormat, PatternFormat } from "react-number-format";
import { LeadStatusType } from "../../../interfaces/leadScrapeInterface";
import { useDispatch } from "react-redux";
import { setSectionStatus } from "../../../store/templateNoteSectionStatusSlice";
import Loader from "../../../../src/assets/images/loader.gif";
import { setWorkPackage } from "../../../store/workPackageSlicer";
import TechnicianBidding from "../../../modal/technician-bidding/technicanBidding";
import {
  communicationFormValidationSchema,
  communicationInitialFormValue,
  dealFormValidationSchema,
  dealInitialFormValue,
  internalNoteInitialFormValue,
  internalNoteValidationSchema,
  technicalContextFormValidationSchema,
  technicalContextInitialFormValue,
  workPackagesFormValidationSchema,
  workPackagesInitialFormValue,
  workPackageValue,
} from "./templateNoteFormInitialValueAndSchemas";

const ViewAndEditTemplateNote: React.FC<{
  leadId: string;
  leadStatus: LeadStatusType;
}> = memo(({ leadId, leadStatus }) => {
  const [dealsSectorPackages, setDealsSectorPackages] = useState<
    DealSectorPackage[]
  >([]);
  const [sectionChanging, setSectionChanging] = useState<boolean>(false);
  const [sectionName, setSectionName] = useState<TemplateNoteEnum | null>(null);
  const [dealData, setDealData] = useState<DealResponse | null>(null);
  const [technicalContextData, setTechnicalContextData] =
    useState<TechnicalContextResponse | null>(null);
  const [internalNoteData, setInternalNoteData] =
    useState<InternalNoteResponse | null>(null);
  const [communicationData, setCommunicationData] =
    useState<CommunicationContact | null>(null);
  const [workPackageData, setWorkPackageData] = useState<WorkPackageResponse[]>(
    []
  );
  const [packageSkills, setPackageSkills] = useState<ToolsAndSkillsInterface[]>(
    []
  );
  const [packageTools, setPackageTools] = useState<ToolsAndSkillsInterface[]>(
    []
  );
  const [packageTypes, setPackageTypes] = useState<ToolsAndSkillsInterface[]>(
    []
  );
  const [dependencies, setDependencies] = useState<ToolsAndSkillsInterface[]>(
    []
  );
  const [biddingModalOpen, setBiddingModalOpen] = useState<boolean>(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const dealFormFormikRef = useRef<FormikProps<DealClientForm>>(null);
  const technicalContextFormFormikRef =
    useRef<FormikProps<TechnicalContext>>(null);
  const communicationFormFormikRef =
    useRef<FormikProps<CommunicationContact>>(null);
  const internalNoteFormFormikRef = useRef<FormikProps<InternalNote>>(null);
  const workPackagesFormFormikRef = useRef<FormikProps<WorkPackages>>(null);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch: AppDispatch = useDispatch();
  const hideEditButton =
    userInfo?.role === "Technician" || leadStatus === "Triple Positive";
  useEffect(() => {
    if (!hideEditButton) {
      getDealSectorPackages();
      getPackageTypes();
      getSkills();
      getTools();
    }
    getDeals();
  }, []);

  const editSection = (sectionName: TemplateNoteEnum) => {
    if (sectionChanging) return;
    setSectionName(sectionName);
    checkAndSetSectionValue(sectionName);
  };
  const cancelEditSection = () => {
    if (sectionChanging) return;
    setSectionName(null);
  };
  const getDealSectorPackages = async () => {
    try {
      const res = await api.get(
        endpoints.templateNote.deals.getDealSectorPackages
      );
      if (res.status === 200) {
        setDealsSectorPackages(res.data || []);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const saveDealSection = async (value: DealClientForm) => {
    setSectionChanging(true);
    try {
      const payload = {
        ...value,
        deal_close_date: moment(value.deal_close_date).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        expected_end_date_or_deadline: value.expected_end_date_or_deadline
          ? moment(value.expected_end_date_or_deadline).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          : null,
        expected_start_date: value.expected_start_date
          ? moment(value.expected_start_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
        custom_sector_package:
          value.sector_package_id === "12" ? value.custom_sector_package : "",
        lead_id: leadId,
      };
      const res = await api.post(
        endpoints.templateNote.deals.saveDeals,
        payload
      );
      if (res.data) {
        alert(res.data?.message, "success");
        setSectionName(null);
        getDeals();
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const getDeals = async () => {
    try {
      const res = await api.get(endpoints.templateNote.deals.getDeals(leadId));
      if (res.status === 200) {
        setDealData(res.data?.data || null);
        if (res.data?.data?.id) {
          dispatch(setSectionStatus(TemplateNoteStatusEnum.deal));
          getTechnicianContextData(res.data?.data?.id);
          getInternalNotesData(res.data?.data?.id);
          getCommunicationData(res.data?.data?.id);
          getWorkPackageData(res.data?.data?.id);
        }
        if (
          !res.data?.data?.id &&
          userInfo?.role !== "Technician" &&
          leadStatus !== "Triple Positive"
        ) {
          setSectionName(TemplateNoteEnum.DEAL);
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const setDealFormValue = () => {
    if (!dealFormFormikRef.current) return;
    const d = dealData;
    dealFormFormikRef.current.setValues({
      client_name: d?.client_name || "",
      primary_contact_name: d?.primary_contact_name || "",
      primary_contact_email: d?.primary_contact_email || "",
      primary_contact_phone: d?.primary_contact_phone || "",
      industry: d?.industry || "",
      sector_package_id: d?.sector_package?.id
        ? String(d.sector_package.id)
        : "",
      deal_name: d?.deal_name || "",
      salesperson_name: d?.salesperson_name || "",
      deal_close_date: d?.deal_close_date
        ? moment(d?.deal_close_date).format("YYYY-MM-DD")
        : "",
      expected_start_date: d?.expected_start_date
        ? moment(d?.expected_start_date).format("YYYY-MM-DD")
        : "",
      expected_end_date_or_deadline: d?.expected_end_date_or_deadline
        ? moment(d.expected_end_date_or_deadline).format("YYYY-MM-DD")
        : "",
      client_approved_scope_summary: d?.client_approved_scope_summary || "",
      special_terms: d?.special_terms || "",
      custom_sector_package: d?.custom_sector_package || "",
    });
  };
  const saveTechnicalContextSection = async (value: TechnicalContext) => {
    if (!dealData?.id) return;
    setSectionChanging(true);
    try {
      const payload: TechnicalContextResponse = {
        ...value,
        deal_id: dealData?.id || "",
      };
      const res = await api.post(
        endpoints.templateNote.technicalContext.saveTechnicalContext,
        payload
      );
      if (res.data) {
        alert(res.data?.message, "success");
        setSectionName(null);
        getTechnicianContextData(dealData?.id || "");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const getTechnicianContextData = async (dealId: string) => {
    try {
      const res = await api.get(
        endpoints.templateNote.technicalContext.getTechnicalContext(dealId)
      );
      if (res.status === 200) {
        setTechnicalContextData(res.data?.data || null);
        if (res.data?.data)
          dispatch(setSectionStatus(TemplateNoteStatusEnum.technicalContext));
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const setTechnicalContextFormValue = () => {
    if (!technicalContextFormFormikRef.current) return;
    technicalContextFormFormikRef.current?.setValues({
      client_main_systems: technicalContextData?.client_main_systems || "",
      integration_targets: technicalContextData?.integration_targets || "",
      tools_in_scope: technicalContextData?.tools_in_scope || "",
      access_required_list: technicalContextData?.access_required_list || "",
      credential_provision_method:
        technicalContextData?.credential_provision_method || "",
    });
  };
  const saveInternalNoteSection = async (value: InternalNote) => {
    if (!dealData?.id) return;
    setSectionChanging(true);
    try {
      const payload: InternalNoteResponse = {
        ...value,
        deal_id: dealData?.id || "",
      };
      const res = await api.post(
        endpoints.templateNote.internalNote.saveInternalNote,
        payload
      );
      if (res.data) {
        alert(res.data?.message, "success");
        setSectionName(null);
        getInternalNotesData(dealData?.id || "");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const getInternalNotesData = async (dealId: string) => {
    try {
      const res = await api.get(
        endpoints.templateNote.internalNote.getInternalNote(dealId)
      );
      if (res.status === 200) {
        setInternalNoteData(res.data?.data || null);
        if (res.data?.data)
          dispatch(setSectionStatus(TemplateNoteStatusEnum.internalNote));
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const setInternalNoteFormValue = () => {
    if (!internalNoteFormFormikRef.current) return;
    internalNoteFormFormikRef.current?.setValues({
      internal_risks_and_warnings:
        internalNoteData?.internal_risks_and_warnings || "",
      internal_margin_sensitivity:
        internalNoteData?.internal_margin_sensitivity || "",
      internal_notes: internalNoteData?.internal_notes || "",
    });
  };
  const saveCommunicationSection = async (value: CommunicationContact) => {
    if (!dealData?.id) return;
    setSectionChanging(true);
    try {
      const payload = {
        ...value,
        deal_id: dealData?.id || "",
      };
      const res = await api.post(
        endpoints.templateNote.communication.saveCommunication,
        payload
      );
      if (res.data) {
        alert(res.data?.message, "success");
        setSectionName(null);
        getCommunicationData(dealData?.id || "");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const getCommunicationData = async (dealId: string) => {
    try {
      const res = await api.get(
        endpoints.templateNote.communication.getCommunication(dealId)
      );
      if (res.status === 200) {
        setCommunicationData(res.data?.data || null);
        if (res.data?.data)
          dispatch(setSectionStatus(TemplateNoteStatusEnum.communication));
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const setCommunicationFormValue = () => {
    if (!communicationFormFormikRef.current) return;
    communicationFormFormikRef.current?.setValues({
      client_project_contact_name:
        communicationData?.client_project_contact_name || "",
      client_project_contact_email:
        communicationData?.client_project_contact_email || "",
      preferred_channel: communicationData?.preferred_channel || "",
      update_frequency: communicationData?.update_frequency || "",
    });
  };
  const saveWorkPackage = async (value: WorkPackages) => {
    const types = value.work_packages.map((p) => p.package_type);
    const hasDuplicate = new Set(types).size !== types.length;
    if (hasDuplicate) {
      alert(
        "Duplicate package type found! Please make sure each package type is unique.",
        "error"
      );
      return;
    }
    setSectionChanging(true);
    try {
      const formatWorkPackage: WorkPackagePayload[] = value.work_packages.map(
        (p: WorkPackage) => ({
          package_title: p.package_title,
          package_type_id: Number(p.package_type),
          package_summary: p.package_summary,
          key_deliverables: p.key_deliverables,
          acceptance_criteria: p.acceptance_criteria,
          required_skills_ids: p.required_skills.map((item) => Number(item)),
          primary_tools_ids: p.primary_tools.map((item) => Number(item)),
          package_estimated_complexity: p.package_estimated_complexity,
          package_price_allocation: p.package_price_allocation || null,
          dependencies_ids: p.dependencies.map((item) => Number(item)),
          custom_package_type:
            p.package_type === "12" ? p.custom_package_type : "",
          required_tools_ids: p.required_tools.map((item) => Number(item)),
          bidding_duration_days: Number(p.bidding_duration_days),
          ...(p.id ? { id: p.id } : {}),
        })
      );

      const payload = {
        deal_id: dealData?.id || "",
        packages: formatWorkPackage,
      };
      const res = await api.post(
        endpoints.templateNote.workPackage.saveWorkPackage,
        payload
      );
      if (res.data) {
        setSectionName(null);
        getWorkPackageData(dealData?.id || "");
        alert(res.data.message, "success");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const getWorkPackageData = async (dealId: string) => {
    try {
      const res = await api.get(
        endpoints.templateNote.workPackage.getWorkPackage(dealId)
      );
      if (res.status === 200) {
        setWorkPackageData(res.data?.packages || []);
        if (res.data?.packages && res.data?.packages?.length > 0) {
          dispatch(setSectionStatus(TemplateNoteStatusEnum.workPackage));
          dispatch(setWorkPackage(res.data?.packages));
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const removePackage = async (
    remove: (index: number) => void,
    ind: number,
    packageId: string
  ) => {
    if (!packageId) {
      remove(ind);
      alert("Work package successfully deleted", "success");
      return;
    }
    setSectionChanging(true);
    try {
      const res = await api.delete(
        endpoints.templateNote.workPackage.deleteWorkPackage(packageId)
      );
      if (res.data) {
        remove(ind);
        getWorkPackageData(dealData?.id || "");
        alert(res.data?.message, "success");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setSectionChanging(false);
    }
  };
  const setWorkPackageFormValue = () => {
    if (!workPackagesFormFormikRef.current) return;
    const formatPackage: WorkPackage[] = (workPackageData || []).map(
      (pack) => ({
        id: pack.id || "",
        package_title: pack.package_title || "",
        package_type: String(pack.package_type.id),
        package_summary: pack.package_summary || "",
        key_deliverables: pack.key_deliverables || "",
        acceptance_criteria: pack.acceptance_criteria || "",
        required_skills: pack.required_skills.map((item) => String(item.id)),
        primary_tools: pack.primary_tools.map((item) => String(item.id)),
        package_estimated_complexity: pack.package_estimated_complexity || "",
        package_price_allocation: pack.package_price_allocation || "",
        dependencies: pack.dependencies.map((item) => String(item.id)),
        custom_package_type: pack.custom_package_type || "",
        required_tools: pack.required_tools
          ? pack.required_tools.map((item) => String(item.id))
          : [],
        bidding_duration_days: pack.bidding_duration_days
          ? String(pack.bidding_duration_days)
          : "",
      })
    );
    workPackagesFormFormikRef.current?.setValues({
      work_packages:
        workPackageData.length > 0 ? formatPackage : [workPackageValue],
    });
  };
  const checkAndSetSectionValue = (sectionName: TemplateNoteEnum) => {
    switch (sectionName) {
      case TemplateNoteEnum.DEAL:
        setDealFormValue();
        break;
      case TemplateNoteEnum.TECHNICAL_CONTEXT:
        setTechnicalContextFormValue();
        break;
      case TemplateNoteEnum.INTERNAL_NOTE:
        setInternalNoteFormValue();
        break;
      case TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT:
        setCommunicationFormValue();
        break;
      case TemplateNoteEnum.WORK_PACKAGE:
        setWorkPackageFormValue();
        break;
      default:
        break;
    }
  };
  const getPackageTypes = async () => {
    try {
      const res = await api.get(
        endpoints.templateNote.workPackage.getPackageTypes
      );
      if (res.status === 200) {
        const formatData: ToolsAndSkillsInterface[] = res.data?.map(
          (item: { id: string; name: string }) => ({
            ...item,
            value: String(item?.id),
            label: item?.name,
          })
        );
        setPackageTypes(formatData || []);
        const filterDependencies = formatData.filter(
          (item) => item.value !== "12"
        );
        setDependencies(filterDependencies || []);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const getSkills = async () => {
    try {
      const res = await api.get(endpoints.templateNote.workPackage.getSkills);
      if (res.status === 200) {
        const formatData: ToolsAndSkillsInterface[] = res.data?.map(
          (item: { id: string; name: string }) => ({
            ...item,
            value: String(item?.id),
            label: item?.name,
          })
        );
        setPackageSkills(formatData || []);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const getTools = async () => {
    try {
      const res = await api.get(endpoints.templateNote.workPackage.getTools);
      if (res.status === 200) {
        const formatData: ToolsAndSkillsInterface[] = res.data?.map(
          (item: { id: string; name: string }) => ({
            ...item,
            value: String(item?.id),
            label: item?.name,
          })
        );
        setPackageTools(formatData || []);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const openBiddingModal = (packageId: string) => {
    setBiddingModalOpen(true);
    setSelectedPackageId(packageId);
  };
  const closeBiddingModal = (isFetchApi = false) => {
    setSelectedPackageId("");
    setBiddingModalOpen(false);
    if (isFetchApi) getWorkPackageData(dealData?.id || "");
  };

  return (
    <div className={styles.LeadcolRow}>
      {/*  ****** DEAL SECTION ****** */}
      <div className={styles.LeaddetailsCol} id="dealSection">
        <div className={styles.sectionHeading}>
          <h2>Deal</h2>
          {sectionName !== TemplateNoteEnum.DEAL && !hideEditButton && (
            <span
              className={styles.editBtn}
              onClick={() => editSection(TemplateNoteEnum.DEAL)}
            >
              Edit <EditIcon />
            </span>
          )}
          {sectionName === TemplateNoteEnum.DEAL && (
            <span className={styles.cancelBtn} onClick={cancelEditSection}>
              Cancel <CancelIcon />
            </span>
          )}
        </div>
        {sectionName !== TemplateNoteEnum.DEAL && (
          <div className={styles.viewInfo}>
            <div className={styles.editInfoCol}>
              <span className={styles.borderRight}>
                <label>Client Name</label>
                <p>{dealData?.client_name || "N/A"}</p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Primary Contact Name</label>
                <p>{dealData?.primary_contact_name || "N/A"}</p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Primary Contact Email</label>
                <p>{dealData?.primary_contact_email || "N/A"}</p>
              </span>
              <span className={styles.pl10}>
                <label>Primary Contact Phone</label>
                <p>{dealData?.primary_contact_phone || "N/A"}</p>
              </span>
            </div>
            <div className={styles.editInfoCol}>
              <span className={styles.borderRight}>
                <label>Industry</label>
                <p>{dealData?.industry || "N/A"}</p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Deal Name</label>
                <p>{dealData?.deal_name || "N/A"}</p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Sale Person Name</label>
                <p>{dealData?.salesperson_name || "N/A"}</p>
              </span>
              <span className={styles.pl10}>
                <label>Special Terms</label>
                <p>{dealData?.special_terms || "N/A"}</p>
              </span>
            </div>
            <div className={styles.editInfoCol}>
              <span className={styles.borderRight}>
                <label>Deal Close date</label>
                <p>
                  {dealData?.deal_close_date
                    ? moment(dealData?.deal_close_date).format("MM-DD-YYYY")
                    : "N/A"}
                </p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Expected Start Date</label>
                <p>
                  {dealData?.expected_start_date
                    ? moment(dealData?.expected_start_date).format("MM-DD-YYYY")
                    : "N/A"}
                </p>
              </span>
              <span className={`${styles.borderRight} ${styles.pl10}`}>
                <label>Expected End Date or Deadline</label>
                <p>
                  {dealData?.expected_end_date_or_deadline
                    ? moment(dealData?.expected_end_date_or_deadline).format(
                        "MM-DD-YYYY"
                      )
                    : "N/A"}
                </p>
              </span>
              <span className={styles.pl10}>
                <label>Client Approved Scope Summary</label>
                <p>{dealData?.client_approved_scope_summary || "N/A"}</p>
              </span>
            </div>
            <div className={styles.editInfoCol}>
              <span
                className={
                  dealData?.custom_sector_package ? styles.borderRight : ""
                }
              >
                <label>Sector Package</label>
                <p>{dealData?.sector_package?.name || "N/A"}</p>
              </span>
              {dealData?.custom_sector_package && (
                <span className={styles.pl10}>
                  <label>Custom Sector Package</label>
                  <p>{dealData?.custom_sector_package || "N/A"}</p>
                </span>
              )}
            </div>
          </div>
        )}

        <div
          className={styles.editInfo}
          style={{
            display: sectionName === TemplateNoteEnum.DEAL ? "block" : "none",
          }}
        >
          <Formik
            initialValues={dealInitialFormValue}
            validationSchema={dealFormValidationSchema}
            onSubmit={(val) => saveDealSection(val)}
            innerRef={dealFormFormikRef}
          >
            {({ values, errors }) => (
              <Form>
                <div className={styles.editInfoCol}>
                  <span>
                    <label>Client Name</label>
                    <Field name="client_name" placeholder="Enter Client Name" />
                    <ErrorMessage
                      className={styles.error}
                      name="client_name"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Primary Contact Name</label>
                    <Field
                      name="primary_contact_name"
                      placeholder="Enter Primary Contact Name"
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="primary_contact_name"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Primary Contact Email</label>
                    <Field
                      name="primary_contact_email"
                      placeholder="Enter Primary Contact Email"
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="primary_contact_email"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Primary Contact Phone (Optional)</label>
                    <Field name="primary_contact_phone">
                      {({ field, form }: any) => (
                        <PatternFormat
                          format="(###) ###-####"
                          placeholder="Enter Primary Contact Phone"
                          value={form.values.primary_contact_phone}
                          onValueChange={(values) =>
                            form.setFieldValue(
                              "primary_contact_phone",
                              values.value
                            )
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      className={styles.error}
                      name="primary_contact_phone"
                      component="p"
                    />
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span>
                    <label>Industry</label>
                    <Field name="industry" placeholder="Enter Industry" />
                    <ErrorMessage
                      className={styles.error}
                      name="industry"
                      component="p"
                    />
                  </span>

                  <span>
                    <label>Deal Name</label>
                    <Field name="deal_name" placeholder="Enter Deal Name" />
                    <ErrorMessage
                      className={styles.error}
                      name="deal_name"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Sale Person Name</label>
                    <Field
                      name="salesperson_name"
                      placeholder="Enter Sale Person Name"
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="salesperson_name"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Special Terms (Optional)</label>
                    <Field
                      name="special_terms"
                      placeholder="Enter Special Terms"
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="special_terms"
                      component="p"
                    />
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span>
                    <label>Deal Close date</label>
                    <Field
                      name="deal_close_date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        (
                          e.currentTarget as HTMLInputElement & {
                            showPicker?: () => void;
                          }
                        ).showPicker?.();
                      }}
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="deal_close_date"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Expected Start Date (Optional)</label>
                    <Field
                      name="expected_start_date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        (
                          e.currentTarget as HTMLInputElement & {
                            showPicker?: () => void;
                          }
                        ).showPicker?.();
                      }}
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="expected_start_date"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Expected End Date or Deadline (Optional)</label>
                    <Field
                      name="expected_end_date_or_deadline"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        (
                          e.currentTarget as HTMLInputElement & {
                            showPicker?: () => void;
                          }
                        ).showPicker?.();
                      }}
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="expected_end_date_or_deadline"
                      component="p"
                    />
                  </span>
                  <span>
                    <label>Client Approved Scope Summary</label>
                    <Field
                      name="client_approved_scope_summary"
                      placeholder="Enter Client Approved Scope Summary"
                    />
                    <ErrorMessage
                      className={styles.error}
                      name="client_approved_scope_summary"
                      component="p"
                    />
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span>
                    <label>Sector Package</label>
                    <Field name="sector_package_id" as="select">
                      <option value="">Select Sector Package</option>
                      {dealsSectorPackages.map(
                        (dealPackage: DealSectorPackage) => (
                          <option key={dealPackage.id} value={dealPackage.id}>
                            {dealPackage.name}
                          </option>
                        )
                      )}
                    </Field>
                    <ErrorMessage
                      className={styles.error}
                      name="sector_package_id"
                      component="p"
                    />
                  </span>
                  {values.sector_package_id === "12" && (
                    <span>
                      <label>Custom Sector Package</label>
                      <Field
                        name="custom_sector_package"
                        placeholder="Enter Custom Sector Package"
                      />
                      <ErrorMessage
                        className={styles.error}
                        name="custom_sector_package"
                        component="p"
                      />
                    </span>
                  )}
                </div>
                <div
                  className={`${styles.editInfoCol} ${styles.submitBtnRight}`}
                >
                  <span>
                    <button
                      className={styles.submitBtn}
                      type="submit"
                      disabled={sectionChanging}
                    >
                      Submit
                    </button>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {dealData?.id && (
        <>
          {/*  ****** WORK PACKAGE SECTION ****** */}
          <div className={styles.LeaddetailsCol} id="workPackageSection">
            <div className={styles.sectionHeading}>
              <h2>Work Packages</h2>
              {sectionName !== TemplateNoteEnum.WORK_PACKAGE &&
                !hideEditButton && (
                  <span
                    className={styles.editBtn}
                    onClick={() => editSection(TemplateNoteEnum.WORK_PACKAGE)}
                  >
                    Edit <EditIcon />
                  </span>
                )}
              {sectionName === TemplateNoteEnum.WORK_PACKAGE && (
                <span className={styles.cancelBtn} onClick={cancelEditSection}>
                  Cancel <CancelIcon />
                </span>
              )}
            </div>
            {sectionName !== TemplateNoteEnum.WORK_PACKAGE && (
              <div className={styles.viewInfo}>
                {workPackageData?.map((wp, ind: number) => (
                  <div key={wp.id}>
                    <div className={styles.subTitleFlex}>
                      <h2 className={styles.packageSubHdn}>
                        Package - <span>#{ind + 1}</span>
                      </h2>
                      <div>
                        {userInfo?.role === "Technician" &&
                          !wp.user_bidding_placed &&
                          wp.bidding_status !== "closed" &&
                          leadStatus === "Triple Positive" && (
                            <button
                              className={styles.bidBtn}
                              type="button"
                              onClick={() => openBiddingModal(wp.id)}
                            >
                              Bid here
                            </button>
                          )}
                      </div>
                    </div>
                    {userInfo?.role === "Technician" &&
                      wp.user_bidding_placed && <div style={{color: "white"}}>Already Bid</div>}

                    <div className={styles.editInfoColFlx}>
                      <div className={styles.editInfoWidth50}>
                        <div className={styles.editInfoCol}>
                          <span className={styles.editInfoWidth50}>
                            <label>Title</label>
                            <p>{wp?.package_title || "N/A"}</p>
                          </span>
                          <span
                            className={`${styles.autoWidth} ${styles.pl10}`}
                          >
                            <label>Type</label>
                            <p>{wp?.package_type?.name || "N/A"}</p>
                          </span>
                        </div>

                        <div className={styles.editInfoCol}>
                          <span className={styles.editInfoWidth50}>
                            <label>Bidding Duration</label>
                            <p>
                              {wp?.bidding_duration_days
                                ? `${wp?.bidding_duration_days} days`
                                : "N/A"}
                            </p>
                          </span>
                          <span
                            className={`${styles.autoWidth} ${styles.pl10}`}
                          >
                            <label>Primary Tools</label>
                            <ul className={styles.chipsList}>
                              {wp?.primary_tools?.map((tool) => (
                                <li key={tool?.id}>{tool?.name || ""}</li>
                              ))}
                            </ul>
                          </span>
                        </div>
                        <div className={styles.editInfoCol}>
                          <span className={styles.autoWidth}>
                            <label>Required Tools</label>
                            <ul className={styles.chipsList}>
                              {wp?.required_tools?.map((tool) => (
                                <li key={tool?.id}>{tool?.name || ""}</li>
                              ))}
                            </ul>
                          </span>
                          {/* <span className={styles.editInfoWidth50}>
                            <label>Bidding Status</label>
                            <p>
                              {wp.bidding_status
                                ? PackageBiddingStatusEnum[wp.bidding_status]
                                : "N/A"}
                            </p>
                          </span> */}
                        </div>
                      </div>

                      <div className={styles.editInfoWidth50}>
                        <div className={styles.editInfoCol}>
                          {wp.custom_package_type && (
                            <span className={styles.editInfoWidth50}>
                              <label>Custom Work Package</label>
                              <p>{wp?.custom_package_type || "N/A"}</p>
                            </span>
                          )}

                          <span className={styles.borderRight}>
                            <label>Price</label>
                            <p>
                              {wp?.package_price_allocation
                                ? new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(
                                    Number(wp?.package_price_allocation)
                                  )
                                : "N/A"}
                            </p>
                          </span>
                        </div>

                        <div className={styles.editInfoCol}>
                          <span className={styles.editInfoWidth50}>
                            <label>Complexity</label>
                            <p>{wp?.package_estimated_complexity || "N/A"}</p>
                          </span>

                          <span
                            className={`${styles.autoWidth} ${styles.pl10}`}
                          >
                            <label>Skills</label>
                            <ul className={styles.chipsList}>
                              {wp?.required_skills?.map((skill) => (
                                <li key={skill?.id}>{skill?.name || ""}</li>
                              ))}
                            </ul>
                          </span>
                        </div>

                        <span className={styles.pl10}>
                          <label>Dependencies</label>
                          <ul className={styles.chipsList}>
                            {wp?.dependencies?.map((dependency) => (
                              <li key={dependency?.id}>
                                {dependency?.name || ""}
                              </li>
                            ))}
                          </ul>
                        </span>
                      </div>
                    </div>

                    <div className={styles.editInfoCol}>
                      <span className={styles.clmOne}>
                        <label>Packages Summary</label>
                        <p>{wp?.package_summary || "N/A"}</p>
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.clmOne}>
                        <label>Key Deliverables</label>
                        <p>{wp?.key_deliverables || "N/A"}</p>
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.clmOne}>
                        <label>Acceptance Criteria</label>
                        <p>{wp?.acceptance_criteria || "N/A"}</p>
                      </span>
                    </div>
                  </div>
                ))}
                {workPackageData?.length === 0 && (
                  <p className={styles.notFound}>No work packages available.</p>
                )}
              </div>
            )}
            <div
              className={styles.editInfo}
              style={{
                display:
                  sectionName === TemplateNoteEnum.WORK_PACKAGE
                    ? "block"
                    : "none",
              }}
            >
              <Formik
                initialValues={workPackagesInitialFormValue}
                validationSchema={workPackagesFormValidationSchema}
                onSubmit={(val) => saveWorkPackage(val)}
                innerRef={workPackagesFormFormikRef}
                enableReinitialize={true}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <FieldArray name="work_packages">
                      {({ push, remove }) => (
                        <>
                          {values.work_packages.map((workPackage, ind) => (
                            <div key={ind}>
                              <div>
                                <h2 className={styles.packageSubHdn}>
                                  Package - <span>#{ind + 1}</span>
                                </h2>
                              </div>
                              <div className={styles.editInfo}>
                                <div className={styles.packageItemDeleteIcon}>
                                  {values.work_packages.length > 1 && (
                                    <button
                                      type="button"
                                      disabled={sectionChanging}
                                      onClick={() => {
                                        removePackage(
                                          remove,
                                          ind,
                                          workPackage.id || ""
                                        );
                                      }}
                                      className={styles.removePoButton}
                                    >
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  )}
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span
                                    className={
                                      values.work_packages[ind].package_type ===
                                      "12"
                                        ? styles.threeClm
                                        : styles.twoClm
                                    }
                                  >
                                    <label>Packages Title</label>
                                    <Field
                                      name={`work_packages.${ind}.package_title`}
                                      placeholder="Enter Packages Title"
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.package_title`}
                                      component="p"
                                    />
                                  </span>
                                  <span
                                    className={
                                      values.work_packages[ind].package_type ===
                                      "12"
                                        ? styles.threeClm
                                        : styles.twoClm
                                    }
                                  >
                                    <label>Package Type</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.package_type`}
                                      options={packageTypes}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.package_type`}
                                      component="p"
                                    />
                                  </span>
                                  {values.work_packages[ind].package_type ===
                                    "12" && (
                                    <span className={styles.threeClm}>
                                      <label>Custom Package</label>
                                      <Field
                                        name={`work_packages.${ind}.custom_package_type`}
                                        placeholder="Enter Custom Packages"
                                      />
                                      <ErrorMessage
                                        className={styles.error}
                                        name={`work_packages.${ind}.custom_package_type`}
                                        component="p"
                                      />
                                    </span>
                                  )}
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.threeClm}>
                                    <label>Packages Price</label>
                                    <Field
                                      name={`work_packages.${ind}.package_price_allocation`}
                                    >
                                      {({ field, form }: any) => (
                                        <NumericFormat
                                          value={field.value}
                                          thousandSeparator=","
                                          decimalScale={2}
                                          fixedDecimalScale={true}
                                          prefix={field.value ? "$" : ""}
                                          allowNegative={false}
                                          placeholder="Enter Packages Price"
                                          onValueChange={(values) => {
                                            form.setFieldValue(
                                              field.name,
                                              values.floatValue ?? ""
                                            );
                                          }}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.package_price_allocation`}
                                      component="p"
                                    />
                                  </span>
                                  <span className={styles.threeClm}>
                                    <label>Complexity</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.package_estimated_complexity`}
                                      options={[
                                        { value: "Small", label: "Small" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "Large", label: "Large" },
                                      ]}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.package_estimated_complexity`}
                                      component="p"
                                    />
                                  </span>
                                  <span className={styles.threeClm}>
                                    <label>Bidding Duration</label>
                                    <Field
                                      name={`work_packages.${ind}.bidding_duration_days`}
                                    >
                                      {({ field, form }: any) => (
                                        <NumericFormat
                                          value={field.value}
                                          thousandSeparator=","
                                          decimalScale={0}
                                          fixedDecimalScale={true}
                                          suffix={field.value ? " days" : ""}
                                          allowNegative={false}
                                          placeholder="Enter Binding Duration"
                                          onValueChange={(values) => {
                                            form.setFieldValue(
                                              field.name,
                                              values.floatValue ?? ""
                                            );
                                          }}
                                          onBlur={() => {
                                            form.setFieldTouched(
                                              field.name,
                                              true
                                            );
                                          }}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.bidding_duration_days`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Package Skills</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.required_skills`}
                                      options={packageSkills}
                                      isMulti={true}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.required_skills`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Primary Tools</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.primary_tools`}
                                      options={packageTools}
                                      isMulti={true}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.primary_tools`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Required Tools</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.required_tools`}
                                      options={packageTools}
                                      isMulti={true}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.required_tools`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Dependencies</label>
                                    <FormikReactSelect
                                      name={`work_packages.${ind}.dependencies`}
                                      options={dependencies}
                                      isMulti={true}
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.dependencies`}
                                      component="p"
                                    />
                                  </span>
                                </div>

                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Packages Summary</label>
                                    <Field
                                      as="textarea"
                                      name={`work_packages.${ind}.package_summary`}
                                      placeholder="Enter Packages Summary"
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.package_summary`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Key Deliverables</label>
                                    <Field
                                      as="textarea"
                                      name={`work_packages.${ind}.key_deliverables`}
                                      placeholder="Enter Key Deliverables"
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.key_deliverables`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                                <div className={styles.editInfoCol}>
                                  <span className={styles.oneClm}>
                                    <label>Acceptance Criteria</label>
                                    <Field
                                      as="textarea"
                                      name={`work_packages.${ind}.acceptance_criteria`}
                                      placeholder="Enter Acceptance Criteria"
                                    />
                                    <ErrorMessage
                                      className={styles.error}
                                      name={`work_packages.${ind}.acceptance_criteria`}
                                      component="p"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div
                            className={`${styles.editInfoCol} ${styles.submitBtnRight}`}
                          >
                            <span>
                              {!sectionChanging ? (
                                <>
                                  <button
                                    type="button"
                                    disabled={sectionChanging}
                                    className={styles.addMoreBtn}
                                    onClick={() => {
                                      push(workPackageValue);
                                    }}
                                  >
                                    Add More
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={sectionChanging}
                                    className={styles.submitBtn}
                                  >
                                    Submit
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  disabled={sectionChanging}
                                  className={styles.addMoreBtn}
                                >
                                  <img
                                    style={{ width: "80px", height: "30px" }}
                                    src={Loader}
                                    alt="loader"
                                    className={styles.loaderImg}
                                  />
                                </button>
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/*  ******TECHNICAL CONTEXT SECTION ****** */}
          <div className={styles.LeaddetailsCol} id="technicalContextSection">
            <div className={styles.sectionHeading}>
              <h2>Technical Context</h2>
              {sectionName !== TemplateNoteEnum.TECHNICAL_CONTEXT &&
                !hideEditButton && (
                  <span
                    className={styles.editBtn}
                    onClick={() =>
                      editSection(TemplateNoteEnum.TECHNICAL_CONTEXT)
                    }
                  >
                    Edit <EditIcon />
                  </span>
                )}
              {sectionName === TemplateNoteEnum.TECHNICAL_CONTEXT && (
                <span className={styles.cancelBtn} onClick={cancelEditSection}>
                  Cancel <CancelIcon />
                </span>
              )}
            </div>
            {sectionName !== TemplateNoteEnum.TECHNICAL_CONTEXT && (
              <div className={styles.viewInfo}>
                <div className={styles.editInfoCol}>
                  <span className={`${styles.borderRight} ${styles.clmTwo}`}>
                    <label>Client Main System</label>
                    <p>{technicalContextData?.client_main_systems || "N/A"}</p>
                  </span>
                  <span className={`${styles.borderRight} ${styles.clmTwo}`}>
                    <label>Credential Provision Method</label>
                    <p>
                      {technicalContextData?.credential_provision_method ||
                        "N/A"}
                    </p>
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span className={styles.clmOne}>
                    <label>Integration Targets</label>
                    <p>{technicalContextData?.integration_targets || "N/A"}</p>
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span className={styles.clmOne}>
                    <label>Tools In Scope</label>
                    <p>{technicalContextData?.tools_in_scope || "N/A"}</p>
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span className={styles.clmOne}>
                    <label>Access Required List</label>
                    <p>{technicalContextData?.access_required_list || "N/A"}</p>
                  </span>
                </div>
              </div>
            )}
            <div
              className={styles.editInfo}
              style={{
                display:
                  sectionName === TemplateNoteEnum.TECHNICAL_CONTEXT
                    ? "block"
                    : "none",
              }}
            >
              <Formik
                initialValues={technicalContextInitialFormValue}
                validationSchema={technicalContextFormValidationSchema}
                onSubmit={(val) => saveTechnicalContextSection(val)}
                innerRef={technicalContextFormFormikRef}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className={styles.editInfoCol}>
                      <span className={styles.twoClm}>
                        <label>Client Main System</label>
                        <Field
                          name="client_main_systems"
                          placeholder="Enter Client Main System"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="client_main_systems"
                          component="p"
                        />
                      </span>
                      <span className={styles.twoClm}>
                        <label>Credential Provision Method</label>
                        <Field
                          name="credential_provision_method"
                          placeholder="Enter Credential Provision Method"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="credential_provision_method"
                          component="p"
                        />
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.oneClm}>
                        <label>Integration Targets (Optional)</label>
                        <Field
                          as="textarea"
                          name="integration_targets"
                          placeholder="Enter Integration Targets"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="integration_targets"
                          component="p"
                        />
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.oneClm}>
                        <label>Tools In Scope</label>
                        <Field
                          name="tools_in_scope"
                          as="textarea"
                          placeholder="Enter Tools In Scope"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="tools_in_scope"
                          component="p"
                        />
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.oneClm}>
                        <label>Access Required List</label>
                        <Field
                          name="access_required_list"
                          as="textarea"
                          placeholder="Enter Access Required List"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="access_required_list"
                          component="p"
                        />
                      </span>
                    </div>
                    <div
                      className={`${styles.editInfoCol} ${styles.submitBtnRight}`}
                    >
                      <span>
                        {!sectionChanging ? (
                          <button
                            className={styles.submitBtn}
                            type="submit"
                            disabled={sectionChanging}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={sectionChanging}
                            className={styles.addMoreBtn}
                          >
                            <img
                              style={{ width: "80px", height: "30px" }}
                              src={Loader}
                              alt="loader"
                              className={styles.loaderImg}
                            />
                          </button>
                        )}
                      </span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          {/*  ****** COMMUNICATION SECTION ****** */}
          <div className={styles.LeaddetailsCol} id="communicationSection">
            <div className={styles.sectionHeading}>
              <h2>Communication</h2>
              {sectionName !== TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT &&
                !hideEditButton && (
                  <span
                    className={styles.editBtn}
                    onClick={() =>
                      editSection(
                        TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT
                      )
                    }
                  >
                    Edit <EditIcon />
                  </span>
                )}
              {sectionName ===
                TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT && (
                <span className={styles.cancelBtn} onClick={cancelEditSection}>
                  Cancel <CancelIcon />
                </span>
              )}
            </div>
            {sectionName !== TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT && (
              <div className={styles.viewInfo}>
                <div className={styles.editInfoCol}>
                  <span className={styles.borderRight}>
                    <label>Project Contact Name</label>
                    <p>
                      {communicationData?.client_project_contact_name || "N/A"}
                    </p>
                  </span>
                  <span className={`${styles.borderRight} ${styles.pl10}`}>
                    <label>Project Contact Email</label>
                    <p>
                      {communicationData?.client_project_contact_email || "N/A"}
                    </p>
                  </span>
                  <span className={`${styles.borderRight} ${styles.pl10}`}>
                    <label>Preferred Channel</label>
                    <p>{communicationData?.preferred_channel || "N/A"}</p>
                  </span>
                  <span className={styles.pl10}>
                    <label>Update Frequency</label>
                    <p>{communicationData?.update_frequency || "N/A"}</p>
                  </span>
                </div>
              </div>
            )}
            <div
              className={styles.editInfo}
              style={{
                display:
                  sectionName === TemplateNoteEnum.PROJECT_COMMUNICATION_CONTACT
                    ? "block"
                    : "none",
              }}
            >
              <Formik
                initialValues={communicationInitialFormValue}
                validationSchema={communicationFormValidationSchema}
                onSubmit={(val) => saveCommunicationSection(val)}
                innerRef={communicationFormFormikRef}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className={styles.editInfoCol}>
                      <span>
                        <label>Client Project Contact Name</label>
                        <Field
                          name="client_project_contact_name"
                          placeholder="Enter Client Project Contact Name"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="client_project_contact_name"
                          component="p"
                        />
                      </span>
                      <span>
                        <label>Project Contact Email</label>
                        <Field
                          name="client_project_contact_email"
                          placeholder="Enter Project Contact Email"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="client_project_contact_email"
                          component="p"
                        />
                      </span>
                      <span>
                        <label>Preferred Channel</label>
                        <Field name="preferred_channel" as="select">
                          <option value="">Select Option</option>
                          <option value="Email">Email</option>
                          <option value="Slack">Slack</option>
                          <option value="Teams">Teams</option>
                          <option value="Meeting">Meeting</option>
                        </Field>
                        <ErrorMessage
                          className={styles.error}
                          name="preferred_channel"
                          component="p"
                        />
                      </span>
                      <span>
                        <label>Update Frequency</label>
                        <Field name="update_frequency" as="select">
                          <option value="">Select Option</option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Bi Weekly">Bi Weekly</option>
                          <option value="As Needed">As Needed</option>
                        </Field>
                        <ErrorMessage
                          className={styles.error}
                          name="update_frequency"
                          component="p"
                        />
                      </span>
                    </div>
                    <div
                      className={`${styles.editInfoCol} ${styles.submitBtnRight}`}
                    >
                      <span>
                        {!sectionChanging ? (
                          <button
                            className={styles.submitBtn}
                            type="submit"
                            disabled={sectionChanging}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={sectionChanging}
                            className={styles.addMoreBtn}
                          >
                            <img
                              style={{ width: "80px", height: "30px" }}
                              src={Loader}
                              alt="loader"
                              className={styles.loaderImg}
                            />
                          </button>
                        )}
                      </span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          {/*  ****** INTERNAL NOTE SECTION ****** */}
          <div className={styles.LeaddetailsCol} id="InternalNoteSection">
            <div className={styles.sectionHeading}>
              <h2>Internal Note</h2>
              {sectionName !== TemplateNoteEnum.INTERNAL_NOTE &&
                !hideEditButton && (
                  <span
                    className={styles.editBtn}
                    onClick={() => editSection(TemplateNoteEnum.INTERNAL_NOTE)}
                  >
                    Edit <EditIcon />
                  </span>
                )}
              {sectionName === TemplateNoteEnum.INTERNAL_NOTE && (
                <span className={styles.cancelBtn} onClick={cancelEditSection}>
                  Cancel <CancelIcon />
                </span>
              )}
            </div>
            {sectionName !== TemplateNoteEnum.INTERNAL_NOTE && (
              <div className={styles.viewInfo}>
                <div className={styles.editInfoCol}>
                  <span className={`${styles.borderRight} ${styles.clmTwo}`}>
                    <label>Risk and Warnings</label>
                    <p>
                      {internalNoteData?.internal_risks_and_warnings || "N/A"}
                    </p>
                  </span>
                  <span className={`${styles.borderRight} ${styles.clmTwo}`}>
                    <label>Margin Sensitivity</label>
                    <p>
                      {internalNoteData?.internal_margin_sensitivity || "N/A"}
                    </p>
                  </span>
                </div>
                <div className={styles.editInfoCol}>
                  <span className={styles.clmOne}>
                    <label>Note</label>
                    <p>{internalNoteData?.internal_notes || "N/A"}</p>
                  </span>
                </div>
              </div>
            )}
            <div
              className={styles.editInfo}
              style={{
                display:
                  sectionName === TemplateNoteEnum.INTERNAL_NOTE
                    ? "block"
                    : "none",
              }}
            >
              <Formik
                initialValues={internalNoteInitialFormValue}
                validationSchema={internalNoteValidationSchema}
                onSubmit={(val) => saveInternalNoteSection(val)}
                innerRef={internalNoteFormFormikRef}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className={styles.editInfoCol}>
                      <span className={styles.twoClm}>
                        <label>Risk and Warnings</label>
                        <Field
                          name="internal_risks_and_warnings"
                          placeholder="Enter Risk and Warnings"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="internal_risks_and_warnings"
                          component="p"
                        />
                      </span>
                      <span className={styles.twoClm}>
                        <label>Margin Sensitivity</label>
                        <Field name="internal_margin_sensitivity" as="select">
                          <option value="">Select Option</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </Field>
                        <ErrorMessage
                          className={styles.error}
                          name="internal_margin_sensitivity"
                          component="p"
                        />
                      </span>
                    </div>
                    <div className={styles.editInfoCol}>
                      <span className={styles.oneClm}>
                        <label>Note</label>
                        <Field
                          name="internal_notes"
                          placeholder="Enter Note"
                          as="textarea"
                        />
                        <ErrorMessage
                          className={styles.error}
                          name="internal_notes"
                          component="p"
                        />
                      </span>
                    </div>
                    <div
                      className={`${styles.editInfoCol} ${styles.submitBtnRight}`}
                    >
                      <span>
                        {!sectionChanging ? (
                          <button
                            className={styles.submitBtn}
                            type="submit"
                            disabled={sectionChanging}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={sectionChanging}
                            className={styles.addMoreBtn}
                          >
                            <img
                              style={{ width: "80px", height: "30px" }}
                              src={Loader}
                              alt="loader"
                              className={styles.loaderImg}
                            />
                          </button>
                        )}
                      </span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      )}
      <TechnicianBidding
        open={biddingModalOpen}
        packageId={selectedPackageId}
        onClose={closeBiddingModal}
      />
    </div>
  );
});
export default ViewAndEditTemplateNote;
