/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styles from "./userList.module.scss";
import api from "../../../services/api";
import Pagination from "@mui/material/Pagination";
import alert from "../../../services/alert";
import endpoints from "../../../helpers/endpoints";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { UserListInterface } from "../../../interfaces/userInterface";
import { useNavigate } from "react-router-dom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import {confirmationAlert} from "../../../services/confirmationAlert";
import AssignUserModal from "../../../modal/assign-user/assignUserModal";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserListInterface[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(30);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [assignUserModalOpen, setAssignUserModalOpen] = useState<boolean>(false);
  const [assignUserId, setAssignUserId] = useState<string>("");
  const delay = 300;
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [page, size, keyword]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `${endpoints.user.getUsers}?page=${page}&limit=${size}${
          keyword ? `&keyword=${keyword}` : ""
        }`
      );
      if (res.status === 200) {
        setUsers(res.data?.data?.users || []);
        setTotalPage(res.data?.data?.meta.pages || 0);
      }
    } catch (error: any) {
      alert(error?.response?.data?.detail || error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(inputValue);
      setPage(1);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setActiveUserId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveUserId(null);
  };

  const navigateToUpdateUser = (userId: string) => {
    navigate(`/update-user/${userId}`);
  };

  const navigateToCreateUser = () => {
    navigate(`/create-user`);
  };
    const navigateToAssignUserLeadList = (userId: string) => {
    navigate(`/assigned-leads/${userId}`);
  };
  
   const deleteUser = async (userId: string) => {
    confirmationAlert().then((result) => {
      if (result.isConfirmed) {
        api.delete(endpoints.user.deleteUser(userId)).then((res) => {
          if (res.status === 200) {         
            alert(res.data?.message, "success");
            getUsers();
          }
        }).catch((error) => {
          alert(error?.response?.data?.detail || error?.message, "error");
        });
      }
    })
  };
  const openAssignUserModal = (userId: string) => {
    setAssignUserModalOpen(true);
    setAssignUserId(userId);
  };
  const closeAssignUserModal = () => {
    setAssignUserModalOpen(false);
    setAssignUserId("");
  }

  return (
    <>
      <div className={styles.productListBdyPrt}>
        <div className={styles.productListHdrPrt}>
          <div className={styles.container}>
            <div className={styles.productListHdrRow}>
              <div className={styles.productListTitle}>
                <h1>User List</h1>
              </div>
              <div className={styles.productListRightPrt}>
                <ul>
                  <li className={styles.productSearchField}>
                    <form>
                      <input
                        type="search"
                        placeholder="Search users"
                        value={inputValue}
                        onChange={handleKeywordChange}
                      />
                      <img
                        src="images/search-icon.svg"
                        alt="search icon"
                        className={styles.productSrchIcon}
                      />
                    </form>
                  </li>
                  <li  onClick={navigateToCreateUser}>
                    <Fab color="primary" aria-label="add" size="small">
                      <AddIcon />
                    </Fab>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productListViewPrt}>
          <div className={styles.container}>
            <div className={styles.tableHead}>
              <ul>
                <li>Name</li>
                <li>Email</li>
                <li>Role</li>
                <li>Action</li>
              </ul>
            </div>
            {users.map((user) => (
              <div className={styles.tableRow} key={user.id}>
                <ul>
                  <li data-label="Name">
                    <p>{user.name}</p>
                  </li>

                  <li data-label="Email">
                    <p>{user.email}</p>
                  </li>

                  <li data-label="Role">
                    <p>{user.role}</p>
                  </li>

                  <li data-label="Action" className={styles.actionCell}>
                    <div>
                      <IconButton
                        className={styles.actionBtn}
                        aria-label="more"
                        id="long-button"
                        aria-controls={activeUserId === user.id ? "long-menu" : undefined}
                        aria-expanded={activeUserId === user.id ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, user.id)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={activeUserId === user.id}
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
                            navigateToUpdateUser(user.id);
                          }}
                        >
                          Edit
                        </MenuItem>
                        {user.role === "User" && (
                          <div>
                          <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            openAssignUserModal(user.id);
                          }}
                        >
                          Assign City & Sector
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigateToAssignUserLeadList(user.id);
                          }}
                        >
                          Assigned Leads
                        </MenuItem>
                        </div>
                        )}
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            deleteUser(user.id);
                          }}>Delete</MenuItem>
                      </Menu>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <AssignUserModal open={assignUserModalOpen} onClose={closeAssignUserModal} userId={assignUserId}/>

        <div className={styles.container}>
          {users.length === 0 && !loading && (
            <p className={styles.loader}>No user available.</p>
          )}
          {loading && <p className={styles.loader}>Please wait...</p>}
          {users.length > 0 && (
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
    </>
  );
};

export default UserList;
