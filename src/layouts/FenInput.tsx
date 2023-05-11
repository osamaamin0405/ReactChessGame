import {useRef, useEffect, KeyboardEvent} from 'react'
import Btn from './Btn';

type FenProps = {
  onApply: CallableFunction;
  onInput?: CallableFunction;
  defaultValue?: string;
}

export default function FenInput(props: FenProps) {
  const inputVal = useRef(null)
  useEffect(() => {
    inputVal.current.value = props.defaultValue ?? ""
  });

    const applyOnEnter = (e:KeyboardEvent<HTMLInputElement>)=>{
       if(e.key == "Enter"){
           props.onApply(inputVal.current.value);
       }
    }
  
  return (
    <div className='fen-input flex  items-center gap-2'>
      <input onKeyPress={applyOnEnter} ref={inputVal}  className='input my-5 grow' placeholder='FEN file formate'/>
      <Btn 
        onClick={()=>props.onApply(inputVal.current.value)} 
        className='secondary-btn bg-sky-800 px-4 w-[200px]'
      >
        Apply
      </Btn>
    </div>
  )
}
