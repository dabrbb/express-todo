import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from "zod";
import { RequestSegment } from '../types/task.type';

export const validate = (schema: ZodSchema, target: RequestSegment = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.safeParse(req[target]);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.error.format(),
            });
        }

        if (target === 'query') {
            Object.keys(req.query).forEach(key => delete (req.query as Record<string, unknown>)[key]);
            Object.assign(req.query, validation.data);
        } else {
            req[target] = validation.data;
        }

        next();
    };
};