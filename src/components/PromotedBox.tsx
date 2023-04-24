import Alliance from '../services/board/Alliance'
import {ThemeSettings} from '../services/gameSetting'


interface PromotedBoxProps{
  theme: ThemeSettings,
  alliance:Alliance,
  onSelectPiece: CallableFunction
}

export default function PromotedBox(props: PromotedBoxProps){
  let names = props.alliance.name == "black" ? ["q", "n", "b", "r"] : ["Q", "N", "B", "R"];
  return (
    <div className='w-screen h-full absolute bg-slate-900 bg-opacity-20'>
      <div className='
        promoted-box p-2 absolute top-2/4 left-2/4 flex 
        -translate-x-2/4 -translate-y-2/4 rounded-md bg-slate-900 shadow-lg '>
        {
          names.map((name) =>{
            return (

              <div 
              key={name}
              className='
                w-20 h-20 bg-no-repeat cursor-pointer  bg-[length:80%] bg-center mx-2
              ' 
              style={
                {backgroundImage: `url('${props.theme.getPieceImage(name).toString()}')`}
              }
              onClick={(e)=>{props.onSelectPiece(name, e)}}
              ></div>
            )
          })
        }
      </div>
    </div>
  )
}
