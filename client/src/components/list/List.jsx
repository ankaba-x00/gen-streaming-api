import './List.scss';
import ListItem from '../listitem/ListItem';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRef, useState } from 'react';

export default function List({ list }) {

  const [isMoved, setIsMoved] = useState(false); 
  const [slideNum, setSlideNum] = useState(0); 
  const listRef = useRef();

  const handleClick = (direction) => {
    setIsMoved(true)
    let distance = listRef.current.getBoundingClientRect().x - 50
    if (direction === "left" && slideNum > 0) {
      setSlideNum(slideNum - 1)
      listRef.current.style.transform = `translateX(${distance + 230}px)`;
    } 
    if (direction === "right" && slideNum < 5) {
      setSlideNum(slideNum + 1)
      listRef.current.style.transform = `translateX(${distance - 230}px)`;
    }
  }

  return (
    <div className="list">
      <span className="listTitle">{list.title}</span>
      <div className="wrapper">
        <ArrowBackIos 
          className="sliderArrow left" 
          onClick={() => handleClick("left")} 
          style={{display: !isMoved && "none"}} />
        <div className="container" ref={listRef}>
          {list.content.map((item, i) => (
            <ListItem key={i} index={i} item={item} />
          ))}
        </div>
        <ArrowForwardIos className="sliderArrow right" onClick={() => handleClick("right")} />
      </div>
    </div>
  )
}
