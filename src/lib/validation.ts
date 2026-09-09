import { z } from 'zod';

export const orderInputSchema = z.object({
  campaign: z.string().min(1).max(64),
  name: z.string().trim().min(1, 'נא למלא שם וטלפון').max(120),
  phone: z.string().trim().min(1, 'נא למלא שם וטלפון').max(40),
  address: z.string().trim().max(240).optional().default(''),
  qty: z.string().trim().max(8).default('1'),
  consent: z.literal(true, { message: 'נא לאשר יצירת קשר' }),
  /** Honeypot — real users never fill this. Accepted here and rejected in the
   *  route, so a bot gets a normal-looking 200 instead of a validation error. */
  company: z.string().max(200).optional().default(''),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const webhookSettingsSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https:\/\/.+/i.test(v), {
      message: 'הכתובת חייבת להתחיל ב-https://',
    }),
  enabled: z.boolean(),
  /** Optional shared secret sent as the X-Hadra-Token header. */
  token: z.string().trim().max(200),
});

export type WebhookSettings = z.infer<typeof webhookSettingsSchema>;
