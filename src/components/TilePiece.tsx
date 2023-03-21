import { useDrop } from "react-dnd/dist/hooks";

export default function TilePiece(props: BoardPiece) {
  let pieceProps = props.pieceProps
  let position = pieceProps.index;
  let value = props.children;
  const [{ }, dropRef] = useDrop(() => ({
    accept: "piece",
    drop(item: { currPosition: number }, monitor) {
      props.movFunction(item.currPosition, position, monitor);
    },
    collect: (monitor) =>({isOver: monitor.isOver()}),
  }))

//  useEffect(()=>{
//         if(moveResult.isPromoterTile){
//           setValue((<div className="grid">
//           <div onClick={()=>{props.onPromote("q", moveResult.move)}} className="q">q</div>
//           <div onClick={()=>{props.onPromote("n", moveResult.move)}} className="n">n</div>
//           <div onClick={()=>{props.onPromote("b", moveResult.move)}} className="b">b</div>
//           <div onClick={()=>{props.onPromote("r", moveResult.move)}} className="r">r</div>
//         </div>))
//         }
//   }, [moveResult])

  return (
    <div
      ref={dropRef}
      style={{
        width: pieceProps.width,
        height: pieceProps.height,
        backgroundColor: pieceProps.color,
      }}
      className="chess-board-pace"
    >{value}</div>
  );
}
