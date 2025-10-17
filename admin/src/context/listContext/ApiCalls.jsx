import axios from "axios";
import { 
  getListsStart,
  getListsSuccess,
  getListsFailure,
  createListStart,
  createListSuccess,
  createListFailure,
  updateListStart,
  updateListSuccess,
  updateListFailure,
  deleteListStart,
  deleteListSuccess,
  deleteListFailure
} from "./ListActions";

// get lists
export const getLists = async (dispatch) => {
  dispatch(getListsStart());
  try {
    const res = await axios.get("/api/lists", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      }
    });
    dispatch(getListsSuccess(res.data));
  } catch (err) {
    dispatch(getListsFailure());
    console.error(err);
    throw err;
  }
};

// create list
export const createList = async (list, dispatch) => {
  dispatch(createListStart());
  try {
    const res = await axios.post("/api/lists", list, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      }
    });
    dispatch(createListSuccess(res.data));
  } catch (err) {
    dispatch(createListFailure());
    console.error(err);
    throw err;
  }
};

// update list
export const updateList = async (id, updatedList, dispatch) => {
  dispatch(updateListStart());
  try {
    const res = await axios.put("/api/lists/" + id, updatedList, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(updateListSuccess(res.data));
  } catch (err) {
    dispatch(updateListFailure());
    console.error(err);
    throw err;
  }
};

// delete list
export const deleteList = async (id, dispatch) => {
  dispatch(deleteListStart());
  try {
    await axios.delete("/api/lists/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      }
    });
    dispatch(deleteListSuccess(id));
  } catch (err) {
    dispatch(deleteListFailure());
    console.error(err);
    throw err;
  }
};