/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./create-update-user.module.scss";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import api from "../../../services/api";
import alert from "../../../services/alert";
import endpoints from "../../../helpers/endpoints";
import { UserInterface } from "../../../interfaces/userInterface";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";

const CreateUpdateUser: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<UserInterface>>(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  useEffect(() => {
    if (userId) getUserInfo();
  }, []);
  const initialUser: UserInterface = {
    name: "",
    email: "",
    role: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: userId
      ? Yup.string().min(8, "Password must be at least 8 characters")
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
  });
  const handleSubmit = async (Value: UserInterface) => {
    setLoading(true);
    try {
      const apiEndpoint = userId
        ? api.put(endpoints.user.updateUser(userId), Value)
        : api.post(endpoints.user.createUser, Value);
      const res = await apiEndpoint;
      if (res.data) {
        alert(res.data?.message, "success");
        navigate("/user-list");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await api.get(endpoints.user.getUserDetails(userId!));
      if (res.status === 200) {
        const data: UserInterface = res.data;
        formikRef.current?.setValues({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
          password: "",
        });
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message, "error");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={styles.myProfileBdyPrt}>
        <div className={styles.container}>
          <div className={styles.myProfileBdyRow}>
            {/* <div className={styles.myProfileLeftPrt}>
              <div className={styles.profileImgPrt}>
                <img
                  src={profileInfo?.profilePictureUrl || noProfileImage}
                  alt='Profile'
                  className={styles.profileImg}
                />
                <div className={styles.profileCameraIcon}>
                  <img
                    src='images/camera-icon.svg'
                    alt='camera icon'
                  />
                </div>
              </div>
              <div className={styles.editProfileBtn}>
               <button onClick={editProfile} disabled={loading}>
                  <i className={`fa-solid ${editableForm ? "fa-save" : "fa-pencil"}`}></i> <span>{editableForm ? "Save" : "Edit Profile"}</span>
                </button>
              </div>
            </div> */}
            <div className={styles.myProfileRightPrt}>
              <h1>{userId ? "Update" : "Add"} User</h1>
              <div className={styles.smartLinerFormClmTwo}>
                <Formik
                  initialValues={initialUser}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  innerRef={formikRef}
                >
                  <Form>
                    <ul>
                      <li>
                        <label>Name</label>
                        <Field name="name" placeholder="Enter User Name" />
                        <ErrorMessage
                          name="name"
                          component="p"
                          className={styles.errorMessage}
                        />
                      </li>
                      <li>
                        <label>Email</label>
                        <Field
                          name="email"
                          autoComplete="off"
                          placeholder="Enter User Email Address"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className={styles.errorMessage}
                        />
                      </li>
                      <li>
                        <label htmlFor="roleOptions">Role</label>
                        <div className={styles.selectSec}>
                          <Field
                          as="select"
                          name="role"
                          id="roleOptions"
                        >
                          <option value="">Select an option</option>
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                        </Field>
                        </div>
                        <ErrorMessage
                          name="role"
                          component="p"
                          className={styles.errorMessage}
                        />
                      </li>
                      <li>
                        <label>Password</label>
                        <div className={styles.passField}>
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Enter Password"
                          />
                          <span
                            className={styles.visibilityIcon}
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="p"
                          className={styles.errorMessage}
                        />
                      </li>
                    </ul>
                    <div className={styles.mt30}>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                      >
                        {userId ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
              {/* <p>
                If you would like to change anything in your account, to reach
                out to
                <Link to={"#"}>orders@krameramerica.com</Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateUpdateUser;
