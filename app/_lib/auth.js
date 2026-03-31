import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createGuest, getGuest } from './data-service';

const authConfig = {
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
	],
	callbacks: {
		// this performs a check if user is authenticated before allowing access to protected routes
		authorized({ auth, request }) {
			return !!auth?.user;
		},
		// runs after successful sign-in, we use it to create a guest in our database if it doesn't exist
		async signIn({ user, account, profile }) {
			try {
				const existingGuest = await getGuest(user.email);

				if (!existingGuest) {
					await createGuest({
						email: user.email,
						fullName: user.name,
					});
				}

				// allow access if exists
				return true;
			} catch (error) {
				console.error('Error during sign-in:', error);
				return false;
			}
		},
		// runs after success sign-in and once auth is called which may check the session
		// do not put the logic below within signIn as this is necessary
		async session({ session, user }) {
			const guest = await getGuest(session.user.email);

			if (guest) {
				session.user.guestId = guest.id;
			}

			return session;
		},
	},
	pages: {
		// default signIn page is /api/auth/signin, but we want to use our custom one at /login
		signIn: '/login',
	},
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth(authConfig);
