import "../AiSearch/Loading.css";
export default function Loading({ size = 115.2, color = "#3dc5b6" }) {
  const thickness = size * (5.8 / 115.2);
  return (
    <div
      className="progress"
      style={
        {
          "--size": `${size}px`,
          "--color": color,
          "--thickness": `${thickness}px`,
        }
      }
    />
  );
}
