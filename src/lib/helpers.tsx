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
        if (combo.every((cell) => cell === 'X')) return 'X';
        if (combo.every((cell) => cell === 'O')) return 'O';
    }
    return false;
}

export function checkIfValidMove(board: (string | null)[][], row: number, col: number) {
    return board[row][col] === null;
}