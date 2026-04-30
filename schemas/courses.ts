import { z } from 'zod';

export const courseStatusSchema = z.enum(['draft', 'published', 'archived']);

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório.'),
  description: z.string().trim().max(5000).optional(),
  thumbnailUrl: z.url('Thumbnail deve ser uma URL válida.').optional(),
  status: courseStatusSchema.default('draft'),
});

export const updateCourseSchema = createCourseSchema.extend({
  courseId: z.uuid('ID do curso inválido.'),
});
