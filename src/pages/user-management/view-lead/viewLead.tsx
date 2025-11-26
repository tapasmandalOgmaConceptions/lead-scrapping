import React, { useEffect } from "react";
import styles from "./viewLead.module.scss";
import { useParams } from "react-router-dom";

const ViewLead: React.FC = () => {
  const { leadId } = useParams();
  useEffect(()=>{
    console.log(leadId);
  }, [leadId]);
  return (<div className={styles.parent}>
    
  <div className={styles.productListBdyPrt}>
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>Assigned Leads</h1>
              </div> 
            </div>

            <div className={styles.LeadcolRow}>
              <div className={styles.LeaddetailsCol}>
                <h2>Leads Details</h2>
                
                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Created At
                  </div>
                  <div className={styles.secColRight}>
                    11-24-2025 12:32:10 pm
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Phone No
                  </div>
                  <div className={styles.secColRight}>
                    (661) 945-7755
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    City
                  </div>
                  <div className={styles.secColRight}>
                    Lake Hughes
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Address
                  </div>
                  <div className={styles.secColRight}>
                    43932 15th St W #103, Lancaster
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Lead Status
                  </div>
                  <div className={styles.secColRight}>
                    Triple Positive
                  </div>
                </div>

                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Sector
                  </div>
                  <div className={styles.secColRight}>
                    Medical clinics
                  </div>
                </div>

                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Summary
                  </div>
                  <div className={styles.secColRight}>
                    Antelope Valley Kidney Institute | Rating: 3.7 (12 reviews)
                  </div>
                </div>


                
              </div> 
              <div className={styles.LeaddetailsCol}>
                <h2>Assign User</h2>
                
                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Name
                  </div>
                  <div className={styles.secColRight}>
                    Manoranjan Dash
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Role
                  </div>
                  <div className={styles.secColRight}>
                    Technician
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Phone No
                  </div>
                  <div className={styles.secColRight}>
                    (661) 945-7755
                  </div>
                </div>               

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Email Address
                  </div>
                  <div className={styles.secColRight}>
                    contact@gmail.com
                  </div>
                </div>
                
              </div> 
                           
            </div>

            <div className={styles.LeadcolRow}>
              
            <div className={styles.LeaddetailsCol}>
                <h2>Multiple Notes</h2>
                
                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Notes                    
                  </div>
                  <div className={styles.secColRight}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type 
                    specimen book.                    
                  </div>
                </div>

                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    User Name
                  </div>
                  <div className={styles.secColRight}>
                    Manoranjan Dash
                  </div>
                </div>

                 <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Phone No
                  </div>
                  <div className={styles.secColRight}>
                    (661) 945-7755
                  </div>
                </div> 

                <div className={styles.secRow}>
                  <div className={styles.secColleft}>
                    Email Address
                  </div>
                  <div className={styles.secColRight}>
                    contact@gmail.com
                  </div>
                </div>

                 
                
              </div> 
                            
            </div>

          </div>
        </div>
        
      </div>
    
    
    
    </div>);
};
export default ViewLead;
