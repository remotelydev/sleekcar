"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Contact form request failed");
      }

      event.currentTarget.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Imię i nazwisko</span>
        <input name="name" autoComplete="name" required />
      </label>

      <label>
        <span>Numer telefonu</span>
        <input name="phone" autoComplete="tel" required />
      </label>

      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        <span>Treść</span>
        <textarea name="message" rows={6} required />
      </label>

      <button className="button button-primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Wysyłanie..." : "Wyślij wiadomość"}
      </button>

      {state === "sent" ? (
        <p className="form-status success">Dziękujemy. Wiadomość została wysłana.</p>
      ) : null}
      {state === "error" ? (
        <p className="form-status error">
          Formularz nie jest jeszcze skonfigurowany. Najszybciej bedzie zadzwonic.
        </p>
      ) : null}
    </form>
  );
}
