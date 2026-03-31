import { Josefin_Sans } from 'next/font/google';
import Header from './_components/Header';
import '@/app/_styles/globals.css';
import { ReservationProvider } from '@/app/_components/ReservationContext';

// configure google font
const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

// page conventions
export const metadata = {
	// <head><title> tag
	title: {
		// %s is a placeholder that is replaceable when set title is set on other pages
		template: '%s - The Wild Oasis',
		// if no title is provided on page, this returns
		default: 'Welcome - The Wild Oasis',
	},
	description:
		'Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
			>
				<Header />

				<div className="flex-1 px-8 py-12 grid">
					<main className="max-w-7xl mx-auto w-full">
						<ReservationProvider>{children}</ReservationProvider>
					</main>
				</div>
			</body>
		</html>
	);
}
