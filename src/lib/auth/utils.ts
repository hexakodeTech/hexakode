import { getCurrentUser } from './actions';

/**
 * Validates that there is a currently authenticated Supabase user and that
 * their corresponding profile in the local database status is ACTIVE.
 * Throws an Error if authorization fails.
 */
export async function verifyAdminAuth() {
  const result = await getCurrentUser();
  if (!result || result.localUser.status !== 'ACTIVE') {
    throw new Error('Unauthorized: Admin access is required.');
  }
  return result;
}
