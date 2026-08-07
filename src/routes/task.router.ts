import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, getTaskQuerySchema } from "../schemas/task.schema";

export const taskRouter = Router();

taskRouter.get('/', validate(getTaskQuerySchema, 'query'), taskController.getAllTasks.bind(taskController));
taskRouter.get('/:id', taskController.getTaskById.bind(taskController));
taskRouter.post('/', validate(createTaskSchema), taskController.createTask.bind(taskController));
taskRouter.patch('/:id', validate(createTaskSchema.partial()), taskController.updateTask.bind(taskController));
taskRouter.delete('/:id', taskController.deleteTask.bind(taskController));

export default taskRouter;