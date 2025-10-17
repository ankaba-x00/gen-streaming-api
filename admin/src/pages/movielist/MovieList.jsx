import "./MovieList.scss";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Notification from "../../components/notification/Notification";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { deleteMovie, getMovies } from "../../context/movieContext/ApiCalls";
import storage from "../../firebase";
import { ref, listAll, deleteObject } from "firebase/storage";

export default function MovieList() {
  const { movies, dispatch } = useContext(MovieContext);

  useEffect(() => {
    getMovies(dispatch)
  }, [dispatch])

  const [controlWindow, setControlWindow] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDelete = (movie) => {
    setMovieToDelete(movie);
    setControlWindow(true);
  }

  const deleteMovieFolder = async (folderHash) => {
    try {
      const folderRef = ref(storage, `/media/${folderHash}/`);
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
    if (movieToDelete) {
      await deleteMovieFolder(movieToDelete.storageHash);
      await deleteMovie(movieToDelete._id, dispatch);
      setSnackbarOpen(true);
    }
    setControlWindow(false);
    setMovieToDelete(null);
  }

  const handleRejectDelete = () => {
    setControlWindow(false);
    setMovieToDelete(null);
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 50, headerAlign: "center", align: "center" },
    { field: "media", headerName: "MEDIA", width: 320, headerAlign: "center", renderCell: (params) => {
      return (
        <div className="movie">
          <img className="movie-img" src={params.row.img} alt=""/>
          {params.row.title}
        </div>
      )
    } },
    { field: "type", headerName: "TYPE", width: 70, headerAlign: "center", align: "center", renderCell: (params) => (
      <span>{params.row.isSeries ? "Series" : "Movie"}</span>
    )},
    { field: "genre", headerName: "GENRE", width: 300, headerAlign: "center", align: "center", renderCell: (params) => (
      <span>{params.row.genre.toString()}</span>
    )},
    { field: "year", headerName: "YEAR", width: 60, headerAlign: "center", align: "center" },
    { field: "duration", headerName: "DURATION", width: 90, headerAlign: "center", align: "center" },
    { field: "limit", headerName: "LIMIT", width: 60, headerAlign: "center", align: "center" },
    { field: "action", headerName: "ACTION", width: 100, headerAlign: "center", align: "center", renderCell: (params) => {
      return (
        <div className="actions">
          <Link 
            to={{ pathname: "/movie/"+params.row._id }}
            state={{ movie: params.row }}
          >
            <button className="edit">Edit</button>
          </Link>
          <DeleteForever className="delete" onClick={() => {handleDelete(params.row)}}/>
        </div>
      )
    }},
  ];

  const paginationModel = { page: 0, pageSize: 10 };  

  return (
    <>
      <Paper 
        className="movielist" 
        sx={{ 
          height: "90vh", 
          width: "85vw",
          backgroundColor: "var(--clr-background)", 
          color: "var(--clr-font-prim)",
        }}>
        <DataGrid
          rows={movies}
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
            
            "& .MuiDataGrid-cell .movie": {
              display: "flex",
              alignItems: "center",
              marginLeft: "-10px",
              height: "100%",
            },

            "& .MuiDataGrid-cell .movie-img": {
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
        <DialogContent>Are you sure you want to delete <strong>{movieToDelete?.title}</strong>?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="error">Yes</Button>
          <Button onClick={handleRejectDelete}>No</Button>
        </DialogActions>
      </Dialog>
      <Notification
        snType="movie deleted"
        snOpen={snackbarOpen}
        snClose={handleSnackbarClose} 
      />
    </>
  );
}
