import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().optional(),
})

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
