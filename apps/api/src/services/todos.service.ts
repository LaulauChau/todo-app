import type { Prisma, Todo } from "@repo/database";

import { PrismaService } from "./prisma.service";

export class TodosService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = PrismaService.getInstance();
  }

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
    userId?: string;
  }): Promise<Todo[]> {
    const { skip, take, cursor, where, orderBy, userId } = params;
    return this.prisma.todo.findMany({
      skip,
      take,
      cursor,
      where: { ...where, userId },
      orderBy,
    });
  }

  async findOne(data: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: data });
  }

  async update(params: {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.TodoUpdateInput;
  }): Promise<Todo> {
    const { where, data } = params;
    return this.prisma.todo.update({ data, where });
  }

  async delete(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
    return this.prisma.todo.delete({ where });
  }
}
