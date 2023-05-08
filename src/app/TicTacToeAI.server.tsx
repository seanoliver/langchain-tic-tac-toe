import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

const llm = new OpenAI(process.env.OPENAI_API_KEY);

const template =
	'Given the tic-tac-toe board state {boardState}, what is the optimal next move for player {player}? Output the move as a two-item array in the format [row, col].';
const prompt = new PromptTemplate({
	template: template,
	inputVariables: ['boardState', 'player'],
});

console.log('template', template);
console.log('prompt', template);

const chain = new LLMChain({ llm, prompt });

export async function getComputerMove(
	boardState: (null | string)[][],
	player: string
): Promise<{ row: number; col: number }> {
	const response = await chain.call({
		boardState: JSON.stringify(boardState),
		player,
	});
	const [row, col] = response.split(',').map(Number);
	return { row, col };
}
