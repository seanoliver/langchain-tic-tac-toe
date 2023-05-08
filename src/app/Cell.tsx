import { Gochi_Hand } from 'next/font/google';

const gochihand = Gochi_Hand({ weight: '400', subsets: ['latin'] });

export default function Cell({
	cell,
	rowNum,
	cellNum,
	handleClick,
}: {
	cell: string | null;
	rowNum: number;
	cellNum: number;
	handleClick: Function;
}) {

  // TODO: Make it so you can't click on a cell that's already been clicked.
	return (
		<div
			onClick={!cell ? () => handleClick(rowNum, cellNum): () => console.log('Cell already clicked')}
			className={`GameBoard-cell ${gochihand.className} bg-white h-20 w-20 flex justify-center items-center text-6xl text-gray-500`}>
			{cell}
		</div>
	);
}
