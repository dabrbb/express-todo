import { Task, TaskInput } from "../types/task.type";
import path from 'node:path';
import fs from 'node:fs/promises';

class TaskService {
    private tasks: Task[] = [];
    private filePath = path.resolve('task.json'); // File used for temporary data persistence

    constructor() {
        this.init();
    }

    public async init(): Promise<void> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.tasks = JSON.parse(data) as Task[];
        } catch (error) {
            this.tasks = [];
        }
    }

    public async saveToFile(): Promise<void> {
        try {
            const data = JSON.stringify(this.tasks, null, 2);
            await fs.writeFile(this.filePath, data, 'utf-8');
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    }

    public getAllTasks(page: number = 1, limit: number = 10, status?: string): Task[] {
        let filteredTasks = this.tasks;

        if (status) {
            filteredTasks = filteredTasks.filter(task => task.status === status);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return filteredTasks.slice(startIndex, endIndex);
    }

    public getTaskById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    public async createTask(data: TaskInput): Promise<Task> {
        const newTask: Task = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        await this.saveToFile();
        return newTask;
    }

    public async updateTask(id: number, data: Partial<TaskInput>): Promise<Task | undefined> {
        const task = this.getTaskById(id);

        if (!task) {
            return undefined;
        }

        Object.assign(task, data);

        await this.saveToFile();
        return task;
    }

    public async deleteTask(id: number): Promise<boolean> {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        const isDeleted = this.tasks.length < initialLength;

        if (isDeleted) {
            await this.saveToFile();
        }

        return isDeleted;
    }
}

export const taskService = new TaskService();