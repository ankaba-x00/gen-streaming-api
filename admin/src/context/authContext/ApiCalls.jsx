import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./AuthActions";

export const loginCall = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/api/auth/login", user);
    if (res.data.role !== "ADMIN") {
      throw new Error("Permission denied!");
    }
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
    console.error(err);
    throw err;
  }
};