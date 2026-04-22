import { Injectable } from '@nestjs/common';
import { tasks as PrismaTask, tasks_status } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) { }

    private mapTask(task: PrismaTask) {
        return {
            id: task.id,
            title: task.title,
            description: task.description ?? '',
            status: (task.status ?? 'todo') as 'todo' | 'doing' | 'done',
            createdAt: task.created_at?.toISOString() ?? new Date().toISOString(),
        };
    }

    async findAll() {
        const tasks = await this.prisma.tasks.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return tasks.map((task) => this.mapTask(task));
    }

    async create(body: CreateTaskDto) {
        const task = await this.prisma.tasks.create({
            data: {
                id: randomUUID(),
                title: body.title,
                description: body.description ?? null,
                status: (body.status || 'todo') as tasks_status,
            },
        });

        return this.mapTask(task);
    }

    async update(id: string, body: UpdateTaskDto) {
        const task = await this.prisma.tasks.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                status: body.status as tasks_status | undefined,
            }
        });

        return this.mapTask(task);
    }

    async delete(id: string) {
        const task = await this.prisma.tasks.delete({
            where: { id },
        });

        return this.mapTask(task);
    }
}
