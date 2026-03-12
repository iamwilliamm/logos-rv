import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof registerSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
})

export const searchSchema = z.object({
  query: z.string().min(1, "La requête ne peut pas être vide"),
  mode: z.enum(["SEARCH", "QA"]),
  sources: z.array(z.string()).optional(),
})

export const sheetSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  theme: z.string().optional(),
  notes: z.string().optional(),
})
