"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-panel-request": "1" },
        body: JSON.stringify({ password: form.get("password"), code: form.get("code") })
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(body.error || "Logowanie nieudane.");
        return;
      }
      router.replace("/panel/rolki");
      router.refresh();
    } catch {
      setError("Brak połączenia. Spróbuj ponownie.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Hasło</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <label>
        <span>Kod z aplikacji (6 cyfr)</span>
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
        />
      </label>
      <button className="button button-primary" type="submit" disabled={sending}>
        {sending ? "Logowanie..." : "Zaloguj"}
      </button>
      {error ? (
        <p className="form-status error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
