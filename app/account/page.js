import { auth } from '../_lib/auth';

// page conventions
export const metadata = {
	// <head><title> tag
	title: 'Account',
};

export default async function Page() {
	const session = await auth();
	const firstName = session?.user?.name?.split(' ')[0] || 'Guest';

	return (
		<h2 className="font-semibold text-2xl text-accent-400 mb-7">
			Welcome, {firstName}
		</h2>
	);
}
