import { z } from "zod";

export const registerValidation = z.object({
    name: z.string().min(3).max(100),

    email: z.string().email(),

    password: z.string().min(8)
}).strict();

export const loginValidation = z.object({
    email: z.string().email(),

    password: z.string().min(8)
}).strict();