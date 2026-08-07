import { Router } from "express";
import { taskController } from "../controllers/task.controller";

export const taskRouter = Router();

taskRouter.get('/', taskController.getAllTasks.bind(taskController));
taskRouter.get('/:id', taskController.getTaskById.bind(taskController));
taskRouter.post('/', taskController.createTask.bind(taskController));
taskRouter.patch('/:id', taskController.updateTask.bind(taskController));
taskRouter.delete('/:id', taskController.deleteTask.bind(taskController));

export default taskRouter;