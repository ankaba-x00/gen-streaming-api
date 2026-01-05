import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./AuthActions";

export const loginCall = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/api/auth/login", user);
    dispatch(loginSuccess(res.data));
    return { 
      success: true 
    };
  } catch (err) {
    dispatch(loginFailure());
    const message =
      err?.response?.data ||
      "Login failed. Please try again.";
    return {
      success: false,
      message,
      status: err?.response?.status,
    };
  }
};