import {MouseEventHandler, ReactNode, useState} from "react"

interface ButtonProps  {
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  children?: ReactNode,
};

const MainBtn: React.FC<ButtonProps> = (props) =>{
  return (
    <button  onClick={props.onClick} className={`btn main-btn  ${props.className}`}>
      {props.children}
    </button>
  )
};

export default MainBtn 