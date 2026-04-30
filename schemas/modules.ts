import { z } from 'zod';

export const createModuleSchema = z.object({
  courseId: z.string().uuid('Curso inválido.'),
  title: z.string().trim().min(1, 'Título obrigatório.'),
  position: z.coerce.number().int().positive('Posição inválida.'),
});
