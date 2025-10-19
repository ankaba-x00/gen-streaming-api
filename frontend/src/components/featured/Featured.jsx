import './Featured.scss';
import { PlayArrow, InfoOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FeaturedTitle from './FeaturedTitle';

export default function Featured({ type }) {
  const [content, setContent] = useState({})

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axios.get(`/api/movies/random?type=${type}`, 
          {
            headers: {
              token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2Q0Yjk0YjM0ZGM3OWE3YzFjMzJiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2MDg2NDYxNCwiZXhwIjoxNzYwOTUxMDE0fQ.AfFfaDgF4FDiNMxEpIt9gCX0edm2nWmV0zwcQZbh8fI"
             },
          })
        setContent(res.data[0])
      } catch (err) {
        console.log(err)
      }
    };
    getRandomContent();
  }, [type])

  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movie" ? "Movies" : "TV Shows"}</span>
          <select name="genre" id="genre">
            <option>Genres</option>
            <option value="adventure">Adventure</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-Fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <img width="100%" src={content.img} alt="" />
      <div className="info">
        <FeaturedTitle title={content.title}/>
        <span className="description">
          {content.desc}
        </span>
        <div className="buttons">
          <button className="play">
            <PlayArrow fontSize='large'/>
            <span>Play</span>
          </button>
          <button className="more">
            <InfoOutline fontSize='large'/>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  )
}
