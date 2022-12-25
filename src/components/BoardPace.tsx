import { useState, useEffect } from "react";

export default function BoardPace(props: BoardProps) {
  return (
      <div 
        style={{
          width : props.width,
          height : props.height,
          backgroundImage: props.bg
        }}
        className="chess-board-pace"
      >
        
      </div>
  );
}
