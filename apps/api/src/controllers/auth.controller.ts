import type { User } from "@repo/database";

import { AuthService } from "~/services/auth.service";
import { UsersService } from "~/services/users.service";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.authService.verifyUser(email, password);
    return this.authService.generateToken(user);
  }

  async me(token: string): Promise<Omit<User, "password">> {
    return this.authService.verifyToken(token);
  }

  async register(name: string, email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.create({ name, email, password });
    return this.authService.generateToken(user);
  }
}
