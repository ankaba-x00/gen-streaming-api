import "./Movie.scss";
import { Link, useLocation } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { UploadFile } from "@mui/icons-material";
// import Chart from "../../components/chart/Chart";
import Notification from "../../components/notification/Notification";
import storage from "../../firebase";
import { ref, listAll, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import validateMovie from "../../utils/validateMovie";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { updateMovie } from "../../context/movieContext/ApiCalls";

export default function Movie() {
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie);
  const [updatedMovie, setUpdatedMovie] = useState({});
  const updatedParams = useRef([]);
  const [imgSm, setImgSm] = useState(null);
  const [previewSm, setPreviewSm] = useState(null);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(movie?.genre || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarUploadOpen, setSnackbarUploadOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const { dispatch } = useContext(MovieContext);

  const genres = [
    "Action", "Adventure", "Animation", "Children", "Comedy", "Crime", "Documentary",  "Drama", "Fantasy", "Historical", "Horror", "Musical", "Romance", "Sci-Fi", "Sports", "Thriller", "Western"
  ];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (value !== "" && !updatedParams.current.includes(name)) updatedParams.current.push(name);
    setUpdatedMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value
    }));
  };


  const handleGenreChange = (genre) => {
    setSelectedGenre((prev) => {
      const updated = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      if (!updatedParams.current.includes("genre")) updatedParams.current.push("genre");

      setUpdatedMovie((prevMovie) => ({
        ...prevMovie,
        genre: updated,
      }));

      return updated;
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = type === "video" || type === "trailer";
    const isImage = type === "img" || type === "imgSm";
    if (isVideo && !file.type.startsWith("video/")) {
      alert("Please upload a valid video file (e.g., MP4, MOV, WEBM).");
      return;
    }
    if (isImage && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (e.g., JPG, PNG, WEBP).");
      return;
    }
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    const fileActions = {
      img: () => { setImg(file); setPreview(previewUrl); },
      imgSm: () => { setImgSm(file); setPreviewSm(previewUrl); },
      trailer: () => { setTrailer(file); },
      video: () => { setVideo(file); },
    };
    if (fileActions[type]) {
      fileActions[type]();
      if (!updatedParams.current.includes(type)) updatedParams.current.push(type);
    }
  };

  const updateStorage = (items) => {
    return items.map((item) => {
      if (!item.file) return Promise.resolve(null);
      
      return new Promise(async (resolve, reject) => {
        try {
          const storageRef = ref(storage, `/media/${item.hash}/`);
          const storageFolder = await listAll(storageRef);

          const fileToDelete = storageFolder.items.find(item => item.name.includes(item.label))
          if (fileToDelete) {
            await deleteObject(fileToDelete);
            console.log(`Old ${item.label} file successfully deleted.`)
          }

          const newFileName = `${item.hash}/${Date.now()}_${item.label}_${item.file.name}`;
          const newStorageRef = ref(storage, `/media/${newFileName}`);

          const uploadTask = uploadBytesResumable(newStorageRef, item.file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log(`${item.label} is ${progress}% done`);
            },
            (error) => {
              console.error(`Storage upload error for ${item.label}:`, error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ [item.label]: url });
            }
          );
        } catch (error) {
          console.error("Storage list, deletion and creation error:", error);
          reject(error);
        }
      });
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedMovie) return;

    const noneFileMap = [ "title", "year", "duration", "limit", "isSeries", "genre", "imgSmText", "imgText", "imgSm", "img", "video", "trailer" ];
    const nonUpdatedKeys = noneFileMap.filter(key => !updatedParams.current.includes(key));
    const mergedMovie = { ...movie, ...updatedMovie };
      nonUpdatedKeys.forEach(key => {
      mergedMovie[key] = movie[key];
    });

    if (["imgSm","img","video","trailer"].some(key => updatedParams.current.includes(key))) {
      const fileMap = { img, imgSm, trailer, video };
      const hash = movie.storageHash;
      const fileArray = updatedParams.current
        .filter((param) => fileMap.hasOwnProperty(param))
        .map((type) => ({
          file: fileMap[type],
          label: type,
          hash
        }))

      setSnackbarUploadOpen(true);
      try {
        const uploadedItems = await Promise.all(
          updateStorage(fileArray)
        );
  
        setSnackbarUploadOpen(false);
        
        const finalUpdatedMovie = Object.assign({}, mergedMovie, ...uploadedItems.filter(Boolean));
        
        const validationError = validateMovie(finalUpdatedMovie);
        if (validationError) {
          setValidationMessage(validationError);
          setSnackbarValidationOpen(true);
          return;
        }

        await updateMovie(movie._id, finalUpdatedMovie, dispatch);
        setSnackbarOpen(true);
        setMovie(finalUpdatedMovie);
        console.log("Movie updated successfully!");
      } catch (error) {
        console.error("Movie upload or update failed.", error);
        setSnackbarErrorOpen(true);
      }
    } else {
      const validationError = validateMovie(mergedMovie);
      if (validationError) {
        setValidationMessage(validationError);
        setSnackbarValidationOpen(true);
        return;
      }
      
      try {
        await updateMovie(movie._id, mergedMovie, dispatch);
        setSnackbarOpen(true);
        setMovie(mergedMovie);
        console.log("Movie updated successfully!");
      } catch (error) {
        console.error("Movie update failed.", error);
        setSnackbarErrorOpen(true); 
      }
    }
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setSnackbarErrorOpen(false);
    setSnackbarUploadOpen(false);
    setSnackbarValidationOpen(false);
  };

  return (
    <div className="movie">
      <div className="movie-header">
        <h1>Media Details</h1>
        <Link to="/newmovie">
          <button className="add-movie-btn">Add New Media</button>
        </Link>
      </div>
      <div className="movie-body">
        <div className="section-left">
          <div className="header">
            <img src={movie.imgSm} alt="" />
            <span>{movie.title}</span>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <td className="class">media ID</td>
                <td className="entry">{movie._id}</td>
              </tr>
              <tr>
                <td className="class">release year</td>
                <td className="entry">{movie.year}</td>
              </tr>
              <tr>
                <td className="class">duration (<span>min</span>)</td>
                <td className="entry">{movie.duration}</td>
              </tr>
              <tr>
                <td className="class">age limit</td>
                <td className="entry">{movie.limit}</td>
              </tr>
              <tr>
                <td className="class">genres</td>
                <td className="entry">{movie.genre?.join(", ")}</td>
              </tr>
              {/* <tr>
                <td className="class">total sales</td>
                <td className="entry">{sales.inventory.reduce((sum, item) => sum + item.Sales, 0)}</td>
              </tr> */}
              <tr>
                <td className="class">Type</td>
                <td className="entry">{movie.isSeries ? "Series" : "Movie"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <Chart 
        className="section-right"
        data={sales.inventory} dataKey="Sales" title="Sales Performance" grid/> */}
      </div>
      <div className="movie-footer">
        <div className="edit-title">Edit Media</div>
        <form className="edit-form">
          <div className="left">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title"
              name="title"
              placeholder={movie.title}
              minLength="1"
              maxLength="100"
              onChange={handleTextChange}
            />
            <label htmlFor="year">Release year</label>
            <input 
              type="number"
              min="1888"
              max="2030"
              id="year"
              name="year"
              placeholder={movie.year}
              className="short-input"
              onChange={handleTextChange}
            />
            <label htmlFor="duration">Duration (min)</label>
            <input 
              type="number"
              min="1"
              max="900"
              id="duration"
              name="duration" 
              placeholder={movie.duration} className="short-input"
              onChange={handleTextChange}
            />
            <label htmlFor="limit">Age Limit</label>
            <input 
              type="text" 
              id="limit"
              name="limit"
              placeholder={movie.limit}
              className="short-input"
              onChange={handleTextChange}
            />
            <label htmlFor="isSeries">Type</label>
            <select
              name="isSeries"
              id="isSeries"
              defaultValue={movie.isSeries ? "true" : "false"}
              onChange={handleTextChange}
            >
              <option value="">---</option>
              <option value="false">Movie</option>
              <option value="true">Series</option>
            </select>
          </div>
          <div className="middle">
            <div className="section sec-left">
              <span className="label">Thumbnail Image</span>
              <div className="update-photo">
                <img 
                  src={previewSm || movie.imgSm} 
                  alt="preview current thumbnail img" 
                />
                <label htmlFor="file-imgSm">
                  <UploadFile className="icon"/>
                </label>
                <input 
                  type="file"
                  id="file-imgSm"
                  name="imgSm" 
                  accept="image/*"
                  onChange={e => handleFileChange(e, "imgSm")} 
                  style={{ display: "none" }}
                />
              </div>
              <div className="update-description">
                <label htmlFor="description-imgSm">Thumbnail Description</label>
                <textarea
                  className="enter-text" 
                  id="description-imgSm"
                  placeholder={movie.imgSmText}
                  name="imgSmText"
                  minLength="25"
                  maxLength="250"
                  onChange={handleTextChange}
                ></textarea>
              </div>
            </div>
            <div className="section sec-right">
              <span className="label">Featured Image</span>
              <div className="update-photo">
                <img 
                  src={preview || movie.img} 
                  alt="preview current feature img" 
                />
                <label htmlFor="file-img">
                  <UploadFile className="icon"/>
                </label>
                <input 
                  type="file" 
                  id="file-img"
                  name="img" 
                  accept="image/*"
                  onChange={e => handleFileChange(e, "img")} 
                  style={{ display: "none" }}
                />
              </div>
              <div className="update-description">
                <label htmlFor="description-img">Featured Description</label>
                <textarea 
                  className="enter-text"
                  id="description-img" 
                  placeholder={movie.imgText} 
                  name="imgText" 
                  minLength="25"
                  maxLength="450"
                  onChange={handleTextChange}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="section">
              <span>Trailer Path</span>
              <div className="upload-source">
                <label htmlFor="trailer"></label>
                <input 
                  type="file" 
                  id="trailer"
                  name="trailer"
                  accept="video/*"
                  onChange={e => handleFileChange(e, "trailer")}
                />
              </div>
            </div>
            <div className="section">
              <span>Video Path</span>
              <div className="upload-source">
                <label htmlFor="video"></label>
                <input
                  type="file"
                  id="video"
                  name="video"
                  accept="video/*"
                  onChange={e => handleFileChange(e, "video")}
                />
              </div>
            </div>
            <div className="genre-section">
              <span className="label">Genres</span>
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
            <div className="upload-btn">
              <button 
                className="update-movie-btn"
                onClick={handleUpdate}
              >Update
              </button>
            </div>
          </div>
        </form>
        <Notification
          snType="validation"
          snOpen={snackbarValidationOpen}
          snClose={handleSnackbarClose}
          snMessage={validationMessage}
        />
        <Notification
          snType="upload"
          snOpen={snackbarUploadOpen}
          snClose={handleSnackbarClose} 
        />
        <Notification
          snType="movie updated"
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
