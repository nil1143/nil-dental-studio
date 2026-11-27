"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/return-path";

type Mode = "signIn" | "signUp";
type Errors = Dictionary["auth"]["errors"];
type Field = "name" | "email" | "password";

// Same limits as Better Auth's defaults (emailAndPassword min/max password length).
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

function validate(mode: Mode, data: Record<Field, string>, errors: Errors) {
  const result: Partial<Record<Field, string>> = {};
  if (mode === "signUp" && !data.name.trim()) result.name = errors.nameRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) result.email = errors.emailInvalid;
  if (!data.password) result.password = errors.passwordRequired;
  else if (mode === "signUp" && data.password.length < PASSWORD_MIN) result.password = errors.passwordTooShort;
  else if (data.password.length > PASSWORD_MAX) result.password = errors.passwordTooLong;
  return result;
}

// Better Auth error → dictionary text. Unknown codes get the generic message (and nothing is logged).
function messageFor(error: { code?: string; status?: number }, errors: Errors) {
  if (error.status === 429) return errors.rateLimited;
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return errors.invalidCredentials;
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return errors.emailTaken;
    case "INVALID_EMAIL":
      return errors.emailInvalid;
    case "PASSWORD_TOO_SHORT":
      return errors.passwordTooShort;
    case "PASSWORD_TOO_LONG":
      return errors.passwordTooLong;
    default:
      return errors.generic;
  }
}

export function AuthForm({
  mode,
  locale,
  dict,
}: {
  mode: Mode;
  locale: Locale;
  dict: Dictionary["auth"];
}) {
  const router = useRouter();
  const rawNext = useSearchParams().get("next");
  const next = safeReturnPath(rawNext, locale);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const copy = dict[mode];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    const errors = validate(mode, data, dict.errors);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    const { error } =
      mode === "signUp"
        ? await authClient.signUp.email({
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password,
          })
        : await authClient.signIn.email({ email: data.email.trim(), password: data.password });
    if (error) {
      setFormError(messageFor(error, dict.errors));
      setPending(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  // Keep the validated `next` when switching between sign-in and sign-up.
  const switchHref = `/${locale}/${mode === "signIn" ? "sign-up" : "sign-in"}${
    rawNext ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  return (
    <form noValidate onSubmit={onSubmit} className="card measure mt-10 grid gap-6 p-6 md:p-8">
      {formError && (
        <p role="alert" className="text-small text-danger">
          {formError}
        </p>
      )}
      {mode === "signUp" && (
        <TextField
          name="name"
          label={dict.fields.name}
          autoComplete="name"
          error={fieldErrors.name}
        />
      )}
      <TextField
        name="email"
        type="email"
        label={dict.fields.email}
        autoComplete="email"
        error={fieldErrors.email}
      />
      <TextField
        name="password"
        type="password"
        label={dict.fields.password}
        autoComplete={mode === "signUp" ? "new-password" : "current-password"}
        hint={mode === "signUp" ? dict.fields.passwordHint : undefined}
        error={fieldErrors.password}
      />
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? copy.pending : copy.submit}
      </button>
      <p className="text-small text-ink-muted">
        {copy.switchPrompt}{" "}
        <Link href={switchHref} className="link text-ink">
          {copy.switchLink}
        </Link>
      </p>
    </form>
  );
}

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  hint,
  error,
}: {
  name: Field;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete: string;
  hint?: string;
  error?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-small font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
      />
      {hint && (
        <p id={hintId} className="text-small text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
