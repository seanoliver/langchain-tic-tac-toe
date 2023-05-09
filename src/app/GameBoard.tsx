'use client';

import { useEffect, useState } from 'react';
import Row from './Row';
import { checkForWinner, optimalMove } from '@/lib/helpers';
import { Board, Move } from '@/lib/types';

// The board is a 3x3 grid.
const initialBoardState: Board = [
	[null, null, null],
	[null, null, null],
	[null, null, null],
];

/**
 * Render a tic-tac-toe board.
 */
export default function GameBoard(): JSX.Element {
	const [boardState, setBoardState] = useState<Board>(initialBoardState);
	const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
	const [winner, setWinner] = useState<'X' | 'O' | 'Tie' | boolean>(false);

	/**
	 * Handle a click on a cell.
	 * @param row The row of the cell.
	 * @param col The column of the cell.
	 * @returns void
	 */
	const makeMove = (row: number, col: number) => {
		if (winner) return;
		const newBoardState = [...boardState];
		console.log('row, col, currentPlayer', row, col, currentPlayer);
		newBoardState[row][col] = currentPlayer;
		setBoardState(newBoardState);
		setCurrentPlayer(c => (c === 'X' ? 'O' : 'X'));
	};

	/**
	 * Get the AI's move.
	 * @param boardState The current board state.
	 * @returns void
	 */
	// async function getTicTacToeAIMove(boardState: Board) {
	// 	optimalMove(boardState);
	// 	if (winner) return;
	// 	const response = await fetch('/api/openai', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ boardState, currentPlayer }),
	// 	});
	// 	const data = await response.json();
	// 	console.log('data', data);
	// 	const { row, col } = data.result;
	// 	handleClick(row, col);
	// }

	// console.log('currentPlayer', currentPlayer);
	// if (currentPlayer === 'O') getTicTacToeAIMove(boardState);

	/**
	 * Get the computer's move.
	 */
	const getComputerMove = () => {
		if (winner) return;
		const { row, col } = optimalMove(boardState);
		makeMove(row, col);
	};

	if (currentPlayer === 'O') getComputerMove();

	/**
	 * Reset the board.
	 */
	const handleReset = () => {
		setBoardState(initialBoardState);
		setCurrentPlayer('X');
		setWinner(false);
	};

	useEffect(() => {
		// Check for winner.
		setWinner(checkForWinner(boardState));
		// TODO: Add conditions for tie based on state in render.
	}, [boardState]);

	return (
		<>
			<div className='GameBoard flex items-center flex-col justify-center rounded-lg bg-gray-200 h-80 w-80 animate-fade-in-up'>
				<div className='GameBoard-inner flex flex-col gap-2'>
					{boardState.map((rowArr, i) => (
						<Row
							key={`row-${i}`}
							rowArr={rowArr}
							rowNum={i}
							handleClick={makeMove}
						/>
					))}
				</div>
			</div>
			<div
				className={`GameBoard-winner justify-center items-center text-2xl text-indigo-400 font-bold ${
					currentPlayer === 'O' ? 'visible' : 'invisible'
				}`}>
				AI is thinking...
			</div>
			{/* TODO: Get rid of AI is thinking message once winner is declared. */}
			{/* TODO: adjust so it doesn't push the game board down */}
			{winner && (
				<div className='GameBoard-winner justify-center items-center text-2xl text-indigo-400 font-bold'>
					{winner} wins!
					<button
						onClick={handleReset}
						className='GameBoard-reset bg-indigo-400 text-white rounded-lg px-4 py-2'>
						Reset
					</button>
				</div>
			)}
		</>
	);
}
