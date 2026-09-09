/** Shared shape for the admin server-action results (plain module — the
 *  'use server' file may only export async functions). */
export type ActionState = {
  status: 'idle' | 'ok' | 'error';
  message: string;
};

export const emptyState: ActionState = { status: 'idle', message: '' };
