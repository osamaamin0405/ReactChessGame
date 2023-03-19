
import { useEffect } from "react";
import { useDrag } from "react-dnd"


export default function ChessPiece(props: PieceProps) {
  const [{ isDragging },dragRef] = useDrag(()=>({
    type: "piece",
    item: {
      currPosition: props.position,
      props: props
    },
    collect: (monitor)=> {
      return{
        isDragging: !!monitor.isDragging()
      }
    }
  }));

  useEffect(()=>{
    if(isDragging && props.onDragStart){
      props.onDragStart(props);
    }else if(!isDragging && props.onDragEnd){
      props.onDragEnd(props);
    }
  }, [isDragging])


  return isDragging ?
  (
    <div
      style={{
            backgroundImage: `url("${props.image}")`,
            width: "100%",
            height:" 100%",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            cursor: "pointer",
        }}
    ></div>
  ) 
  :(
    <>
      {
        props.image && <div
        ref={dragRef}
        style={{
            backgroundImage: `url("${props.image}")`,
            width: "100%",
            height:" 100%",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            cursor: "pointer",
        }}
        >
        </div>
      }
    </>
  )
}
