export default function TitleSVG({ title }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="100">
      <rect width="100%" height="100%" fill="transparent" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap');
      </style>
      <text
        x="0"
        y="50%"
        fontSize="85"
        fontFamily="Caveat Brush"
        fill="black"
        textAnchor="start"
        alignmentBaseline="middle"
      >
        {title}
      </text>
    </svg>
  );
}
