import { Board, Move } from './types';

const computerPlayer = 'O';
const humanPlayer = 'X';

export function checkForWinner(board: Board): 'X' | 'O' | 'Tie' | boolean {
	const winningCombos = [];

	if (isFull(board)) return 'Tie';

	// rows
	for (const row of board) {
		winningCombos.push(row);
	}

	// cols
	for (let i = 0; i < board.length; i++) {
		const col = [];
		for (const row of board) col.push(row[i]);
		winningCombos.push(col);
	}

	// diags
	const diag1 = [];
	const diag2 = [];
	for (let i = 0; i < board.length; i++) {
		diag1.push(board[i][i]);
		diag2.push(board[i][board.length - 1 - i]);
	}
	winningCombos.push(diag1);
	winningCombos.push(diag2);

	for (const combo of winningCombos) {
		if (combo.every(cell => cell === humanPlayer)) return humanPlayer;
		if (combo.every(cell => cell === computerPlayer)) return computerPlayer;
	}
	return false;
}

function isFull(board: Board): boolean {
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (board[row][col] === null) {
				return false;
			}
		}
	}
	return true;
}

export function checkIfValidMove(
	board: Board,
	row: number,
	col: number
): boolean {
	return board[row][col] === null;
}

export function optimalMove(board: Board): Move {
	let bestScore = -Infinity;
	let bestMove: Move = { row: -1, col: -1 };

	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (board[row][col] === null) {
				board[row][col] = computerPlayer;
				const moveScore = minimax(board, 0, false);
				board[row][col] = null;
				if (moveScore > bestScore) {
					bestScore = moveScore;
					bestMove = { row, col };
				}
			}
		}
	}
	return bestMove;
}

/**
 * This function recursively calls itself to find the best possible score for the current player.
 *
 */
function minimax(board: Board, depth: number, isMaximizing: boolean): number {
	const winner = checkForWinner(board);
	if (winner !== null) {
		return winner === computerPlayer ? 10 - depth : depth - 10;
	}

	if (isFull(board)) return 0;

	// MAXIMIZING PLAYER
	if (isMaximizing) {
		let maxEval = -Infinity;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (board[row][col] === null) {
					board[row][col] = computerPlayer;
					const score = minimax(board, depth + 1, false);
					board[row][col] = null;
					maxEval = Math.max(maxEval, score);
				}
			}
		}
		return maxEval;

		// MINIMIZING PLAYER
	} else {
		let minEval = Infinity;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (board[row][col] === null) {
					board[row][col] = humanPlayer;
					const score = minimax(board, depth + 1, true);
					board[row][col] = null;
					minEval = Math.min(minEval, score);
				}
			}
		}
		return minEval;
	}
}
