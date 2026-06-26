import { createClient } from "@supabase/supabase-js";

/**
 * Creates a server-side Supabase client with administrative privileges.
 * This is used for uploading images directly to Supabase Storage.
 * It is marked server-only by virtue of using the Service Role key.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Fall back to publishable key if service role key is not defined, 
  // but prioritize service role key for administrative storage bypass.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  if (!supabaseKey) {
    throw new Error("Missing Supabase API key (service role or publishable) in environment.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
