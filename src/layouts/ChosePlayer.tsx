import Btn from "../components/Btn";
import Switch from "../components/Switch";
import { useState} from "react";

type props =  {
  onChose?: CallableFunction;
}

export default function ChosePlayer(props: props) {

  const [player, setPlayer] = useState('');

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <div className="box w-2/4 p-4">
        <div className="uppercase text-slate-400 font-bold text-center">
          Chose Player One
        </div>
        <Switch values={['Black', 'White']}
          defaultValue={'White'} 
          OnSwitch={(elem:string)=>{setPlayer(elem)}} 
          onRender={(elem: string)=>{setPlayer(elem)}}
        ></Switch>
        <div className="capitalize text-slate-500 font-bold text-center text-sm"> 
          Remember: White Player is Always Play's First 
        </div>
      </div>
      <Btn onClick={()=>{props.onChose(player, "AI")}} className="chosePlayerBtn bg-orange-500">
        New Game With (AI)
      </Btn>
      <Btn onClick={()=>{props.onChose(player, "HUMAN")}} className="chosePlayerBtn bg-orange-800">
        New Game With (Player)
      </Btn>
    </div>
  )
}
