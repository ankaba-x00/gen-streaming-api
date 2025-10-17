import "./NewList.scss";
import { useContext, useEffect, useState } from "react"; 
import Notification from "../../components/notification/Notification";
import validateList from "../../utils/validateList";
import { ListContext } from "../../context/listContext/ListContext";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { createList } from "../../context/listContext/ApiCalls";
import { getMovies } from "../../context/movieContext/ApiCalls";
import { useNavigate } from "react-router-dom";

export default function NewMovie() {
  const [list, setList] = useState({});
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSeries, setShowSeries] = useState("all")
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const { dispatch: dispatchList } = useContext(ListContext);
  const { movies, dispatch: dispatchMovie } = useContext(MovieContext);
  const navigate = useNavigate();

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Historical", "Horror", "Romance", "Sci-Fi", "Thriller", "Western"
  ];

  useEffect(() => {
    getMovies(dispatchMovie)
  }, [dispatchMovie]);

  const filteredItems = movies.filter((movie) => {
    const matchesSearchbar = 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()));

    const isSeries = movie.isSeries === true || movie.isSeries === "true";

    if (list.type === "movie" && isSeries) return false;
    if (list.type === "series" && !isSeries) return false;

    let matchesUserInput = true;
    if (showSeries === "true") matchesUserInput = isSeries === true;
    else if (showSeries === "false") matchesUserInput = isSeries === false;

    return matchesSearchbar && matchesUserInput;
  })

  const handleTextChange = (e) => {
    const value = e.target.value;
    setList({...list, [e.target.name]: value})
    if (e.target.name === "type") {
      if (e.target.value === "movie") setShowSeries(false);
      else if (e.target.value === "series") setShowSeries(true);
      else setShowSeries("all");
    } 
  };

  const handleSelectChange = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value)
    setList({...list, [e.target.name]: value})
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre((prev) => {
      let updated;
      if (prev.includes(genre)) {
        updated = prev.filter((g) => g !== genre);
      } else {
        updated = [...prev, genre];
      }
      setList((prevList) => ({
        ...prevList,
        genre: updated,
      }));
      return updated;
    });
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!list) return;

    const movieMap = new Map(movies.map(m => [m._id, m.isSeries]));
    const validationError = validateList(list, movieMap);
    if (validationError) {
      setValidationMessage(validationError);
      setSnackbarValidationOpen(true);
      return;
    }
    try {
      await createList(list, dispatchList);
      setSnackbarOpen(true);
      console.log("List created successfully!");
      setTimeout(() => {
        navigate("/lists");
      }, 5000);
    } catch (error) {
      console.error("Creation failed:", error);
      setSnackbarErrorOpen(true);
    }
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setSnackbarErrorOpen(false);
    setSnackbarValidationOpen(false);
  };

  return (
    <div className="newlist">
      <div className="newlist-header">New List</div>
      <div className="newlist-form">

        <div className="section-left">
          <div className="enter-item">
            <label className="label" htmlFor="title">List title</label>
            <input 
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              minLength="1"
              maxLength="100"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label className="label" htmlFor="type">Media type</label>
            <select 
              name="type" 
              id="type"
              onChange={handleTextChange}
            >
              <option value="">---</option>
              <option value="movie">movie</option>
              <option value="series">series</option>
            </select>
          </div>
          <div className="genre-section">
            <span className="label">Genre</span>
            <div className="dropdown">
              {genres.map((genre) => (
                <label 
                  key={genre} 
                  className="dropdown-item"
                >
                  <input
                    type="checkbox"
                    name="genre"
                    value={genre}
                    checked={selectedGenre?.includes(genre) || false}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="section-right">
          <div className="content-section">
            <label className="label" htmlFor="content">List content</label>
            <input 
              className="searchbar"
              id="searchbar"
              type="text"
              placeholder="Search by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-toggle"
              id="filter-toggle"
              value={showSeries}
              onChange={(e) => setShowSeries(e.target.value)}
            >
              <option value="all">---</option>
              <option value="true">Series only</option>
              <option value="false">Movies only</option>
            </select>
            <select
              className="content-list"
              multiple
              name="content" 
              id="content"
              onChange={handleSelectChange}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title} | {movie.isSeries ? "series" : "movie"} - {movie.year} — {movie.genre.join(", ")}
                  </option>
                ))
              ) : (
                <option disabled>No results found</option>
              )}
            </select>
          </div>
          <div className="btn">
            <button
              className="newlist-btn"
              onClick={handleCreate}
            >Create</button>
          </div>
        </div>
        <Notification
          snType="validation"
          snOpen={snackbarValidationOpen}
          snClose={handleSnackbarClose}
          snMessage={validationMessage}
        />
        <Notification
          snType="list created"
          snOpen={snackbarOpen}
          snClose={handleSnackbarClose} 
        />
        <Notification
          snType="error"
          snOpen={snackbarErrorOpen}
          snClose={handleSnackbarClose} 
        />
      </div>
    </div>
  );
}
