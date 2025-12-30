import './Featured.scss';
import { PlayArrow, InfoOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FeaturedTitle from './FeaturedTitle';

export default function Featured({ type, setGenre }) {
  const [content, setContent] = useState({})

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axios.get(`/api/movies/random?type=${type}`, 
          {
            headers: {
              token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2Q0Yjk0YjM0ZGM3OWE3YzFjMzJiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2NzExNDU2NywiZXhwIjoxNzY3MjAwOTY3fQ.hz3YpMNZgTF-PWpVcxSYaPZK9_CsWJOIG8NeevdmZc4"
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
          <select name="genre" id="genre" onChange={e => setGenre(e.target.value)}>
            <option>Genres</option>
            <option value="Adventure">Adventure</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Historical">Historical</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Western">Western</option>
            <option value="Animation">Animation</option>
            <option value="Drama">Drama</option>
            <option value="Documentary">Documentary</option>
          </select>
        </div>
      )}
      <img width="100%" src={content.img} alt="" />
      <div className="info">
        <FeaturedTitle title={content.title}/>
        <span className="description">
          {content.imgText}
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
