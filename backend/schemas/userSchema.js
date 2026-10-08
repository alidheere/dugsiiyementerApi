import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(5, "name is required"),

  email: z.string().email("email must be a valid email"),

  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters")
});