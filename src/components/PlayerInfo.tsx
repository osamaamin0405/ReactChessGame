type PlayerProps = {
	name: string;
}

export function PlayerInfo(props: PlayerProps) {
	return (
		<div className='player-info'>
			<img className='user-image' src='./assets/users/ai.png' alt={props.name}></img>
			<div className='user-name'>{props.name}</div>
		</div>
	)
}