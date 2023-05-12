import {MouseEventHandler, ReactNode} from "react"

interface ButtonProps  {
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  children?: ReactNode
};

const Btn: React.FC<ButtonProps> = (props) =>{

  return (
    <button className={`btn  ${props.className}`} onClick={props.onClick}>
      {props.children}
    </button>
  )
};

export default  Btn