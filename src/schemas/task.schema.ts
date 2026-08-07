import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../types/task.type';

export const createTaskSchema = z.object({
    title: z.string().min(3, 'Como minimo tres caracteres'),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
});

export const getTaskQuerySchema = z.object({
    page: z.coerce.number().min(1, 'Pagina debe que ser mas o igual a 1').default(1),
    limit: z.coerce.number().min(1).max(50, 'Como maximo 50 elementos').default(10),
    status: z.nativeEnum(TaskStatus).optional(),
});