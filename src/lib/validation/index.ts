import { z } from "zod"

const message = (num: number) => `Provide atleast ${num} characters.`

export const signupValidation = z.object({
  name: z.string().min(2, { message: message(2) }),
  username: z.string().min(2, { message: message(2) }),
  email: z.string().email(),
  password: z.string().min(8, { message: message(8) }),
})

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: message(8) }),
})
