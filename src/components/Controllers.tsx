import Btn from "./Btn";
import {GiNextButton, GiPreviousButton} from "react-icons/gi";

type ControllersProps ={
	nextEvent: CallableFunction;
	prevEvent: CallableFunction;
}
export function Controllers(props: ControllersProps) {
	return (
		<div className='controllers'>
			<ul className='flex list-none gap-2 justify-center items-center text-3xl text-slate-300 '>
				<li>
					<Btn onClick={()=>props.nextEvent()}><GiPreviousButton title="Previous Move" /></Btn>
				</li>
				<li>
					<Btn onClick={()=>props.prevEvent()}><GiNextButton title="Next Move"/></Btn>
				</li>
			</ul>
		</div>
	)
}