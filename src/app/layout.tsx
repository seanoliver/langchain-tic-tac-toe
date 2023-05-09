import './globals.css';
import { Inter, Raleway } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });

export const metadata = {
	title: 'Tic Tac Toe',
	description: 'Simple fun with LangChain, TypeScript, and Next.js',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className='h-full'>
			<body className={`h-full ${raleway.className}`}>{children}</body>
		</html>
	);
}
