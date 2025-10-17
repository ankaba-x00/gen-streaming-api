import "./UserList.scss";
import { DataGrid } from "@mui/x-data-grid";
import avatar from "../../assets/profile_avatar.png";
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Notification from "../../components/notification/Notification"; 
import { DeleteForever } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { deleteUser, getUsers } from "../../context/userContext/ApiCalls";
import storage from "../../firebase";
import { ref, listAll, deleteObject } from "firebase/storage";

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);

  useEffect(() => {
      getUsers(dispatch)
    }, [dispatch])

  const [controlWindow, setControlWindow] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setControlWindow(true);
  }

  const deleteUserFolder = async (folderHash) => {
    try {
      const folderRef = ref(storage, `/user/${folderHash}/`);
      const folderContents = await listAll(folderRef);
      const deletePromises = folderContents.items.map(fileRef => deleteObject(fileRef));
      await Promise.all(deletePromises);
      console.log(`Successfully deleted folder: ${folderHash}`);
    } catch (error) {
      console.error("Error deleting folder in Firebase Storage:", error);
      throw error;
    }
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUserFolder(userToDelete.storageHash);
      await deleteUser(userToDelete._id, dispatch);
      setSnackbarOpen(true);
    }
    setControlWindow(false);
    setUserToDelete(null);
  }

  const handleRejectDelete = () => {
    setControlWindow(false);
    setUserToDelete(null);
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 50,headerAlign: "center", align: "center" },
    { field: "user", headerName: "USER", width: 220, headerAlign: "center", renderCell: (params) => {
      return (
        <div className="user">
          <img className="user-avatar" src={params.row.imgProfile || avatar} alt=""/>
          {params.row.name}
        </div>
      )
    } },
    { field: "username", headerName: "USERNAME", width: 180, headerAlign: "center", align: "center" },
    { field: "email", headerName: "EMAIL", width: 220, headerAlign: "center", align: "center" },
    { field: "isAdmin", headerName: "ADMIN", width: 90, headerAlign: "center", align: "center" },
    { field: "isActive", headerName: "STATUS", width: 90, headerAlign: "center", align: "center" },
    { field: "action", headerName: "ACTION", width: 100, headerAlign: "center", align: "center", renderCell: (params) => {
      return (
        <div className="actions">
          <Link
            to={{ pathname: "/user/"+params.row._id }}
            state={{ user: params.row }}
          >
            <button className="edit">Edit</button>
          </Link>
          <DeleteForever className="delete" onClick={() => handleDelete(params.row)}
          />
        </div>
      )
    }},
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  
  return (
    <>
      <Paper 
        className="userlist" 
        sx={{ 
          height: "90vh", 
          width: "85vw",
          backgroundColor: "var(--clr-background)", 
          color: "var(--clr-font-prim)",
        }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          checkboxSelection
          disableVirtualization
          sx={{ 
            border: 0,
            backgroundColor: "var(--clr-background)",
            color: "var(--clr-font-prim)",

            // Header row
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--clr-background) !important",
              color: "var(--clr-font-prim) !important",
            },

            // Individual header cells
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--clr-background) !important",
              color: "var(--clr-font-prim) !important",
            },

            // Header titles
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "var(--clr-font-prim) !important",
            },

            // Empty filler cell (right side of header row)
            "& .MuiDataGrid-columnHeader--empty": {
              backgroundColor: "var(--clr-background) !important",
            },
            
            // The empty filler at the far right of the header
            "& .MuiDataGrid-columnHeadersInner, & .MuiDataGrid-filler": {
              backgroundColor: "var(--clr-background) !important",
            },

            // Separator lines between header cells
            "& .MuiDataGrid-columnSeparator": {
              color: "var(--clr-font-prim) !important",
              opacity: 0.3,
            },

            // Body cells
            "& .MuiDataGrid-cell": {
              backgroundColor: "var(--clr-background)",
              color: "var(--clr-font-prim)",
            },

            // Checkbox color
            "& .MuiCheckbox-root svg": {
              fill: "var(--clr-font-prim)",
            },

            // Footer
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "var(--clr-background)",
              color: "var(--clr-font-prim)",
            },

            // Scroller
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "var(--clr-background)",
            },

            // Pagination buttons
            "& .MuiTablePagination-root, & .MuiButtonBase-root": {
            color: "var(--clr-font-prim)",
            },

            // rows-per-page select box
            "& .MuiTablePagination-selectIcon": {
              fill: "var(--clr-font-prim)",
            },
          }}
        />
      </Paper>
      <Dialog open={controlWindow} onClose={handleRejectDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete <strong>{userToDelete?.username}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="error">Yes</Button>
          <Button onClick={handleRejectDelete}>No</Button>
        </DialogActions>
      </Dialog>
      <Notification
        snType="user deleted"
        snOpen={snackbarOpen}
        snClose={handleSnackbarClose} 
      />
    </>
  );
}
