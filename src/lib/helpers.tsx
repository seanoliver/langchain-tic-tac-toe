export function checkForWinner(board: (string | null)[][]): string | boolean {
	const winningCombos = [];

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
		if (combo.every(cell => cell === 'X')) return 'X';
		if (combo.every(cell => cell === 'O')) return 'O';
	}
	return false;
}

export function checkIfValidMove(
	board: (string | null)[][],
	row: number,
	col: number
) {
	return board[row][col] === null;
}

type Board = string[][];
type Move = { row: number; col: number };

function optimalMove(board: Board): Move {
	let bestScore = -Infinity;
	let bestMove: Move = { row: -1, col: -1 };

	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (board[row][col] === '') {
				board[row][col] = 'X';
				const moveScore = minimax(board, 0, false);
				board[row][col] = '';
				if (moveScore > bestScore) {
					bestScore = moveScore;
					bestMove = { row, col };
				}
			}
		}
	}
	return bestMove;
}


function minimax(board: Board, depth: number, isMaximizing: boolean): number {
	const winner = checkWinner(board);
	if (winner !== null) {
		return winner === 'X' ? 10 - depth : depth - 10;
	}

	if (isFull(board)) return 0;

	if (isMaximizing) {
		let maxEval = -Infinity;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (board[row][col] === '') {
					board[row][col] = 'X';
					const score = minimax(board, depth + 1, false);
					board[row][col] = '';
					maxEval = Math.max(maxEval, score);
				}
			}
		}
		return maxEval;
	} else {
		let minEval = Infinity;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (board[row][col] === '') {
					board[row][col] = 'O';
					const score = minimax(board, depth + 1, true);
					board[row][col] = '';
					minEval = Math.min(minEval, score);
				}
			}
		}
		return minEval;
	}
}

function isFull(board: Board): boolean {
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (board[row][col] === '') {
				return false;
			}
		}
	}
	return true;
}

function checkWinner(board: Board): 'X' | 'O' | null {
	const lines = [
		[board[0][0], board[0][1], board[0][2]],
		[board[1][0], board[1][1], board[1][2]],
		[board[2][0], board[2][1], board[2][2]],
		[board[0][0], board[1][0], board[2][0]],
		[board[0][1], board[1][1], board[2][1]],
		[board[0][2], board[1][2], board[2][2]],
		[board[0][0], board[1][1], board[2][2]],
		[board[0][2], board[1][1], board[2][0]],
	];

	for (const line of lines) {
		if (line[0] === line[1] && line[1] === line[2]) {
			if (line[0] === 'X') {
				return 'X';
			} else if (line[0] === 'O') {
				return 'O';
			}
		}
	}
	return null;
}

// Example usage:
const board: Board = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
];

const move: Move = optimalMove(board);
console.log(`Optimal move is at row ${move.row}, column ${move.col}`);
