import type { User } from "@repo/database";
import { sign, verify } from "jsonwebtoken";
import passport from "passport";
import { Strategy } from "passport-local";

import { UsersService } from "./users.service";
import { UtilsService } from "./utils.service";

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (email: string, password: string, done: any) => {
      try {
        const utilsService = new UtilsService();
        const usersService = new UsersService(utilsService);

        const user = await usersService.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isPasswordValid = utilsService.comparePassword(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export class AuthService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly usersService: UsersService,
  ) {}

  async generateToken(user: Omit<User, "password">): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: sign(payload, String(process.env.JWT_SECRET), { expiresIn: "1d" }),
    };
  }

  async verifyToken(token: string): Promise<Omit<User, "password">> {
    const decoded = verify(token, String(process.env.JWT_SECRET)) as { email: string; sub: string };

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const user = await this.usersService.findOne({ id: decoded.sub });

    if (!user) {
      throw new Error("User not found");
    }

    return this.utilsService.excludeFields(user, ["password"]);
  }

  async verifyUser(email: string, password: string): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = this.utilsService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Wrong password");
    }

    return this.utilsService.excludeFields(user, ["password"]);
  }
}
