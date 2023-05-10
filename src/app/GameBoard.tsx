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

/** Render a tic-tac-toe board. */
export default function GameBoard(): JSX.Element {
	const [boardState, setBoardState] = useState<Board>(initialBoardState);
	const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
	const [winner, setWinner] = useState<'X' | 'O' | 'Tie' | boolean>(false);

	/** Handle a click on a cell. */
	const makeMove = (row: number, col: number) => {
		if (winner) return;
		const newBoardState = [...boardState];
		console.log('row, col, currentPlayer', row, col, currentPlayer);
		newBoardState[row][col] = currentPlayer;
		setBoardState(newBoardState);
		setCurrentPlayer(c => (c === 'X' ? 'O' : 'X'));
		setWinner(checkForWinner(newBoardState));
	};

	/** Get the computer's move. */
	const getComputerMove = () => {
		if (winner) return;
		const { row, col } = optimalMove(boardState);
		makeMove(row, col);
	};

	if (currentPlayer === 'O') getComputerMove();

	/** Reset the board. */
	const handleReset = () => {
		const resetBoardState = initialBoardState.map(row => row.map(() => null));
		setBoardState(resetBoardState);
		setCurrentPlayer('X');
		setWinner(false);
	};

	useEffect(() => {
		// Check for winner.
		const winnerValue = checkForWinner(boardState);
		setWinner(winnerValue);
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
			{/* TODO: adjust so it doesn't push the game board down */}
			{ winner === 'Tie' && (
				<div className='GameBoard-winner justify-center items-center text-2xl text-indigo-400 font-bold'>
					Tie!
					<button
						onClick={() => handleReset()}
						className='GameBoard-reset bg-indigo-400 text-white rounded-lg px-4 py-2'>
						Reset
					</button>
				</div>
			)}
			{winner && winner !== 'Tie' && (
				<div className='GameBoard-winner justify-center items-center text-2xl text-indigo-400 font-bold'>
					{winner} wins!
					<button
						onClick={() => handleReset()}
						className='GameBoard-reset bg-indigo-400 text-white rounded-lg px-4 py-2'>
						Reset
					</button>
				</div>
			)}
		</>
	);
}
