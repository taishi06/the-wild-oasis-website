// export function middleware(request) {}

import { auth } from '@/app/_lib/auth';

export const middleware = auth;

export const config = {
	// protected routes that require authentication, users will be redirected to /login if they are not authenticated
	matcher: ['/account'],
};
