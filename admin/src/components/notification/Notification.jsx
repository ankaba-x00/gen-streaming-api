import "./Notification.scss";
import { Snackbar, Alert } from "@mui/material";

export default function Notification({snType, snOpen, snClose, snMessage="", snHide=3000}) {
  let snText;
  if (snType.includes("created")) {
    if (snType.includes("movie")) snText = "Movie successfully created!";
    else if (snType.includes("list")) snText = "List successfully created!";
    else if (snType.includes("user")) snText = "User successfully created!";
    snType = "success";
  } else if (snType.includes("updated")) {
    if (snType.includes("movie")) snText = "Movie successfully updated!";
    else if (snType.includes("list")) snText = "List successfully updated!";
    else if (snType.includes("user")) snText = "User successfully updated!";
    snType = "success";
  } else if (snType.includes("deleted")) {
    if (snType.includes("movie")) snText = "Movie successfully deleted!";
    else if (snType.includes("list")) snText = "List successfully deleted!";
    else if (snType.includes("user")) snText = "User successfully deleted!";
    snType = "success";
  } else if (snType === "upload") {
    snText = "Upload started ...";
    snType = "info";
  } else if (snType === "validation") {
    snText = snMessage;
    snType = "error";
  } else if (snType === "error") snText = "Upload or creation failed!";

  return (
    <Snackbar 
      open={snOpen} 
      autoHideDuration={snHide} 
      onClose={snClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      className={`snackbar snackbar-${snType}`}
    >
      <Alert 
        onClose={snClose}
        severity={snType}
        className={`snackbar_alert snackbar_alert-${snType}`}
      >
        {snText}
      </Alert>
    </Snackbar>
  )
}
