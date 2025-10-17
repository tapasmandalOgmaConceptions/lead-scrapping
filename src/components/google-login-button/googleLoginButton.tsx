import React from "react";
import { AppDispatch } from "../../store";
import endpoints from "../../helpers/endpoints";
import api from "../../services/api";
import alert from "../../services/alert";
import { LoginResponse } from "../../interfaces/authInterface";
import { useGoogleLogin } from "@react-oauth/google";
import { setLogin } from "../../store/userSlice";
import styles from './googleLoginButton.module.scss';

interface GoogleButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  dispatch: AppDispatch;
}
const GoogleLoginButton: React.FC<GoogleButtonProps> = ({
  setLoading,
  loading,
  dispatch,
}) => {
  const handleGoogleSuccess = async (tokenResponse: {
    access_token: string;
  }) => {
    setLoading(true);
    try {
      const payload = {
        accessToken: tokenResponse.access_token,
      };
      const res = await api.post(endpoints.auth.googleLogin, payload);
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
              profileImage: data.user.profilePictureUrl,
            },
          })
        );
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Google login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = (errorResponse?: any) => {
    alert("Google login failed. Please try again.", "error");
    console.error("Google login error:", errorResponse);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    flow: "implicit",
  });

  return (
    <>
      <button onClick={() => googleLogin()} disabled={loading} type="button">
        <img src="images/google-icon.svg" alt="Google icon" className={styles.googleIcon} />
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleLoginButton;
