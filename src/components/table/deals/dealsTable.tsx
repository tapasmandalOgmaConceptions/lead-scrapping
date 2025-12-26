import React, { useState } from "react";
import styles from "./dealsTable.module.scss";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { DealResponse } from "../../../interfaces/templateNoteInterface";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DealTable: React.FC<{ deals: DealResponse[]; loading: boolean }> = ({
  deals,
  loading,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    userId: string
  ) => {
    setActiveDealId(userId);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveDealId(null);
  };
  const navigateDealsDetails = (leadId: string) => {
    navigate(`/view-lead/${leadId}`);
  };
  return (
    <div>
        <h2 style={{color:"white"}}>Deals</h2>
      <div className={styles.productListViewPrt}>
        <div className={styles.container}>
          <div className={styles.tableHead}>
            <ul>
              <li>Client Name</li>
              <li>Contact Email</li>
              <li>Contact Phone</li>
              <li>Industry</li>
              <li>Deal Name</li>
              <li>Deal Close date</li>
              <li>Sector Package</li>
              <li>Action</li>
            </ul>
          </div>
          {deals.map((deal) => (
            <div className={styles.tableRow} key={deal.id}>
              <ul>
                <li data-label="Client Name">
                  <p>{deal.client_name}</p>
                </li>

                <li data-label="Contact Email">
                  <p>{deal.primary_contact_email}</p>
                </li>
                <li data-label="Contact Phone">
                  <p>{deal.primary_contact_phone}</p>
                </li>
                <li data-label="Industry">
                  <p>{deal.industry}</p>
                </li>
                <li data-label="Deal Name">
                  <p>{deal.deal_name}</p>
                </li>
                <li data-label="Deal Close date">
                  <p>{moment(deal.deal_close_date).format("MM-DD-YYYY")}</p>
                </li>
                <li data-label="Sector Package">
                  <p>{deal.sector_package.name}</p>
                </li>

                <li data-label="Action" className={styles.actionCell}>
                  <div>
                    <IconButton
                      className={styles.actionBtn}
                      aria-label="more"
                      id="long-button"
                      aria-controls={
                        activeDealId === deal.id ? "long-menu" : undefined
                      }
                      aria-expanded={
                        activeDealId === deal.id ? "true" : undefined
                      }
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, deal.id)}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={activeDealId === deal.id}
                      onClose={handleMenuClose}
                      slotProps={{
                        paper: {
                          style: {
                            maxHeight: 48 * 4.5,
                            width: "20ch",
                            borderRadius: "10px",
                          },
                        },
                        list: {
                          className: styles.actionDropDown,
                          "aria-labelledby": "long-button",
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigateDealsDetails(deal.lead_id)
                        }}
                      >
                        View Details
                      </MenuItem>
                    </Menu>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        {deals.length === 0 && !loading && (
          <p className={styles.loader}>No data available.</p>
        )}
        {loading && <p className={styles.loader}>Please wait...</p>}
      </div>
    </div>
  );
};
export default DealTable;
