import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Nombre de usuario es requerido",
  }),
  email: z
    .string({
      required_error: "Correo electrónico",
    })
    .email({
      message: "Formato de correo electrónico inválido",
    }),
  password: z
    .string({
      required_error: "Contraseña requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 carácteres",
    }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
