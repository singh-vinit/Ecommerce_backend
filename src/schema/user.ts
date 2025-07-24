import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "password must be at least 6 character"),
  firstName: z.string().min(3, "first name is required"),
  lastName: z.string().min(3, "last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>