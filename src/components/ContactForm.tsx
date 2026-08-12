"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    setState("sending");

    const formData = new FormData(form);
    const payload = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        payload.append(key, value);
      }
    });

    try {
      const response = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      if (!response.ok) {
        throw new Error("Contact form request failed");
      }

      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form
      className="contact-form"
      action="/netlify-forms.html"
      data-netlify="true"
      method="POST"
      name="contact"
      onSubmit={handleSubmit}
    >
      <input name="form-name" type="hidden" value="contact" />

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
          Nie udało się wysłać wiadomości. Najszybciej będzie zadzwonić.
        </p>
      ) : null}
    </form>
  );
}
