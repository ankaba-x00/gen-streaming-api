import './ListItem.scss';
import { PlayArrowRounded, Add, Close, ThumbDownOffAltOutlined, ThumbUp } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ListItem({ index, item}) {

  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get("/api/movies/find/" + item, 
          {
            headers: {
              token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2Q0Yjk0YjM0ZGM3OWE3YzFjMzJiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2MDg2NDYxNCwiZXhwIjoxNzYwOTUxMDE0fQ.AfFfaDgF4FDiNMxEpIt9gCX0edm2nWmV0zwcQZbh8fI"
             },
          });
        setMovie(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    getMovie()
  }, [item])

  return (
    <Link to="/watch" state={{ movie }}>
      <div 
        className="listItem"
        style={{ left: isHovered && index * 225 - 28 + index * 2.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={movie.imgSm} alt=""/>
        {isHovered && (
          <>
            <video src={movie.trailer} autoPlay={true} loop></video>
            <div className="itemInfo">
              <div className="icons">
                <PlayArrowRounded className="icon" />
                <Add className="icon" />
                <Close className="icon" />
                <ThumbDownOffAltOutlined className="icon" />
                <ThumbUp className="icon" />
              </div> 
              <div className="itemInfoHeader">
                <span className="limit">{movie.limit}</span>
                <span>{movie.duration}</span>
                <span>{movie.year}</span>
              </div>
              <div className="description">
                {movie.desc}
              </div>
              <div className="genre">{movie.genre}</div>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
