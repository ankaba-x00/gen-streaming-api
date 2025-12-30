import './FeaturedTitle.scss';

export default function TitleSVG({ title }) {
  return (
    <svg 
      className="title-svg"
      xmlns="http://www.w3.org/2000/svg" 
    >
      <rect 
        className="title-bg"
      />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap');
      </style>
      <text
        className="title-text"
        x="0"
        y="50%"
      >
        {title}
      </text>
    </svg>
  );
}
