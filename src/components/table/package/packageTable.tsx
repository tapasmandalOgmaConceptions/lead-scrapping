/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./packageTable.module.scss";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import { PackageListProps } from "../../../interfaces/packagesInterface";
import Pagination from "@mui/material/Pagination";

const PackageTable: React.FC<PackageListProps> = ({
  packages,
  loading,
  tabName,
  setPageValue,
  setKeyword,
  page,
  totalPage,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setKeyword(inputValue);
      setPageValue(1);
    }, 400);
    return () => clearTimeout(timeOut);
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [tabName]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    packageId: string
  ) => {
    setActivePackageId(packageId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActivePackageId(null);
  };

  const navigateDealsDetails = (leadId: string, packageId: string) => {
    navigate(`/view-package/${leadId}?pkg=${packageId}`);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageValue(value);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Package</h2>
          <input
            type="text"
            placeholder="Search here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.productListViewPrt}>
        <div className={styles.container}>
          <div className={styles.tableHead}>
            <ul>
              <li>Package Name</li>
              <li>Type</li>
              <li>Price</li>
              <li>Bidding Duration</li>
              <li>Complexity</li>
              <li>Skills</li>
              <li>Action</li>
            </ul>
          </div>
          {packages.map((pkg) => (
            <div className={styles.tableRow} key={pkg.id}>
              <ul>
                <li data-label="Package Name">
                  <p>{pkg.package_title}</p>
                </li>

                <li data-label="Type">
                  <p>{pkg.package_type.name}</p>
                </li>
                <li data-label="Price">
                  <p>
                    {pkg.package_price_allocation
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(Number(pkg?.package_price_allocation))
                      : "N/A"}
                  </p>
                </li>
                <li data-label="Bidding Duration">
                  <p>
                    {pkg.bidding_duration_days
                      ? `${pkg.bidding_duration_days} days`
                      : "N/A"}
                  </p>
                </li>
                <li className={styles.noLineThrough} data-label="Complexity">
                  <p>{pkg.package_estimated_complexity}</p>
                </li>
                <li data-label="Skills">
                  <p>
                    {pkg.required_skills.map((skill) => skill.name).join(", ")}
                  </p>
                </li>

                <li data-label="Action" className={styles.actionCell}>
                  <div>
                    <IconButton
                      className={styles.actionBtn}
                      aria-label="more"
                      id="long-button"
                      aria-controls={
                        activePackageId === pkg?.id
                          ? "long-menu"
                          : undefined
                      }
                      aria-expanded={
                        activePackageId === pkg?.id ? "true" : undefined
                      }
                      aria-haspopup="true"
                      onClick={(event) =>
                        handleMenuClick(event, pkg?.id || "")
                      }
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={activePackageId === pkg?.id}
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
                          navigateDealsDetails(pkg.lead_id || "", pkg.id);
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
        {packages.length === 0 && !loading && (
          <p className={styles.loader}>No data available.</p>
        )}
        {loading && <p className={styles.loader}>Please wait...</p>}
        {packages.length > 0 && (
          <Pagination
            className={styles.productPagination}
            variant="outlined"
            shape="rounded"
            count={totalPage}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PackageTable;
