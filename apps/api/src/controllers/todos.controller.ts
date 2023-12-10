import type { Prisma } from "@repo/database";

import { TodosService } from "~/services/todos.service";

export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  async create(data: Prisma.TodoCreateInput) {
    return this.todosService.create(data);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
    userId?: string;
  }) {
    return this.todosService.findAll(params);
  }

  async findOne(data: Prisma.TodoWhereUniqueInput) {
    return this.todosService.findOne(data);
  }

  async update(params: { where: Prisma.TodoWhereUniqueInput; data: Prisma.TodoUpdateInput }) {
    return this.todosService.update(params);
  }

  async delete(where: Prisma.TodoWhereUniqueInput) {
    return this.todosService.delete(where);
  }
}
