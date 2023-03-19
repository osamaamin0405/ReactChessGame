import { useState, useEffect } from "react";
import { useDrop } from "react-dnd/dist/hooks";

export default function TilePiece(props: BoardPiece) {
  let pieceProps = props.pieceProps
  let  position = pieceProps.index;
  let value = props.children;
  const [{isOver}, dropRef] = useDrop(()=>({
    accept: "piece",
    drop(item: {currPosition: number}, monitor){
      props.movFunction(item.currPosition, position, monitor)
    },
    collect: (monitor) =>({isOver: monitor.isOver()}),
  }))
  return (
      <div 
        ref={dropRef}
        style={{
          width : pieceProps.width,
          height : pieceProps.height,
          backgroundColor: pieceProps.color,
        }}
        className="chess-board-pace"
      >
        {value}
      </div>
  );
}
