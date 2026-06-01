import { z } from "zod";

// ─── Rainbow Colors ───────────────────────────────────────────────────────────
// Enum extensível: basta adicionar novas cores aqui e reflete no front e back

export const RainbowColor = {
  RED: "RED",
  ORANGE: "ORANGE",
  YELLOW: "YELLOW",
  GREEN: "GREEN",
  BLUE: "BLUE",
  INDIGO: "INDIGO",
  VIOLET: "VIOLET",
} as const;

export type RainbowColor = (typeof RainbowColor)[keyof typeof RainbowColor];

export const rainbowColorLabels: Record<RainbowColor, string> = {
  RED: "Vermelho",
  ORANGE: "Laranja",
  YELLOW: "Amarelo",
  GREEN: "Verde",
  BLUE: "Azul",
  INDIGO: "Anil",
  VIOLET: "Violeta",
};

export const rainbowColorValues = Object.values(RainbowColor) as [
  RainbowColor,
  ...RainbowColor[],
];

// ─── CPF Validation ───────────────────────────────────────────────────────────

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const calcDigit = (slice: string, factor: number) => {
    const sum = slice
      .split("")
      .reduce((acc, digit, i) => acc + parseInt(digit) * (factor - i), 0);
    const remainder = (sum * 10) % 11;
    return remainder >= 10 ? 0 : remainder;
  };

  const firstDigit = calcDigit(cleaned.slice(0, 9), 10);
  const secondDigit = calcDigit(cleaned.slice(0, 10), 11);

  return (
    firstDigit === parseInt(cleaned[9]) &&
    secondDigit === parseInt(cleaned[10])
  );
}

const COMMON_EMAIL_TYPO_DOMAINS = new Set([
  "gmai.com",
  "gmial.com",
  "gmal.com",
  "hotmial.com",
  "hotmil.com",
  "yahho.com",
  "yaho.com",
  "outlook.con",
  "outloook.com",
  "live.con",
]);

function isCommonTypoEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && COMMON_EMAIL_TYPO_DOMAINS.has(domain);
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(150, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),

  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(isValidCPF, "CPF inválido"),

  email: z
    .string()
    .email("E-mail inválido")
    .max(200, "E-mail muito longo")
    .refine((value) => !isCommonTypoEmailDomain(value), {
      message: "Domínio de e-mail inválido. Verifique se digitou corretamente.",
    }),

  favoriteColor: z.enum(rainbowColorValues, {
    errorMap: () => ({ message: "Selecione uma cor válida" }),
  }),

  observations: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .default(""),
});

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>;

// ─── API Response types ───────────────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type CustomerResponse = {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  favoriteColor: RainbowColor;
  observations: string;
  createdAt: string;
};
