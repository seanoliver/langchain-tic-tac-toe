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
	const [winner, setWinner] = useState<string | null>(null);

	/**
	 * Handle a click on a cell.
	 * @param row The row of the cell.
	 * @param col The column of the cell.
	 * @returns void
	 */
	const handleClick = (row: number, col: number) => {
		const newBoardState = [...boardState];
		console.log('row, col, currentPlayer', row, col, currentPlayer);
		newBoardState[row][col] = currentPlayer;
		setBoardState(newBoardState);
		setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
	};

	/**
	 * Reset the board.
	 */
	const handleReset = () => {
		setBoardState(initialBoardState);
		setCurrentPlayer('X');
	};

	/**
	 * Get the AI's move.
	 * @param boardState The current board state.
	 * @returns void
	 */
	async function getTicTacToeAIMove(boardState: BoardState) {
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

	if (currentPlayer === 'O') getTicTacToeAIMove(boardState);

	useEffect(() => {
		// Check for winner.
		const winner = checkForWinner(boardState);
		if (winner) {
			console.log(`Winner: ${winner}`);
			return;
		}
	}, [boardState]);

	return (
		<div className='GameBoard flex items-center justify-center rounded-lg bg-gray-200 h-80 w-80 animate-fade-in-up'>
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
