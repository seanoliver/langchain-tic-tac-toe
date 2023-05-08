import Cell from './Cell';

export default function Row({
	rowArr,
	rowNum,
	handleClick,
}: {
	rowArr: (string | null)[];
	rowNum: number;
	handleClick: (row: number, col: number) => void;
}) {
	return (
		<div className='GameBoard-row flex justify-center items-center gap-2'>
			{rowArr.map((cell, i) => (
				<Cell
					key={`cell-${i}`}
					cell={cell}
					rowNum={rowNum}
					cellNum={i}
					handleClick={handleClick}
				/>
			))}
		</div>
	);
}
