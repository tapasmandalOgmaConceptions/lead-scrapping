import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import alert from "../../../services/alert";
import { Link } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import api from "../../../services/api";
import { LoginPayload, LoginResponse } from "../../../interfaces/authInterface";
import styles from "./login.module.scss";
import endpoints from "../../../helpers/endpoints";
import { setLogin } from "../../../store/userSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import GoogleLoginButton from "../../../components/google-login-button/googleLoginButton";

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const navigate = useNavigate();

  // Google Client ID
  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "";

  const handleSubmit = async (value: LoginPayload) => {
    setLoading(true);
    try {
      const res = await api.post(endpoints.auth.login, value);
      if (res.data) {
        const data: LoginResponse = res.data;
        alert(
          res.data?.message || "You have successfully logged in.",
          "success"
        );
        dispatch(
          setLogin({
            token: data.accessToken,
            userInfo: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              profileImage: null,
            },
          })
        );
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.detail || err?.message || "OTP send failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const initialValues = {
    email: "",
    password: "",
  };
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={styles.loginBodyPrt}>
        <div className={styles.container}>
          <div className={styles.verticalMiddleBox}>
            {/* <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> */}
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={(value) => handleSubmit(value)}
            >
              <Form>
                <div className={styles.loginFormBox}>
                  <div className={styles.loginBoxHdn}>
                    <h2>Sign in</h2>
                    {/* <p>Choose how you'd like to sign in</p> */}
                  </div>
                  {/* <div className={styles.googleSign}>
                    <GoogleLoginButton setLoading={setLoading} loading={loading} dispatch={dispatch} />
                  </div>
                  <div className={styles.loginOption}>
                    <p>or</p>
                  </div> */}
                  <div className={styles.loginFormField}>
                    <div>
                      <label htmlFor="email">Email Address</label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter Your Email Address"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className={styles.loginError}
                      />
                    </div>
                    <div>
                      <label htmlFor="email">Password</label>
                      <div className={styles.passField}>
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Your Password"
                        />
                        <span className={styles.visibilityIcon}  onClick={togglePasswordVisibility}>
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
                        className={styles.loginError}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={styles.submitBtn}
                    >
                      Login
                    </button>
                  </div>
                  <p className={styles.loginTermsService}>
                    <Link to="#">
                      Policies & Terms of Service
                    </Link>
                  </p>
                </div>
              </Form>
            </Formik>
            {/* </GoogleOAuthProvider> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
