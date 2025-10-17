import "./List.scss";
import { Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
// import Chart from "../../components/chart/Chart";
import Notification from "../../components/notification/Notification";
import validateList from "../../utils/validateList";
import { ListContext } from "../../context/listContext/ListContext";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { updateList } from "../../context/listContext/ApiCalls";
import { getMovies } from "../../context/movieContext/ApiCalls";

export default function List() {
  const location = useLocation();
  const [list, setList] = useState(location.state?.list);
  const [updatedList, setUpdatedList] = useState({});
  const updatedParams = useRef([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSeries, setShowSeries] = useState("all")
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
   
  const { dispatch: dispatchList } = useContext(ListContext);
  const { movies, dispatch: dispatchMovie } = useContext(MovieContext);

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Historical", "Horror", "Romance", "Sci-Fi", "Thriller", "Western"
  ];

  useEffect(() => {
    getMovies(dispatchMovie)
  }, [dispatchMovie]);

  useEffect(() => {
    if (list?.genre) {
      setSelectedGenre(list.genre);
    }
  }, [list]);
  
  const filteredItems = movies.filter((movie) => {
    const matchesSearchbar = 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()));

    const isSeries = movie.isSeries === true || movie.isSeries === "true";

    const currentType = updatedList.type || list.type;
    if (currentType === "movie" && isSeries) return false;
    if (currentType === "series" && !isSeries) return false;

    let matchesUserInput = true;
    if (showSeries === "true") matchesUserInput = isSeries === true;
    else if (showSeries === "false") matchesUserInput = isSeries === false;

    return matchesSearchbar && matchesUserInput;
  })
  
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (value !== "" && !updatedParams.current.includes(name)) updatedParams.current.push(name);
    
    setUpdatedList((prevList) => ({
      ...prevList,
      [name]: value
    }));
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre((prev) => {
      const updated = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      if (!prev.includes(genre) && !updatedParams.current.includes("genre")) updatedParams.current.push("genre");

      setUpdatedList((prevList) => ({
        ...prevList,
        genre: updated,
      }));

      return updated;
    });
  };

  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setUpdatedList((prevList) => ({ ...prevList, content: selectedValues }));
    
    if (!updatedParams.current.includes("content")) {
      updatedParams.current.push("content");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedList) return;
    
    const paramMap = [ "title", "type", "genre", "content" ];
    const nonUpdatedKeys = paramMap.filter(key => !updatedParams.current.includes(key));
    const mergedList = { ...list, ...updatedList };
    nonUpdatedKeys.forEach(key => {
      mergedList[key] = list[key];
    });

    const movieMap = new Map(movies.map(m => [m._id, m.isSeries]));
    const validationError = validateList(mergedList, movieMap);
    if (validationError) {
      setValidationMessage(validationError);
      setSnackbarValidationOpen(true);
      return;
    }
    
    try {
      await updateList(list._id, mergedList, dispatchList);
      setSnackbarOpen(true);
      setList(mergedList);
      console.log("List updated successfully!");
    } catch (error) {
      console.error("List update failed.", error);
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
    <div className="list">
      <div className="list-header">
        <h1>List Details</h1>
        <Link to="/newlist">
          <button className="add-list-btn">Add New List</button>
        </Link>
      </div>
      <div className="list-body">
        <div className="section-left">
          <div className="header">
            <span>{list.title}</span>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td className="class">list ID</td>
                <td className="entry">{list._id}</td>
              </tr>
              <tr>
                <td className="class">type</td>
                <td className="entry">{list.type.charAt(0).toUpperCase() + list.type.slice(1)}</td>
              </tr>
              <tr>
                <td className="class">genres</td>
                <td className="entry">{list.genre?.join(", ")}</td>
              </tr>
              {/* <tr>
                <td className="class">total sales</td>
                <td className="entry">{sales.inventory.reduce((sum, item) => sum + item.Sales, 0)}</td>
              </tr> */}
              <tr>
                <td className="class">count</td>
                <td className="entry">{list.content.length}</td>
              </tr>
              <tr>
                <td className="class">content</td>
                <td className="entry">
                  {list.content.map((item, index) => {
                    const movieItem = movies.find((m) => m._id === item);
                    return (
                      <span key={index}>
                        {movieItem ? `${movieItem.title} - ${movieItem.year}` : "Unknown movie ID"} <br />
                      </span>
                    )})}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <Chart 
        className="section-right"
        data={sales.inventory} dataKey="Sales" title="Sales Performance" grid/> */}
      </div>
      <div className="list-footer">
        <div className="edit-title">Edit List</div>
        <form className="edit-form">
          <div className="left">
            <label htmlFor="title" className="label">List title</label>
            <input 
              className="text-input"
              type="text" 
              id="title"
              name="title"
              placeholder={list.title}
              minLength="1"
              maxLength="100"
              onChange={handleTextChange}
            />
            <label htmlFor="type" className="label">Media type</label>
            <select
              className="type-section"
              name="type"
              id="type"
              defaultValue={list.type}
              onChange={handleTextChange}
            >
              <option value="">---</option>
              <option value="movie">movie</option>
              <option value="series">series</option>
            </select>
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
          <div className="right">
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
                value={updatedList?.content ?? list?.content ?? []}
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
            <div className="upload-btn">
              <button 
                className="update-list-btn"
                onClick={handleUpdate}
              >Update
              </button>
            </div>
            <Notification
              snType="validation"
              snOpen={snackbarValidationOpen}
              snClose={handleSnackbarClose}
              snMessage={validationMessage}
            />
            <Notification
              snType="list updated"
              snOpen={snackbarOpen}
              snClose={handleSnackbarClose} 
            />
            <Notification
              snType="error"
              snOpen={snackbarErrorOpen}
              snClose={handleSnackbarClose} 
            />
          </div>
        </form>
      </div>
    </div>
  );
}
