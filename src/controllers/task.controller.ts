import { createTaskSchema, getTaskQuerySchema } from "../schemas/task.schema";
import { Request, Response } from "express";
import { taskService } from "../services/task.service";

export class TaskController {
    public getAllTasks(req: Request, res: Response) {
        const result = getTaskQuerySchema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                error: 'Error de validación de los parametros de petición',
                details: result.error.format()
            });
        }

        const { page, limit, status } = result.data;
        const tasks = taskService.getAllTasks(page, limit, status);
        res.json(tasks);
    }

    public getTaskById(req: Request, res: Response) {
        const taskId = Number(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'El ID no es válido' });
        }

        const task = taskService.getTaskById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'La tarea con este ID no encontrada' });
        }

        res.json(task);
    }

    public async createTask(req: Request, res: Response) {
        const validation = createTaskSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.error.format()
            });
        }

        const newTask = await taskService.createTask(validation.data);
        res.status(201).json(newTask);
    }

    public async updateTask(req: Request, res: Response) {
        const taskId = Number(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'El ID no es válido' });
        }

        const validation = createTaskSchema.partial().safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Error de validación',
                details: validation.error.format()
            });
        }

        const updatedTask = await taskService.updateTask(taskId, validation.data);
        if (!updatedTask) {
            return res.status(404).json({ error: 'La tarea no existe' })
        }

        return res.json(updatedTask);
    }

    public async deleteTask(req: Request, res: Response) {
        const taskId = Number(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'El ID no es válido' });
        }

        const isDeleted = await taskService.deleteTask(taskId);
        if (!isDeleted) {
            return res.status(404).json({ error: 'La tarea no existe' });
        }

        return res.status(204).send();
    }
}