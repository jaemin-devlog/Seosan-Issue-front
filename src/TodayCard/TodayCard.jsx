import React from "react";
import "./TodayCard.css";
import CaretLeft from "../assets/CaretCircleLeft.png";
import CaretRight from "../assets/CaretCircleRight.png";
import "./TodayCard.css";

export default function TodayCard() {
  return (
              <div className="card today-card">
         <div className="today-title">오늘의 서산</div>
         <div className="today-slider">
           <button className="slider-arrow left">
             <img src={CaretLeft} alt="이전" />
           </button>
           <button className="slider-arrow right">
             <img src={CaretRight} alt="다음" />
           </button>
         </div>
         <div className="slider-bar-wrap">
           <div className="slider-bar">
             <div className="slider-bar-progress" style={{ width: "70%" }} />
           </div>
         </div>
       </div>
  )
}