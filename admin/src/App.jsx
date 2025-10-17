import "./App.scss";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./pages/userlist/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newuser/NewUser";
import MovieList from "./pages/movielist/MovieList";
import Movie from "./pages/movie/Movie";
import NewMovie from "./pages/newmovie/NewMovie";
import ListList from "./pages/listlist/ListList";
import List from "./pages/list/List";
import NewList from "./pages/newlist/NewList";
import useLocalStorage from "use-local-storage";
import { useContext, useEffect } from "react";
import Login from "./pages/login/Login";
import { AuthContext } from "./context/authContext/AuthContext";

function PrivateRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace/>;
  return children;
}

function AuthLayout({ isDark, toggleDark, children }) {
  return (
    <>
      <Topbar isChecked={isDark} handleChange={toggleDark}/>
      <div className="container">
        <Sidebar />
        {children}
      </div>
    </>
  )
}

export default function App() {
  const { user } = useContext(AuthContext);
  const [isDark, setIsDark] = useLocalStorage("isDark", false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const handleChange = (e) => {
      setIsDark(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [setIsDark])

  const toggleDark = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <div className="page" dark-mode={isDark ? "true" : "false"}>
        <Routes>
          <Route 
            path="/login" 
            element={ user ? <Navigate to="/" replace /> : <Login isChecked={isDark} handleChange={toggleDark} /> } 
          />
          <Route 
            path="/*"
            element ={
              <PrivateRoute user={user}>
                <AuthLayout isDark={isDark} toggleDark={toggleDark}>
                  <Routes>
                    <Route path="/" element={ <Home /> }/>
                    <Route path="/users" element={ <UserList /> }/> 
                    <Route path="/user/:userid" element={ <User /> }/>
                    <Route path="/newuser" element={ <NewUser /> }/>
                    <Route path="/movies" element={ <MovieList /> }/>
                    <Route path="/movie/:movieid" element={ <Movie /> }/>
                    <Route path="/newmovie" element={ <NewMovie /> }/>
                    <Route path="/lists" element={ <ListList /> }/>
                    <Route path="/list/:listid" element={ <List /> }/>
                    <Route path="/newlist" element={ <NewList /> }/>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AuthLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
