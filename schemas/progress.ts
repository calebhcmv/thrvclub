import { z } from 'zod';

export const lessonProgressSchema = z.object({
  lessonId: z.string().uuid('ID da aula inválido.'),
});
