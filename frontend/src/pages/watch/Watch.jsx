import './Watch.scss';
import { ArrowBack } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

export default function Watch() {
  const location = useLocation();
  console.log(location); 
  const movie = location.state?.movie;
  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBack fontSize="large" className="arrow"/>
        </div>
      </Link>
      <video 
        className="video" 
        src={movie.trailer} 
        autoPlay
        muted
        controls
        playsInline></video>
    </div>
  )
}