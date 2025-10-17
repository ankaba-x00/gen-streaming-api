import "./ListList.scss";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Notification from "../../components/notification/Notification";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { deleteList, getLists } from "../../context/listContext/ApiCalls";

export default function ListList() {
  const { lists, dispatch } = useContext(ListContext);

  useEffect(() => {
    getLists(dispatch)
  }, [dispatch])

  const [controlWindow, setControlWindow] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDelete = (list) => {
    setListToDelete(list);
    setControlWindow(true);
  }

  const handleConfirmDelete = async () => {
    if (listToDelete) {
      await deleteList(listToDelete._id, dispatch);
      setSnackbarOpen(true);
    }
    setControlWindow(false);
    setListToDelete(null);
  }

  const handleRejectDelete = () => {
    setControlWindow(false);
    setListToDelete(null);
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 50, headerAlign: "center", align: "center" },
    { field: "title", headerName: "TITLE", width: 275, headerAlign: "center", align: "center" },
    { field: "type", headerName: "TYPE", width: 80, headerAlign: "center", align: "center", renderCell: (params) => (
      <span>{params.row.type.charAt(0).toUpperCase() + params.row.type.slice(1)}</span>
    ) },
    { field: "genre", headerName: "GENRE", width: 275, headerAlign: "center", align: "center", renderCell: (params) => (
      <span>{params.row.genre.toString()}</span>
    ) },
    { field: "content", headerName: "COUNT", width: 60, headerAlign: "center", align: "center", renderCell: (params) => (
      <span>{params.row.content.length }</span>
    )},
    { field: "action", headerName: "ACTION", width: 100, headerAlign: "center", align: "center", renderCell: (params) => {
      return (
        <div className="actions">
          <Link 
            to={{ pathname: "/list/"+params.row._id }}
            state={{ list: params.row }}
          >
            <button className="edit">Edit</button>
          </Link>
          <DeleteForever className="delete" onClick={() => {handleDelete(params.row)}}/>
        </div>
      )
    } },
  ];

  const paginationModel = { page: 0, pageSize: 10 };  

  return (
    <>
      <Paper 
        className="listlist" 
        sx={{ 
          height: "90vh", 
          width: "85vw",
          backgroundColor: "var(--clr-background)", 
          color: "var(--clr-font-prim)",
        }}>
        <DataGrid
          rows={lists}
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
            
            "& .MuiDataGrid-cell .list": {
              display: "flex",
              alignItems: "center",
              marginLeft: "-10px",
              height: "100%",
            },

            "& .MuiDataGrid-cell .list-img": {
              width: "32px !important",
              height: "32px !important",
              borderRadius: "50% !important",
              objectFit: "cover !important",
              marginRight: "10px !important",
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
        <DialogContent>Are you sure you want to delete <strong>{listToDelete?.title}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="error">Yes</Button>
          <Button onClick={handleRejectDelete}>No</Button>
        </DialogActions>
      </Dialog>
      <Notification
        snType="list deleted"
        snOpen={snackbarOpen}
        snClose={handleSnackbarClose} 
      />
    </>
  );
}
