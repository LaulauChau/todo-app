import { compareSync, hashSync } from "bcryptjs";

export class UtilsService {
  private readonly saltRounds = Number(process.env.SALT_ROUNDS);

  comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  excludeFields<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    fields: K[],
  ): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(obj).filter(([field]) => !fields.includes(field as K)),
    ) as Omit<T, K>;
  }

  hashPassword(password: string): string {
    return hashSync(password, this.saltRounds);
  }
}
