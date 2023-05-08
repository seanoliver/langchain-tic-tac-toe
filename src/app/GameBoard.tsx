'use client';

import { useEffect, useState } from 'react';
import Row from './Row';
import { checkForWinner } from '@/lib/helpers';
import { get } from 'http';

// The board is a 3x3 grid.
type BoardState = (null | string)[][];
const initialBoardState: BoardState = [
	[null, null, null],
	[null, null, null],
	[null, null, null],
];

/**
 * Render a tic-tac-toe board.
 */
export default function GameBoard(): JSX.Element {
	const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
	const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
	const [winner, setWinner] = useState<string | boolean>(false);

	/**
	 * Handle a click on a cell.
	 * @param row The row of the cell.
	 * @param col The column of the cell.
	 * @returns void
	 */
	const handleClick = (row: number, col: number) => {
		if (winner) return;
		const newBoardState = [...boardState];
		console.log('row, col, currentPlayer', row, col, currentPlayer);
		newBoardState[row][col] = currentPlayer;
		setBoardState(newBoardState);
		setCurrentPlayer(c => c === 'X' ? 'O' : 'X');
	};

	/**
	 * Get the AI's move.
	 * @param boardState The current board state.
	 * @returns void
	 */
	async function getTicTacToeAIMove(boardState: BoardState) {
		if (winner) return;
		const response = await fetch('/api/openai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ boardState, currentPlayer }),
		});
		const data = await response.json();
		console.log('data', data);
		const { row, col } = data.result;
		handleClick(row, col);
	}
	console.log('currentPlayer', currentPlayer);
	if (currentPlayer === 'O') getTicTacToeAIMove(boardState);

	/**
	 * Reset the board.
	 */
	const handleReset = () => {
		setBoardState(initialBoardState);
		setCurrentPlayer('X');
		setWinner(false);
	};

	// TODO: Still runs after winner is set.
	useEffect(() => {
		// Check for winner.
		const outcome = checkForWinner(boardState);
		if (outcome) setWinner(outcome);

	}, [boardState]);

	return (
		<div className='GameBoard flex items-center flex-col justify-center rounded-lg bg-gray-200 h-80 w-80 animate-fade-in-up'>
			{/* TODO: adjust so it doesn't push the game board down */}
			{winner && (
				<div className='GameBoard-winner justify-center items-center text-2xl text-indigo-400 font-bold'>
					{winner} wins!
				</div>
			)}
			<div className='GameBoard-inner flex flex-col gap-2'>
				{boardState.map((rowArr, i) => (
					<Row
						key={`row-${i}`}
						rowArr={rowArr}
						rowNum={i}
						handleClick={handleClick}
					/>
				))}
			</div>
		</div>
	);
}
