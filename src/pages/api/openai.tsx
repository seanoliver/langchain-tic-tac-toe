import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkIfValidMove } from '@/lib/helpers';

export default async function getMove(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { boardState, currentPlayer } = req.body;

	const llm = new OpenAI(process.env.OPENAI_API_KEY);
	const memory = new BufferMemory();
	const chain = new ConversationChain({ llm, memory });
	const prompt = `
	Given the tic-tac-toe board state ${boardState}, please provide the optimal next move for player ${currentPlayer}. Player O (the second player) should follow these strategies:
	1. Take the center if available.
	2. Block the opponent if they have two marks in a line.
	3. Take a corner if the center is occupied by the opponent.
	4. Prevent forks by blocking potential double threats.
	5. Adjust your strategy based on the opponent's moves.
	6. Create opportunities for yourself by forming two-in-a-row.
	7. Play defensively to secure a draw or capitalize on the opponent's mistakes.

	Output the move as a two-item array in a format that aligns with the following instructions:

	Do not include any other characters in the output. Do not include spaces. Please use the exact format described below and use zero-based indexing. Please do not include any newlines in the output. Do not include brackets in the output.

	You can only place your mark in a cell that is null. You may not choose any cells where the value is already "X" or "O".

	The first item in the array should be the row number of the cell to place the player's mark. The second item in the array should be the column number of the cell to place the player's mark.

	For example, if the player's mark is "X" and the optimal move is to place the mark in the top-left cell, the output should be 0,0.

	If the optimal move is to place the mark in the bottom-right cell, the output should be 2,2.

	If the optimal move is to place the mark in the middle cell, the output should be 1,1.

	If the optimal move is to place the mark in the top-right cell, the output should be 0,2.

	And so on.
	`;

	const response = await chain.call({ input: prompt });
	// Parse the response into a row and column.

	let [row, col]: number[] = response.response
		.match(/\d,\d/)[0]
		.split(',')
		.map((n: string) => Number(n));
	console.log('boardState', boardState);

	// If the move is not valid, ask the user for a valid move.
	while (!checkIfValidMove(boardState, row, col)) {
		console.log('invalid: row, col', row, col);
		const newResponse = await chain.call({
			input: `The move ${row},${col} is not valid. Please provide a valid move.`,
		});
		console.log('newResponse', newResponse);
		const [newRow, newCol]: number[] = newResponse.response
			.match(/\d,\d/)[0]
			.split(',')
			.map((n: string) => Number(n));
		row = newRow;
		col = newCol;
	}

	const yourResult = { row, col };
	console.log('yourResult', yourResult);
	res.status(200).json({ result: yourResult });
}
