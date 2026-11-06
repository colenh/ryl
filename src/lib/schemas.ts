import { z } from "zod";
import { config } from "@/config";

const STREET_RE = /^\d+\s+\S/u;
const STATE_ZIP_RE = /^[A-Za-z][A-Za-z ]*(?:\d{5}(?:-\d{4})?)?$/u;

const isValidAddress = (val: string): boolean => {
  const parts = val
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) {
    return false;
  }
  if (!STREET_RE.test(parts[0])) {
    return false;
  }
  const lastPart = parts.at(-1);
  return STATE_ZIP_RE.test(lastPart ?? "");
};

const ADDRESS_MSG = `Include street number, name, city, and state (e.g. 123 Main St, ${config.school.location})`;

export const optionalAddress = z
  .string()
  .refine((val) => !val.trim() || isValidAddress(val.trim()), ADDRESS_MSG);

const posNumStr = (label: string) =>
  z
    .string()
    .optional()
    .refine(
      (val) => !val || (!Number.isNaN(Number(val)) && Number(val) > 0),
      `${label} must be a positive number`
    );

const wholeNumStr = (label: string) =>
  z
    .string()
    .optional()
    .refine(
      (val) => !val || (Number.isInteger(Number(val)) && Number(val) >= 0),
      `${label} must be a whole number`
    );

const gradeEnum = z.enum(["A", "B", "C", "D", "F"], {
  error: "Please select a grade",
});

export const loginSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === "" ? "Email is required" : "Invalid email address",
  }),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === "" ? "Email is required" : "Invalid email address",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === "" ? "Email is required" : "Invalid email address",
  }),
});

export const contactSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === "" ? "Email is required" : "Invalid email address",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const landlordFormSchema = z.object({
  address: optionalAddress,
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const reviewFormSchema = z.object({
  bathrooms: wholeNumStr("Bathrooms"),
  bedrooms: wholeNumStr("Bedrooms"),
  buildingCondition: gradeEnum,
  comment: z.string().min(10, "Review must be at least 10 characters"),
  grade: gradeEnum,
  propertyAddress: optionalAddress,
  rentAmount: posNumStr("Rent"),
  wouldRentAgain: z.boolean({ error: "Please select yes or no" }),
});

export const gradeOptions = [
  { label: "A — Excellent", value: "A" },
  { label: "B — Good", value: "B" },
  { label: "C — Average", value: "C" },
  { label: "D — Poor", value: "D" },
  { label: "F — Terrible", value: "F" },
];

export function zodErrors<T>(result: {
  success: false;
  error: z.ZodError<T>;
}): Record<string, string> {
  return Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors)
      .map(([k, msgs]) => [k, (msgs as string[])[0]])
      .filter(([, v]) => v)
  );
}
