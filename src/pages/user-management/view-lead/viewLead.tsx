import React, { useEffect } from "react";
import styles from "./viewLead.module.scss";
import { useParams } from "react-router-dom";

const ViewLead: React.FC = () => {
  const { leadId } = useParams();
  useEffect(()=>{
    console.log(leadId);
  }, [leadId]);
  return (<div className={styles.parent}>View lead component</div>);
};
export default ViewLead;
