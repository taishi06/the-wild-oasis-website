/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'derxwdipjgxrhcplskjn.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/cabin-images/**',
			},
		],
	},
	// will generate as static pages/assets
	// do this if there are no dynamic pages
	// output: 'export',
};

export default nextConfig;
