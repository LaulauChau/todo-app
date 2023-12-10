import type { Prisma, User } from "@repo/database";

import { PrismaService } from "./prisma.service";
import { UtilsService } from "./utils.service";

export class UsersService {
  private prisma: PrismaService;

  constructor(private readonly utilsService: UtilsService) {
    this.prisma = PrismaService.getInstance();
  }

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, "password">> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: this.utilsService.hashPassword(data.password),
      },
    });

    return this.utilsService.excludeFields(newUser, ["password"]);
  }

  async findOne(data: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where: data });
  }
}
