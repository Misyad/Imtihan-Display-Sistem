import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Preserve the Arabic-over-Indonesian line layout used by the source slides. */
export function formatQuestionText(text: string) {
  return text.replace(/\s+—\s+/g, "\n");
}
