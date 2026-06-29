import { z } from 'zod';

/**
 * Standard Zod Schema for Client ID verification.
 */
export const clientIdSchema = z
  .string()
  .uuid({ message: 'Client ID must be a valid UUID' });

/**
 * Utility function to validate whether an ID is a valid Client UUID.
 */
export function isValidClientId(id: string | null | undefined): boolean {
  if (!id) return false;
  return clientIdSchema.safeParse(id).success;
}
