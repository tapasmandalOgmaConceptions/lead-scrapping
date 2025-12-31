/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./biddingHistory.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";
import {
  BiddingHistoryResponse,
  PackageBiddingHistoryModalProps,
} from "../../interfaces/templateNoteInterface";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Tooltip from '@mui/material/Tooltip';

const BiddingHistory: React.FC<PackageBiddingHistoryModalProps> = ({
  open,
  onClose,
  packageId,
}) => {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [historyData, setHistoryData] = useState<BiddingHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && packageId) getBiddingHistory();
  }, [packageId, open, page, size]);

  const getBiddingHistory = async () => {
    setHistoryData([]);
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.templateNote.workPackage.getBiddingHistory(packageId)}?page=${page}&limit=${size}`
      );
      if (res.status === 200) {
        setHistoryData(res.data?.data?.bids || []);
        setTotalPage(res.data?.data?.meta.pages || 0);
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
        setLoading(false);
    }
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  return (
    <Dialog
      className="tableDialog"
      open={open}
      keepMounted
      onClose={() => onClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={styles.modalBodyPart}>
        <DialogTitle>Bidding History</DialogTitle>
        <span className={styles.closeIcon} onClick={() => onClose()}>
          <CloseIcon />
        </span>
      </div>

      <DialogContent className="pt0s biddingHistoryModal">
        <div className={styles.biddingHistoryTable}>
          <div className={styles.tableHead}>
            <ul>
              <li>Created At</li>
              <li>Package Name</li>
              <li>Bidding Amount</li>
              <li>Technician Name</li>
              <li>Technician Email</li>
              <li>Note</li>
            </ul>
          </div>
          
          {historyData.map((history) => (
            <div className={styles.tableRow} key={history.id}>
              <ul>
                <li data-label="Created At">
                  <p>{moment(history.created_at).format("MM-DD-YYYY h:mm:ss a")}</p>
                </li>
                <li data-label="Package Name"><p>{history.work_package.package_title}</p></li>
                <li data-label="Bidding Amount">
                  <p>{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(history.bidding_amount))}</p>
                </li>
                <li data-label="Technician Name"><p>{history.technician.name}</p></li>
                <li data-label="Technician Email"><p>{history.technician.email}</p></li>
                <li data-label="Note" className={styles.tableTooltip}><p><Tooltip title={history.note} arrow><span>{history.note}</span></Tooltip></p></li>
              </ul>
            </div>
          ))}

          <div className={styles.container}>
            {historyData.length === 0 && !loading && (
            <p className={styles.loader}>No history available.</p>
          )}
          {loading && <p className={styles.loader}>Please wait...</p>}
            {historyData.length > 0 && (
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
      </DialogContent>
    </Dialog>
  );
};
export default BiddingHistory;
