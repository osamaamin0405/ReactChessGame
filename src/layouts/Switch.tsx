import {useState, useEffect} from "react";
type SwitchProps = {
  values: any[],
  OnSwitch?: CallableFunction,
  onRender?: CallableFunction,
  defaultValue?: any,
  className?: string
}

const Switch: React.FC<SwitchProps> = ({values, OnSwitch, defaultValue, className, onRender})=>{

  let [selectedValue, setSelectValue] = useState(defaultValue ?? values[0]);
  

  const handelClick =  (elem: any, index: number)=>{
    if(elem == selectedValue) return;
    if(values.indexOf(elem) == -1) return;
    setSelectValue(()=>{
      return values[index]
    })
    if(OnSwitch){
      OnSwitch(elem, index, values);
    }
  }

  useEffect(()=>{
      if(onRender)
        onRender(defaultValue, values.indexOf(defaultValue), values);
  }, []);

  return (
    <div className={`flex bg-slate-900 p-1 text-slate-300 rounded my-2 ${className || ""}`}>
      {
        values.map((elem: any, index:number)=>{
            return (
              <div
                onClick = {()=>{handelClick(elem, index)}}
                key={Math.random() * 1000}
                className={`flex justify-center items-center w-[50%] rounded text-lg font-bold cursor-pointer  ${selectedValue == elem ? 'bg-slate-200 text-slate-900' : ''} `} >
                {elem}
              </div>
            )
        })
      }
    </div>
  );

}

export default Switch;