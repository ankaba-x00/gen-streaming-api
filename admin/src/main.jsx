import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { AuthContextProvider } from "./context/authContext/AuthContext";
import { MovieContextProvider } from "./context/movieContext/MovieContext.jsx";
import { ListContextProvider } from "./context/listContext/ListContext.jsx";
import App from "./App.jsx";
import { UserContextProvider } from "./context/userContext/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <MovieContextProvider>
        <ListContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </ListContextProvider>
      </MovieContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
