
import { z } from 'zod';
import { insertPredictionSchema, predictions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  predict: {
    submit: {
      method: 'POST' as const,
      path: '/api/predict',
      input: z.object({
        features: z.array(z.number()).length(60)
      }),
      responses: {
        200: z.object({
          result: z.string(),
          confidence: z.number().optional()
        }),
        500: errorSchemas.internal
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/predictions',
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect>())
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
