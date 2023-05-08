import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkIfValidMove } from '@/lib/helpers';

export default async function getMove(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const llm = new OpenAI(process.env.OPENAI_API_KEY);

	const template =
		'Given the tic-tac-toe board state {boardState}, please provide the optimal next move ' +
		'for player {player}. Output the move as a two-item array in a format that aligns ' +
		'with the following instructions:' +
		'\n\n' +
		'Do not include any other characters in the output. Do not include spaces. ' +
		'Please use the exact format described below and use zero-based indexing.' +
		'Please do not include any newlines in the output. Do not include brackets in the output.' +
		'\n\n' +
		'You can only place your mark in a cell that is null. You may not choose any cells ' +
		'where the value is already "X" or "O".' +
		'\n\n' +
		'The first item in the array should be the row number of the cell to place the ' +
		"player's mark. The second item in the array should be the column number of the " +
		"cell to place the player's mark. " +
		'\n\n' +
		'For example, if the player\'s mark is "X" and the optimal move is to place the ' +
		'mark in the top-left cell, the output should be 0,0. ' +
		'\n\n' +
		'If the optimal move is to place the mark in the bottom-right cell, the output ' +
		'should be 2,2. ' +
		'\n\n' +
		'If the optimal move is to place the mark in the middle cell, the output should ' +
		'be 1,1. ' +
		'\n\n' +
		'If the optimal move is to place the mark in the top-right cell, the output should ' +
		'be 0,2. ' +
		'\n\n' +
		'And so on. ';
	const prompt = new PromptTemplate({
		template: template,
		inputVariables: ['boardState', 'player'],
	});
	const { boardState, player } = req.body;

	console.log('boardState for AI', boardState);

	const chain = new LLMChain({ llm, prompt });

	const response = await chain.call({
		boardState: JSON.stringify(boardState),
		player,
	});
	// Parse the response into a row and column.
	console.log('response', response);
	const [row, col]: number[] = response
		.text
		.trim()
		.split(',')
		.map((n: string) => Number(n));
	console.log('boardState', boardState);

	while (checkIfValidMove(boardState, row, col) === false) {
		console.log('invalid move');
		const response = await chain.call({
			boardState: JSON.stringify(boardState),
			player,
		});
		// Parse the response into a row and column.
		console.log('response', response);
		const [row, col]: number[] = response
			.text
			.trim()
			.split(',')
			.map((n: string) => Number(n));
		console.log('boardState', boardState);
	}

	const yourResult = { row, col };
	console.log('yourResult', yourResult);
	res.status(200).json({ result: yourResult });
}
