import GameBoard from './GameBoard';
import Title from './Title';

export default function Home() {
	return (
		<div className='Home flex justify-center items-center h-full w-full'>
			<div className='Home-inner flex flex-col gap-6'>
				<Title />
				<GameBoard />
			</div>
		</div>
	);
}
