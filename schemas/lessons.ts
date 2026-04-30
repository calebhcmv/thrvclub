import { z } from 'zod';

export const videoProviderSchema = z.enum(['youtube', 'vk', 'none']);

export const createLessonSchema = z.object({
  moduleId: z.string().uuid('Módulo inválido.'),
  title: z.string().trim().min(1, 'Título obrigatório.'),
  description: z.string().trim().max(5000).optional(),
  videoProvider: videoProviderSchema,
  embedUrl: z.string().url('Embed URL inválida.').optional(),
  position: z.coerce.number().int().positive('Posição inválida.'),
});

export const updateLessonSchema = createLessonSchema.extend({
  lessonId: z.string().uuid('Aula inválida.'),
});
