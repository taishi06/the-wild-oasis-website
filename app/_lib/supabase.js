import { createClient } from '@supabase/supabase-js';

// make sure that JWT-based API keys are enabled for the Service Role API key to work
export const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_API_KEY,
);
