import z from 'zod'
import { COMBINED_PASSWORD_REGEX } from '../../utils/const/regex'

export const LoginSchema = z.object({
  login: z.union([z.string(), z.string().email()]),
  password: z.string().trim()
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  fullname: z.string().min(1),
  password: z.string().min(12).trim().regex(COMBINED_PASSWORD_REGEX)
})
