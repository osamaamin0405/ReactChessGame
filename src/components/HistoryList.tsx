import {HistoryLink} from "./HistoryLink";

type ListProps = {
	list: string[][];
	onClickItem: CallableFunction;
}

export function HistoryList(props: ListProps) {
	return (
		<div className='grid grid-cols-2'>
			{
				props.list.map((historyElem, i)=>{
					return <HistoryLink key={Math.random() *( i+1)} name={historyElem[0]} onClick={()=>props.onClickItem(historyElem[1], historyElem)}></HistoryLink>
			})}
		</div>
	)
}