type LinkProps ={
	name:string;
	onClick: CallableFunction;
}

export function HistoryLink(props: LinkProps) {
	return (
			<a  className='cursor-pointer no-underline text-lg font-bold' onClick={()=>props.onClick()}>{props.name}</a>
	)
}